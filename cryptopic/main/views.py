from django.shortcuts import render
from django.views.generic import DetailView
from django.http import JsonResponse

def index(request):
    return render(request, 'main/index.html')

def req(request):
    print("Got request")
    return JsonResponse({"msg": "Greetings, fellow user"}, content_type="application/json")