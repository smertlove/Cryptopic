// file management
#include <iostream>
#include <fstream>
#include <cstdio>

// various strings
#include <string>
#include <cstring>
#include <cstdlib>

// openCV (which has finally built)
#include <opencv2/core/core.hpp>
#include <opencv2/imgcodecs.hpp>

#include <vector>
#include <random>

// open sorce
#include "Base64.h"
#include "lsb_encryptor.hpp"
#include "dct_encryptor.hpp"

// our files
// #include "utils.h"


using namespace macaron;

enum operation_type {
    ENCRYPT = 1,
    DECRYPT,
    ERR_TYPE = -1
};

enum steg_manager_to_call {
    LSB = 1,
    DCT = 2,
    ERR_MANAGER = -1
};

int get_operation_type(char* operation_type) {
    if (strcmp(operation_type, "decipher")) {
        return DECRYPT;
    } else if (strcmp(operation_type, "encrypt")) {
        return ENCRYPT;
    } else {
        return ERR_TYPE;
    }
}

int get_img_extension(char* extension_type) {
    if (strcmp(extension_type, "png") || strcmp(extension_type, "bmp")) {
        return LSB;
    } else if (strcmp(extension_type, "jpg") || strcmp(extension_type, "jpeg")) {
        return DCT;
    } else {
        return ERR_MANAGER;
    }
}


std::string get_random_name(size_t start, size_t finish, size_t n) {
    std::random_device random_device;
    std::mt19937 generator(random_device());
    std::uniform_int_distribution<char> dis(start, finish);

    std::string result;
    for (size_t i = 0; i < n; i++) {
        result += dis(generator);
    }
    return result;
}

std::string decode_img(char* b64_img, Base64 *b64_manager) {
    // get rid of useless b64 part
    while (*b64_img != ',') {++b64_img;}
    ++b64_img;

    // call decoder
    std::string img_decoded;
    b64_manager->Decode(std::string(b64_img), img_decoded);

    return img_decoded;
}

char* encrypt(std::string filename, Base64* B64Manager, char* txt) {
    cv::Mat matrix_img = cv::imread("../output_imgs/" + filename);
    matrix_img = encode_lsb(matrix_img, std::string(txt));

    cv::imwrite("../output_encoded/" + filename, matrix_img);
    std::cout << "finish encoding" << std::endl;

    std::vector<uchar> buf;
    cv::imencode(".png", matrix_img, buf);
    std::string enc_msg(buf.begin(), buf.end());
    std::string encoded = B64Manager->Encode(enc_msg);
    char* answ = const_cast<char*>(encoded.c_str());
    std::cout << strlen(answ) << std::endl;
    return answ;
}

extern "C" {
    char* call_manage_data(char* operation_type, char* b64_img, char* txt, char* img_extension) {

        // init b64 manager
        Base64 *B64Manager = new Base64();
        std::cout << strlen(b64_img) << std::endl;
        // call decoder
        std::string img_decoded = decode_img(b64_img, B64Manager);

        // save img with random name
        std::ofstream fout;
        std::string filename = get_random_name(65, 90, 20) + ".png";

        fout.open("../output_imgs/" + filename, std::ios::app |std::ios::binary);
        std::cout << "save" << std::endl;
        fout << img_decoded;
        fout.close();

        // magic happens!!
        char *answ = encrypt(filename, B64Manager, txt);
        // remove("../output_imgs/fff.txt");

        return answ;
    }
}


// char* decrypt() {

// }