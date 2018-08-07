from django.conf.urls import url
from public_website.views import IndexPageView, SitemapView, RobotsView, qrcode
from public_website.misc import uuid4_regex_str

urlpatterns = [
	url(r'qrcode/$', qrcode, name='qrcode'),
	url(r'qrcode/(?P<token>' + uuid4_regex_str() + ')/', qrcode, name='qrcode'),
	url(r'robots.txt', RobotsView.as_view(), name='robot'),
	url(r'sitemap.xml', SitemapView.as_view(), name='sitemap'),
	url(r'', IndexPageView.as_view(), name='index'),
]
