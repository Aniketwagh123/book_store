from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from cart.models import Cart
from cart.serializers import CartSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from loguru import logger
from django.db import transaction


class OrderView(APIView):
    permission_classes = [IsAuthenticated]

    def get_cart(self, user):
        """
        Helper function to get the user's active cart.
        """
        try:
            return Cart.objects.get(user=user, is_ordered=False)
        except Cart.DoesNotExist:
            return None

    @swagger_auto_schema(
        operation_description="Retrieve order details of the logged-in user.",
        responses={
            200: CartSerializer(many=True),
            404: openapi.Response(
                description="No orders found.",
                examples={"application/json": {"message": "No orders found.", "status": "error"}}
            ),
            500: openapi.Response(
                description="Error retrieving order.",
                examples={"application/json": {"message": "Error retrieving order.", "status": "error", "error": "details"}}
            ),
        }
    )
    def get(self, request):
        """
        Retrieve order details of the logged-in user (ordered cart).
        """
        try:
            cart = Cart.objects.filter(user=request.user, is_ordered=True)
            if not cart:
                return Response({"message": "No orders found.", "status": "error"}, status=status.HTTP_404_NOT_FOUND)

            serializer = CartSerializer(cart, many=True)
            return Response({
                "message": "Order details retrieved.",
                "status": "success",
                "data": serializer.data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error retrieving order: {e}")
            return Response({
                "message": "Error retrieving order.",
                "status": "error",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Place an order for the cart.",
        responses={
            200: openapi.Response(
                description="Order placed successfully.",
                examples={"application/json": {"message": "Order placed successfully.", "status": "success"}}
            ),
            400: openapi.Response(
                description="Bad Request - Cart is empty or insufficient stock.",
                examples={"application/json": {"message": "Cart is empty. Cannot place an order.", "status": "error"}}
            ),
            500: openapi.Response(
                description="Error placing order.",
                examples={"application/json": {"message": "Error placing order.", "status": "error", "error": "details"}}
            ),
        }
    )
    def post(self, request):
        """
        Place an order by marking the cart as ordered and adjusting the stock.
        """
        cart = self.get_cart(request.user)
        if not cart:
            return Response({"message": "No active cart found.", "status": "error"}, status=status.HTTP_400_BAD_REQUEST)

        cart_items = cart.items.all()  # type: ignore

        # Check if the cart is empty
        if not cart_items.exists():
            return Response({"message": "Cart is empty. Cannot place an order.", "status": "error"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                # Check stock for each book and adjust accordingly
                for item in cart_items:
                    if item.quantity > item.book.stock:
                        return Response({
                            "message": f"Not enough stock for {item.book.name}.",
                            "status": "error"
                        }, status=status.HTTP_400_BAD_REQUEST)

                    # Deduct stock
                    item.book.stock -= item.quantity
                    item.book.save()

                # Mark cart as ordered
                cart.is_ordered = True
                cart.save()

            return Response({
                "message": "Order placed successfully.",
                "status": "success"
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error placing order: {e}")
            return Response({
                "message": "Error placing order.",
                "status": "error",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Update the order to cancel it (mark as not ordered).",
        responses={
            200: openapi.Response(
                description="Order canceled successfully.",
                examples={"application/json": {"message": "Order canceled successfully.", "status": "success"}}
            ),
            404: openapi.Response(
                description="No ordered cart found.",
                examples={"application/json": {"message": "No ordered cart found.", "status": "error"}}
            ),
            500: openapi.Response(
                description="Error canceling order.",
                examples={"application/json": {"message": "Error canceling order.", "status": "error", "error": "details"}}
            ),
        }
    )
    def patch(self, request):
        """
        Change the `is_ordered` field to False (cancel the order) and adjust the book stock.
        """
        cart = Cart.objects.filter(user=request.user, is_ordered=True).first()
        if not cart:
            return Response({"message": "No ordered cart found.", "status": "error"}, status=status.HTTP_404_NOT_FOUND)

        try:
            with transaction.atomic():
                cart_items = cart.items.all()  # type: ignore

                # Restock the books
                for item in cart_items:
                    item.book.stock += item.quantity
                    item.book.save()

                # Mark cart as not ordered
                cart.is_ordered = False
                cart.save()

            return Response({
                "message": "Order canceled successfully.",
                "status": "success"
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error canceling order: {e}")
            return Response({
                "message": "Error canceling order.",
                "status": "error",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
