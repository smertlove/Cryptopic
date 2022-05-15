from django.shortcuts import render
from django.views.generic import DetailView
from django.http import JsonResponse
from django.http import QueryDict
# from .forms import UserForm



# import ctypes

# print("!!!!!!!!!_____________!!!!!!!!!!!!!_______________!!!!!!!!!!!!!")
# test = ctypes.CDLL('./objs/libtest.so')


def index(request):
    # userform = UserForm()
    return render(request, 'main/index.html')

def req(request):
    print(request)
    print(request.POST.get('text'))
    print(QueryDict(request.body))
    return JsonResponse({"msg": "Greetings, fellow user"}, content_type="application/json")