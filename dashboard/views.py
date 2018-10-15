from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views.generic.base import TemplateView
from django.contrib.auth import authenticate, login

class IndexPageView(TemplateView):
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated() and hasattr(request.user, 'hotel_user'):
            return render(request, 'dashboard.html', {})
        return redirect('dashboard_login')

class LoginPageView(TemplateView):
    def get(self, request, *args, **kwargs):
        return render(request, 'dashboard_login.html', {})

    def post(self, request, *args, **kwargs):

        username = request.POST.get('inputUsername', None)
        password = request.POST.get('inputPassword', None)
        error = 'No username or password provided.'

        if username and password:
            user = authenticate(username=username, password=password)
            if user and hasattr(user, 'hotel_user'):
                login(request, user)
                return redirect('dashboard_index')
            elif not user:
                # user not authenticated
                error = 'Incorrect username or password.'
            else:
                # user is not a hotel user, no permission at access page
                error = 'You do not have permission to view this page.'

        return render(request, 'dashboard_login.html', {'error': error})
