from rest_framework import permissions

class IsHotelUser(permissions.BasePermission):

    def has_permission(self, request, view):
        #### can write custom code
        # user = User.objects.get(pk=view.kwargs['id']) # get user from user table.
        return hasattr(request.user, 'hotel_user')
