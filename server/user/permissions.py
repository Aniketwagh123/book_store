from rest_framework.permissions import BasePermission

class IsSeller(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='seller').exists()

class IsBuyer(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='buyer').exists()
