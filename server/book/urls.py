from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookViewSet

# Create a router and register the viewset
router = DefaultRouter()
router.register(r'', BookViewSet, basename='book')

# Define the URL patterns
urlpatterns = [
    path('', include(router.urls)),  # Includes all the routes for BookViewSet
]