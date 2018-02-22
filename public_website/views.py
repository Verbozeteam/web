from django.views.generic.base import TemplateView
from django.http import HttpResponse

class IndexPageView(TemplateView):

    template_name = "index.html"

class SitemapView(TemplateView):
    def get(self, request, *args, **kwargs):
        return HttpResponse(open('public_website/templates/sitemap.xml').read(), content_type='text/xml')

