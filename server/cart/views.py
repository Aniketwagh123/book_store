from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.exceptions import ValidationError
from loguru import logger


class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get_cart(self, user):
        """
        Retrieves or creates a cart for the given user.

        Args:
            user: The user for whom the cart is being retrieved.

        Returns:
            Cart: The user's cart if found or created, None if an error occurs.
        """
        try:
            return Cart.objects.get_or_create(user=user, is_ordered=False)[0]
        except Exception as e:
            logger.error(f"Error fetching cart for user {user.id}: {e}")
            return None

    @swagger_auto_schema(
        responses={200: CartSerializer()},
        operation_description="Retrieve the user's cart."
    )
    def get(self, request):
        """
        Handles GET requests to retrieve the user's cart.

        Args:
            request: The HTTP request object.

        Returns:
            Response: A response containing the cart details or an error message.
        """
        try:
            cart = self.get_cart(request.user)
            if cart is None:
                return Response({
                    "message": "Failed to retrieve cart.",
                    "status": "error",
                    "error": "Unable to fetch cart details."
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            serializer = CartSerializer(cart)
            return Response({
                "message": "Cart retrieved successfully.",
                "status": "success",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Unexpected error occurred: {e}")
            return Response({
                "message": "An unexpected error occurred.",
                "status": "error",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def get_cart(self, user):
        """
        Retrieves or creates a cart for the given user.

        Args:
            user: The user for whom the cart is being retrieved.

        Returns:
            Cart: The user's cart if found or created, None if an error occurs.
        """
        try:
            return Cart.objects.get_or_create(user=user, is_ordered=False)[0]
        except Exception as e:
            logger.error(f"Error fetching cart for user {user.id}: {e}")
            return None

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['quantity'],
            properties={
                'quantity': openapi.Schema(
                    type=openapi.TYPE_INTEGER,
                    description='Quantity of the book to add to the cart',
                    example=1
                )
            }
        ),
        responses={
            201: openapi.Response(description='Item added to cart'),
            400: openapi.Response(
                description='Bad Request - Invalid quantity',
                examples={
                    'application/json': {
                        'error': 'Quantity must be greater than zero.'
                    }
                }
            ),
        },
        operation_description="Add a specific book to the cart or update its quantity."
    )
    def post(self, request, book_id):
        """
        Handles POST requests to add or update a book in the user's cart.

        Args:
            request: The HTTP request object.
            book_id: The ID of the book to be added to the cart.

        Returns:
            Response: A response indicating the result of the add/update operation.
        """
        try:
            cart = self.get_cart(request.user)
            if cart is None:
                return Response({
                    "message": "Failed to retrieve cart.",
                    "status": "error",
                    "error": "Unable to fetch cart details."
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            quantity = request.data.get('quantity', 0)

            if quantity <= 0:
                raise ValidationError(
                    {"error": "Quantity must be greater than zero."})

            data = {
                'cart': cart.id,  # type: ignore
                'book': book_id,
                'quantity': quantity,
            }

            serializer = CartItemSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    "message": "Item added to cart.",
                    "status": "success",
                    "data": serializer.data
                }, status=status.HTTP_201_CREATED)

            return Response({
                "message": "Failed to add item to cart.",
                "status": "error",
                "error": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        except ValidationError as e:
            return Response({
                "message": "Validation error occurred.",
                "status": "error",
                "error": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(
                f"Unexpected error occurred while adding item to cart: {e}")
            return Response({
                "message": "An unexpected error occurred.",
                "status": "error",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        responses={204: 'No Content', 404: 'Item not found in the cart.'},
        operation_description="Remove a specific book from the cart."
    )
    def delete(self, request, book_id):
        """
        Handles DELETE requests to remove a specific book from the user's cart.

        Args:
            request: The HTTP request object.
            book_id: The ID of the book to be removed from the cart.

        Returns:
            Response: A response indicating the result of the delete operation.
        """
        try:
            cart = self.get_cart(request.user)
            if cart is None:
                return Response({
                    "message": "Failed to retrieve cart.",
                    "status": "error",
                    "error": "Unable to fetch cart details."
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            cart_item = CartItem.objects.get(cart=cart, book_id=book_id)
            cart_item.delete()
            return Response({
                "message": "Item removed from cart.",
                "status": "success"
            }, status=status.HTTP_204_NO_CONTENT)
        except CartItem.DoesNotExist:
            return Response({
                "message": "Item not found in the cart.",
                "status": "error",
                "error": "The specified item does not exist."
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error deleting cart item: {e}")
            return Response({
                "message": "Failed to delete item.",
                "status": "error",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
