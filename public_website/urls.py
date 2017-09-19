from django.conf.urls import url
from public_website.views import IndexPageView


urlpatterns = [
	url(r'$', IndexPageView.as_view(), name='index'),
]