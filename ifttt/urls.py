from django.conf.urls import url, include
from rest_framework import routers
from ifttt import views

# router = routers.DefaultRouter()
# router.register(r'actions', views.ActionsViewSet, base_name="actions")
# router.register(r'triggers', views.TriggersViewSet, base_name="triggers")

urlpatterns = [
    url(r'^status/?$', views.status_view),
    url(r'^test/setup/?$', views.setup_view),
    url(r'^actions/turn_light_on', views.turn_light_on),
    url(r'^actions/turn_light_off', views.turn_light_off),
    # url(r'^', include(router.urls)),
]
