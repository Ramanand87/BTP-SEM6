from django.contrib.auth.models import User
from user.models import Profile
from django.contrib.auth import authenticate
def authen(username,password):
    if username.isdigit():
        prof=Profile.objects.get(phoneno=username)
        return authenticate(username=prof.user.username,password=password)
    else:
        return authenticate(username=username,password=password)