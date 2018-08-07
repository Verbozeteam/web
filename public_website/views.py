from django.views.generic.base import TemplateView
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.conf import settings

import os

class IndexPageView(TemplateView):
    def get(self, request, *args, **kwargs):
        return render(request, 'index.html', {"DEBUG": settings.DEBUG})

def qrcode(request, token=''):
    device_os = request.user_agent.os.family
    app_store_link = os.environ.get('APP_STORE_LINK', '')
    play_store_link = os.environ.get('PLAY_STORE_LINK', '')

    if device_os == 'iOS' and app_store_link:
        return redirect(app_store_link)

    elif device_os == 'Android' and play_store_link:
        return redirect(play_store_link)

    return redirect('/')

class SitemapView(TemplateView):
    def get(self, request, *args, **kwargs):
        return HttpResponse(open('public_website/templates/sitemap.xml').read(), content_type='text/xml')

class RobotsView(TemplateView):
	def get(self, request, *args, **kwargs):
		return HttpResponse(open('public_website/templates/robots.txt').read(), content_type='text/txt')
