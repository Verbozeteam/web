from django.conf.urls import url
from public_website.views import IndexPageView, SitemapView, RobotsView


urlpatterns = [
	url(r'robots.txt', RobotsView.as_view(), name='robot'),
	url(r'sitemap.xml', SitemapView.as_view(), name='sitemap'),
	url(r'', IndexPageView.as_view(), name='index'),
]