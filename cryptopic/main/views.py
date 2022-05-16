from django.shortcuts import render
from django.views.generic import DetailView
from django.http import JsonResponse
from django.http import QueryDict

import ctypes
from ctypes import cdll

import json


lib = cdll.LoadLibrary('../cryptopic/main/cpp_services/bin/libmain.so')
lib.call_manage_data.restype = ctypes.c_char_p
lib.call_manage_data.argtypes = [ctypes.c_char_p]


# g++ -fPIC -shared -o ./cpp_services/bin/libmain.so ./cpp_services/src/main.cpp
def index(request):
    return render(request, 'main/index.html')

def req(request):
    a = json.loads(request.body.decode('utf-8'))
    b = lib.call_manage_data(bytes(a["picture"], encoding="utf-8"))
    b += b" works nicely"
    return JsonResponse({"Большой привет": "с сервака", "picture" : b.decode("utf-8")}, content_type="application/json")