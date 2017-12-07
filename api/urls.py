from django.conf.urls import url, include
from rest_framework import routers
# from rest_framework.authtoken import views as rest_framework_views
from api import auth_views
from api import views

router = routers.DefaultRouter()
router.register(r'tokens', views.TokenViewSet)
router.register(r'rooms', views.RoomViewSet)
router.register(r'hotels', views.HotelViewSet)
router.register(r'hubs', views.HubViewSet)

urlpatterns = [
    url(r'^token-auth/', auth_views.ObtainExpiringAuthToken.as_view()),
    url(r'^', include(router.urls)),
]
