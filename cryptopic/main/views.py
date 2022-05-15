from django.shortcuts import render
from django.views.generic import DetailView
from django.http import JsonResponse
from django.http import QueryDict
# from .forms import UserForm
import ctypes
from ctypes import cdll


lib = cdll.LoadLibrary('../cryptopic/main/cpp_services/bin/libmain.so')
# lib.call_manage_data.argtypes = (ClientDataManager, ctypes.c_int)

# class ClientDataManager:
#     def __init__(self):
#         self.obj = lib.make_manager()

#     def manage(self, str):
#         lib.call_manage_data(self.obj, str)

# import ctypes

# print("!!!!!!!!!_____________!!!!!!!!!!!!!_______________!!!!!!!!!!!!!")
# test = ctypes.CDLL('./objs/libtest.so')

# gcc -fPIC -shared -o ./cpp_services/bin/libmain.so ./cpp_services/src/main.cpp
def index(request):
    # userform = UserForm()
    return render(request, 'main/index.html')

def req(request):
    # a = ClientDataManager()
    b = lib.call_manage_data(ctypes.create_unicode_buffer("privet zdarova", len("privet zdarova")))
    print(b)
    return JsonResponse({"msg": "Greetings, fellow user"}, content_type="application/json")