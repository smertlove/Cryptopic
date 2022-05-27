from django.shortcuts import render
from django.views.generic import DetailView
from django.http import JsonResponse
from django.http import QueryDict

from random import choice
from string import ascii_letters

import ctypes
from ctypes import c_void_p, cdll

import json


###  generates a random filename (size n) for temp files  ###
def get_random_filename(n):
    return ''.join([choice(ascii_letters) for _ in range(n)])


###  CONFIGURE STEG LIBRARY  ###
lib = cdll.LoadLibrary('../cryptopic/main/cpp_services/bin/libmain.so')
lib.call_manage_data.restype = ctypes.c_void_p
lib.call_manage_data.argtypes = [
    ctypes.c_char_p,  ##  operation_type
    ctypes.c_char_p,  ##  imgage (b64)
    ctypes.c_char_p,  ##  text to encode
    ctypes.c_char_p,  ##  image extension (".png", ".jpg", etc...)
    ctypes.c_char_p   ##  filename (for temp files)
]

lib.delete_temp_files.restype = ctypes.c_void_p
LP_LP_c_char = ctypes.POINTER(ctypes.POINTER(ctypes.c_char))
lib.delete_temp_files.argtypes = [LP_LP_c_char, ctypes.c_size_t]

##  cpp lib func wrap  ##
def delete_temp_files(filenames):
    length = len(filenames)
    p = (ctypes.POINTER(ctypes.c_char) * length)()
    for i, filename in enumerate(filenames):
        p[i] = ctypes.create_string_buffer(filename)
    c_filenames = ctypes.cast(p, ctypes.POINTER(ctypes.POINTER(ctypes.c_char)))
    lib.delete_temp_files(c_filenames, length)



###  returns index template  ###
def index(request):
    return render(request, 'main/index.html')


###  returns JSON response with either a b64 encrypted image or decrypted text  ###
def req(request):
    ##  get request body as python dict
    front_body = json.loads(request.body.decode('utf-8'))

    ##  get random filename length 20
    filename = get_random_filename(20)

    resp = {}  # this will be JSON for responce


    if front_body["operationType"] == "encrypt-text":
        ##  call steg func
        lib.call_manage_data(
            bytes(front_body["operationType"], encoding="utf-8"),
            bytes(front_body["picture"]["data"], encoding="utf-8"),
            bytes(front_body["message"], encoding="utf-8"),
            bytes("." + front_body["picture"]["type"], encoding="utf-8"),
            bytes(filename, encoding="utf-8")
        )

        ##  make JSON for responce
        file = open("../output_b64/"  + filename + ".txt")
        resp["picture"] = {}
        resp["picture"]["data"] = file.read()
        file.close()

    elif front_body["operationType"] == "decipher-text":
        ##  call steg func
        lib.call_manage_data(
            bytes(front_body["operationType"], encoding="utf-8"),
            bytes(front_body["picture"]["data"], encoding="utf-8"),
            bytes("", encoding="utf-8"),
            bytes("." + front_body["picture"]["type"], encoding="utf-8"),
            bytes(filename, encoding="utf-8")
        )

        ##  make JSON for responce
        file = open("../output_b64/"  + filename + ".txt")
        resp["message"] = file.read()
        file.close()

    elif front_body["operationType"] == "encrypt-file":
        ##  call steg func
        lib.call_manage_data(
            bytes(front_body["operationType"], encoding="utf-8"),
            bytes(front_body["picture"]["data"], encoding="utf-8"),
            bytes(front_body["file"]["data"], encoding="utf-8"),
            bytes("." + front_body["picture"]["type"], encoding="utf-8"),
            bytes(filename, encoding="utf-8")
        )

        ##  make JSON for responce
        file = open("../output_b64/"  + filename + ".txt")
        resp["picture"] = {}
        resp["picture"]["data"] = file.read()
        file.close()

    elif front_body["operationType"] == "decipher-file":
        ##  call steg func
        lib.call_manage_data(
            bytes(front_body["operationType"], encoding="utf-8"),
            bytes(front_body["picture"]["data"], encoding="utf-8"),
            bytes("", encoding="utf-8"),
            bytes("." + front_body["picture"]["type"], encoding="utf-8"),
            bytes(filename, encoding="utf-8")
        )

        ##  make JSON for responce
        file = open("../output_b64/"  + filename + ".txt")
        resp["file"] = {}
        resp["file"]["data"] = file.read()
        file.close()


    ###  delete temp files
    filenames = [
        "../output_imgs/" + filename + front_body["picture"]["type"],
        "../output_encoded/" + filename + front_body["picture"]["type"],
        "../output_b64/" + filename + ".txt",
    ]

    delete_temp_files(
        [bytes(filename, encoding="utf-8") for filename in filenames]
    )

    ##  send JSON
    return JsonResponse(resp, content_type="application/json")





#   <script src="{% static 'main/js/app-libs.js' %}" charset="utf-8"></script>
#   <script src="{% static 'main/js/app.js' %}" charset="utf-8"></script>
#   <script src="{% static 'main/js/app-modernizr.js' %}"></script>