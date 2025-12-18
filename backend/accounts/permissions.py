from rest_framework.permissions import BasePermission, IsAuthenticated # type: ignore warning

class IsAdminUser(BasePermission):
    """
    Allows access only to admin users.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'


class IsAdminOrCoAdmin(BasePermission):
    """
    Allows access to both admin and co-admin users.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role in ['admin', 'coadmin']