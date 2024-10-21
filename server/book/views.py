from rest_framework.exceptions import NotFound, ValidationError
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer
from .permissions import IsSellerOrReadOnly, IsOwnerOrSuperuser
from rest_framework.exceptions import PermissionDenied as DRFPermissionDenied
from django.core.exceptions import PermissionDenied as DjangoPermissionDenied
from rest_framework_simplejwt.authentication import JWTAuthentication
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from loguru import logger


class BookViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for performing CRUD operations on books with proper permissions.
    Sellers and superusers can create, update, or delete.
    Any authenticated user can retrieve books.
    """
    authentication_classes = [JWTAuthentication]
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsSellerOrReadOnly, IsOwnerOrSuperuser]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'name', openapi.IN_QUERY,
                description="Filter books by name (case-insensitive)",
                type=openapi.TYPE_STRING
            )
        ]
    )
    def get_queryset(self):
        """Get filtered queryset, based on optional query params like name."""
        queryset = super().get_queryset()
        name = self.request.query_params.get('name', None)
        if name:
            queryset = queryset.filter(name__icontains=name)
        return queryset

    @swagger_auto_schema(
        operation_description="Create a new book",
        responses={201: BookSerializer, 400: "Validation Error"}
    )
    def create(self, request, *args, **kwargs):
        """Handle the creation of a new book."""
        logger.info('ssssssssss')
        try:
            data = request.data.copy()
            data['user'] = request.user.id
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({"status": "error", "error": e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"status": "error", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Update an existing book",
        responses={200: BookSerializer,
                   404: "Book not found", 400: "Validation Error"}
    )
    def update(self, request, *args, **kwargs):
        """Handle updating an existing book."""
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()

            # Assign the user from the request
            data = request.data.copy()
            data['user'] = request.user.id

            serializer = self.get_serializer(
                instance, data=data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({"status": "error", "error": "Book not found."}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            return Response({"status": "error", "error": e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"status": "error", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Delete a book",
        responses={204: "No Content", 404: "Book not found"}
    )
    def destroy(self, request, *args, **kwargs):
        """Handle the deletion of a book."""
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response({"status": "success", "data": f"Book '{instance.name}' deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except ObjectDoesNotExist:
            return Response({"status": "error", "error": "Book not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"status": "error", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Retrieve a specific book",
        responses={200: BookSerializer, 404: "Book not found"}
    )
    def retrieve(self, request, *args, **kwargs):
        """Handle retrieving a single book."""
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({"status": "error", "error": "Book not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"status": "error", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="List all books or filtered books",
        responses={200: BookSerializer(many=True)},
        manual_parameters=[
            openapi.Parameter(
                'name', openapi.IN_QUERY,
                description="Filter books by name (case-insensitive)",
                type=openapi.TYPE_STRING
            )
        ]
    )
    def list(self, request, *args, **kwargs):
        """Handle listing all books or filtered books."""
        try:
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"status": "error", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def handle_exception(self, exc):
        """Handle any exception and return it in the custom format."""
        if isinstance(exc, (DRFPermissionDenied, DjangoPermissionDenied)):
            return Response({
                "status": "error",
                "error": "You do not have permission to perform this action."
            }, status=status.HTTP_403_FORBIDDEN)
        if isinstance(exc, ValidationError):
            return Response({"status": "error", "error": exc.detail}, status=status.HTTP_400_BAD_REQUEST)

        return super().handle_exception(exc)
