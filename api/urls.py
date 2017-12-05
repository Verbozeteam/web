from django.conf.urls import url, include
from rest_framework import routers
from api import views

router = routers.DefaultRouter()
router.register(r'tokens', views.TokenViewSet)
router.register(r'rooms', views.RoomViewSet)
router.register(r'hotels', views.HotelViewSet)
router.register(r'hubs', views.HubViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
]
