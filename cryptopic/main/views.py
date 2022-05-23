from django.shortcuts import render
from django.views.generic import DetailView
from django.http import JsonResponse
from django.http import QueryDict

from random import randint

import ctypes
from ctypes import cdll

import json


lib = cdll.LoadLibrary('../cryptopic/main/cpp_services/bin/libmain.so')
lib.call_manage_data.restype = ctypes.c_char_p
lib.call_manage_data.argtypes = [ctypes.c_char_p, ctypes.c_char_p, ctypes.c_char_p, ctypes.c_char_p]


# g++ -fPIC -shared -o ./cpp_services/bin/libmain.so ./cpp_services/src/main.cpp
def index(request):
    return render(request, 'main/index.html')

def req(request):

    front_body = json.loads(request.body.decode('utf-8'))
    # print(front_body["picture"]["width"])
    # print(front_body["picture"]["type"])
    pic = lib.call_manage_data(
        bytes(front_body["operationType"], encoding="utf-8"),
        bytes(front_body["picture"]["data"], encoding="utf-8"),
        bytes(front_body["message"], encoding="utf-8"),
        bytes(front_body["picture"]["type"], encoding="utf-8")
    )
    return JsonResponse(front_body, content_type="application/json")






#   <script src="{% static 'main/js/app-libs.js' %}" charset="utf-8"></script>
#   <script src="{% static 'main/js/app.js' %}" charset="utf-8"></script>
# <script src="{% static 'main/js/app-modernizr.js' %}"></script>