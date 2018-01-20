from django.conf.urls import url, include
from rest_framework import routers
from api import views

router = routers.DefaultRouter()
router.register(r'tokens', views.TokenViewSet, base_name="tokens")
router.register(r'rooms', views.RoomViewSet)
router.register(r'hotels', views.HotelViewSet)
router.register(r'hubs', views.HubViewSet)

urlpatterns = [
    url(r'^token-auth/', views.ObtainExpiringAuthToken.as_view()),
    url(r'^contact-us/', views.ContactUs.as_view()),
    url(r'^', include(router.urls)),
]
