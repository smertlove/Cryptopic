from django.shortcuts import render
from django.views.generic import DetailView
from django.http import JsonResponse
from django.http import QueryDict

from random import choice
from string import ascii_letters

import ctypes
from ctypes import c_void_p, cdll

import json

def get_random_filename(n):
    return ''.join([choice(ascii_letters) for _ in range(n)])



lib = cdll.LoadLibrary('../cryptopic/main/cpp_services/bin/libmain.so')
lib.call_manage_data.restype = ctypes.c_void_p
lib.call_manage_data.argtypes = [
    ctypes.c_char_p,  ##
    ctypes.c_char_p,  ##
    ctypes.c_char_p,  ##
    ctypes.c_char_p
]

# lib.alloc_str.restype = ctypes.c_char_p
# lib.alloc_str.argtypes = [ctypes.c_size_t]

# lib.free_string.restype = ctypes.c_void_p
# lib.free_string.argtypes = [ctypes.c_char_p]

# def call_manage_data(arg1, arg2, arg3, arg4):
#     _result = lib.call_manage_data(arg1, arg2, arg3, arg4)
#     result = _result[:]
#     lib.free_string(_result)
#     return result


# g++ -fPIC -shared -o ./cpp_services/bin/libmain.so ./cpp_services/src/main.cpp
def index(request):
    return render(request, 'main/index.html')

def req(request):
    front_body = json.loads(request.body.decode('utf-8'))
    filename = get_random_filename(20)

    resp = {}  # responce

    if front_body["operationType"] == "encrypt-text":
        lib.call_manage_data(
            bytes(front_body["operationType"], encoding="utf-8"),
            bytes(front_body["picture"]["data"], encoding="utf-8"),
            bytes(front_body["message"], encoding="utf-8"),
            bytes("." + front_body["picture"]["type"], encoding="utf-8"),
            bytes(filename, encoding="utf-8")
        )

        file = open("../output_b64/"  + filename + ".txt")
        resp["picture"] = {}
        resp["picture"]["data"] = file.read()
        file.close()

    elif front_body["operationType"] == "decipher-text":
        lib.call_manage_data(
            bytes(front_body["operationType"], encoding="utf-8"),
            bytes(front_body["picture"]["data"], encoding="utf-8"),
            bytes("", encoding="utf-8"),
            bytes("." + front_body["picture"]["type"], encoding="utf-8"),
            bytes(filename, encoding="utf-8")
        )

        file = open("../output_b64/"  + filename + ".txt")
        resp["message"] = file.read()
        file.close()

    elif front_body["operationType"] == "encrypt-file":
        lib.call_manage_data(
            bytes(front_body["operationType"], encoding="utf-8"),
            bytes(front_body["picture"]["data"], encoding="utf-8"),
            bytes(front_body["file"]["data"], encoding="utf-8"),
            bytes("." + front_body["picture"]["type"], encoding="utf-8"),
            bytes(filename, encoding="utf-8")
        )
        file = open("../output_b64/"  + filename + ".txt")
        resp["picture"] = {}
        resp["picture"]["data"] = file.read()
        file.close()

    elif front_body["operationType"] == "decipher-file":
            lib.call_manage_data(
                bytes(front_body["operationType"], encoding="utf-8"),
                bytes(front_body["picture"]["data"], encoding="utf-8"),
                bytes("", encoding="utf-8"),
                bytes("." + front_body["picture"]["type"], encoding="utf-8"),
                bytes(filename, encoding="utf-8")
            )
            file = open("../output_b64/"  + filename + ".txt")
            resp["file"] = {}
            resp["file"]["data"] = file.read()
            file.close()




    # if front_body["operationType"] == "encrypt":
    #     print(1)
 
    # elif front_body["operationType"] == "decipher":
    #     print(2)
    #     lib.call_manage_data(
    #         bytes(front_body["operationType"], encoding="utf-8"),
    #         bytes(front_body["picture"]["data"], encoding="utf-8"),
    #         bytes("123", encoding="utf-8"),
    #         bytes("." + front_body["picture"]["type"], encoding="utf-8"),
    #         bytes(filename, encoding="utf-8")
    #     )
    
    
    # result = result.decode("utf-8")
    # print("C++ result:", result[:25])
    # file = open("../output_b64/"  + filename + ".txt")
    # del front_body["picture"]["data"]
    # front_body["picture"]["data"] = file.read()
    # file.close()
    return JsonResponse(resp, content_type="application/json")



# Что это? я падаю! у меня ноги подкашиваются» , — подумал он и упал на спину. Он раскрыл глаза, надеясь увидать, чем кончилась борьба французов с артиллеристами, и желая знать, убит или нет рыжий артиллерист, взяты или спасены пушки. Но он ничего не видал. Над ним не было ничего уже, кроме неба, — высокого неба, не ясного, но все-таки неизмеримо высокого, с тихо ползущими по нем серыми облаками. «Как тихо, спокойно и торжественно, совсем не так, как я бежал, — подумал князь Андрей, — не так, как мы бежали, кричали и дрались; совсем не так, как с озлобленными и испуганными лицами тащили друг у друга банник француз и артиллерист, — совсем не так ползут облака по этому высокому бесконечному небу. Как же я не видал прежде этого высокого неба? И как я счастлив, что узнал его наконец. Да! все пустое, все обман, кроме этого бесконечного неба. Ничего, ничего нет, кроме его. Но и того даже нет, ничего нет, кроме тишины, успокоения. И слава Богу!.. »

# Foreign languages are absolutely necessary for people nowadays. More and more people of different professions decide to study foreign languages in order to raise their professional level. Making business nowadays means the ability to speak at least one foreign language. Among the most popular foreign languages in Russia are English, German, Spanish. French and Italian.

# English is the language of business correspondence, many foreign newspapers and magazines, and communication between people of different nationalities all over the world. Reading foreign literature in the original, understanding foreign films without translation, making friends with people of other nationalities may make our intellectual and cultural horizons wider.

# Foreign languages often bring new perspectives in career and private life. Many aspects of our Life, like science, entertainment, business, studying became international. Many Russians decide to receive good education, start their career or just spend some time abroad. Upon returning to Russia they are able to share their knowledge, experience and information gained abroad with their colleagues and friends.


#   <script src="{% static 'main/js/app-libs.js' %}" charset="utf-8"></script>
#   <script src="{% static 'main/js/app.js' %}" charset="utf-8"></script>
# <script src="{% static 'main/js/app-modernizr.js' %}"></script>