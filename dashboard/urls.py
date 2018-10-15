from django.conf.urls import url
from dashboard.views import IndexPageView, LoginPageView


urlpatterns = [
    url(r'^login/', LoginPageView.as_view(), name='dashboard_login'),
    url(r'^$', IndexPageView.as_view(), name='dashboard_index')
]
