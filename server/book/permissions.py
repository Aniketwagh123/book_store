from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.exceptions import PermissionDenied


class IsSellerOrReadOnly(BasePermission):
    """
    Custom permission to allow only sellers to perform POST, PUT, and DELETE actions.
    Any authenticated user can perform GET actions.
    """

    def has_permission(self, request, view):
        # Allow any authenticated user to perform GET requests
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated

        # Only allow sellers to POST, PUT, DELETE
        if request.user.groups.filter(name='seller').exists():
            return True
        return False


class IsOwnerOrSuperuser(BasePermission):
    """
    Custom permission to allow only the owner or superuser to edit or delete the book.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        # Superusers can access everything
        if request.user.is_superuser:
            return True

        # Owners can perform actions on their books
        if obj.user == request.user:
            return True

        return False
