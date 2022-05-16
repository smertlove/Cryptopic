from django.shortcuts import render
from django.views.generic import DetailView
from django.http import JsonResponse
from django.http import QueryDict
# from .forms import UserForm
import ctypes
from ctypes import cdll


lib = cdll.LoadLibrary('../cryptopic/main/cpp_services/bin/libmain.so')
lib.call_manage_data.restype = ctypes.c_char_p
lib.call_manage_data.argtypes = [ctypes.c_char_p]


# g++ -fPIC -shared -o ./cpp_services/bin/libmain.so ./cpp_services/src/main.cpp
def index(request):
    return render(request, 'main/index.html')

def req(request):
    b = lib.call_manage_data(b"Privet, C++!")
    b += b" works nicely"
    print(b)
    return JsonResponse({"msg": "Greetings, fellow user"}, content_type="application/json")