from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User
from api.models import *

admin.site.register(User, UserAdmin)
admin.site.register(Room)
admin.site.register(Hotel)
admin.site.register(Hub)
admin.site.register(Service)
admin.site.register(ServiceAction)
admin.site.register(ServiceActionQuantity)
admin.site.register(Token)
admin.site.register(GuestUser)
admin.site.register(HotelUser)
admin.site.register(HubUser)
