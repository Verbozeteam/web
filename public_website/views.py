from django.views.generic.base import TemplateView
from django.http import HttpResponse
from django.shortcuts import render
from django.conf import settings

class IndexPageView(TemplateView):
    def get(self, request, *args, **kwargs):
        return render(request, 'index.html', {"DEBUG": settings.DEBUG})

class SitemapView(TemplateView):
    def get(self, request, *args, **kwargs):
        return HttpResponse(open('public_website/templates/sitemap.xml').read(), content_type='text/xml')

