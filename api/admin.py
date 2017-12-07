from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User
from api.models import *

admin.site.register(User, UserAdmin)
admin.site.register(Guest)
admin.site.register(Room)
admin.site.register(Hotel)
admin.site.register(Hub)
admin.site.register(Token)
admin.site.register(GuestUser)
admin.site.register(HotelUser)
admin.site.register(HubUser)
