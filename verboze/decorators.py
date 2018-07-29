from django.shortcuts import redirect

# superuser_only takes in optional next redirect paramater after login
def superuser_only(next='/admin/'):

  # takes in function being decorated
  def _outer(function):

    # performs decorator logic
    def _inner(request, *args, **kwargs):
      if not request.user.is_superuser:
          return redirect('/admin/login/?next=' + next)
      else:
        return function(request, *args, **kwargs)

    return _inner

  return _outer
