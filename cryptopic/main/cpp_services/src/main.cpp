// file management
#include <iostream>
#include <fstream>
#include <cstdio>

// various strings
#include <string>
#include <cstring>
#include <cstdlib>

// openCV
#include <opencv2/core/core.hpp>
#include <opencv2/imgcodecs.hpp>

// other std libs
#include <vector>
#include <random>

// open sorce
#include "Base64.h"
#include "lsb_encryptor.hpp"
#include "dct_encryptor.hpp"


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

#define INVALID_OPERATION_TYPE "ERROR: INVALID OPERATION TYPE"
#define INVALID_STEG_MANAGER   "ERROR: INVALID STEGANOGRAPHY FUNC CALLED"




// returns ENCRYPT(1), DECRYPT(2) or ERR_TYPE(-1).
int get_operation_type(char* operation_type) {
    if (!strcmp(operation_type, "decipher-text") || !strcmp(operation_type, "decipher-file")) {
        return DECRYPT;
    } else if (!strcmp(operation_type, "encrypt-text") || !strcmp(operation_type, "encrypt-file")) {
        return ENCRYPT;
    } else {
        return ERR_TYPE;
    }
}

// returns LSB(1) for lossless img formats, DCT(2) for various .jpegs or ERR_MANAGER(-1).
int get_steg_manager_to_call(char* extension_type) {
    if (!strcmp(extension_type, ".png") || !strcmp(extension_type, ".bmp")) {
        return LSB;
    } else if (!strcmp(extension_type, ".jpg") || !strcmp(extension_type, ".jpeg") || !strcmp(extension_type, ".jfif")) {
        return DCT;
    } else {
        return ERR_MANAGER;
    }
}


// generate a size n std::string with random ascii characters (range from "start" to "finish").
// UPD: this one is legacy. Filename generates in Python.
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

// gets rid of b64_img's metadata and calls "Decode" method of b64_manager on b64_img.
std::string decode_img(char* b64_img, Base64 *b64_manager) {
    // get rid of useless b64 part
    while (*b64_img != ',') {++b64_img;}
    ++b64_img;

    // call decoder
    std::string img_decoded;
    b64_manager->Decode(std::string(b64_img), img_decoded);

    return img_decoded;
}

// stores b64_str's metadata in an std::string.
std::string get_b64_meta_data(char* b64_str) {
    std::string meta;
    char* ptr = b64_str;
    while (*ptr != ',') {
        meta += *ptr;
        ++ptr;
    }
    meta += *ptr;
    return meta;
}

std::string encrypt(int steg_manager, std::string filename, Base64* B64Manager, char* txt, std::string img_extension, std::string meta) {
    std::cout << "------------> " << "../output_imgs/" + (filename + img_extension) << std::endl;
    cv::Mat matrix_img = cv::imread("../output_imgs/" + (filename + img_extension));
    

    switch (steg_manager) {
    case 1:  // LSB
        std::cout << "CALL LSB" << std::endl;
        matrix_img = encode_lsb(matrix_img, std::string(txt) + "!-$ex$y-!");
        break;
    case 2:  // DCT
        std::cout << "CALL DCT" << std::endl;
        for (int i = 0; i < 3; i++) {
            matrix_img = encode_dct(matrix_img, std::string(txt) + "!-$ex$y-!!-$ex$y-!!-$ex$y-!", 1, i, 80);
        }
        
        
        break;
    default:
        return INVALID_STEG_MANAGER;
    }
    std::cout << "encryption: SUCCESS" << std::endl;

    cv::imwrite("../output_encoded/" + (filename + img_extension), matrix_img);
    // std::cout << "finish encoding" << std::endl;

    std::vector<uchar> buf;
    cv::imencode(img_extension, matrix_img, buf);
    std::string enc_msg(buf.begin(), buf.end());

    std::cout << "finish encryption process" << std::endl;

    std::cout << "writing to file:" << std::endl;
    std::cout << "make filename" << std::endl;
    std::string fn = filename + ".txt";
    std::cout << "OK. make file obj" << std::endl;
    std::ofstream fout;
    std::cout << "OK. open it" << std::endl;
    fout.open("../output_b64/" + fn);
    std::cout << "OK. write to it" << std::endl;
    fout << (meta + B64Manager->Encode(enc_msg));
    std::cout << "OK. close it" << std::endl;
    fout.close();
    std::cout << "done writing" << std::endl;


    // return (meta + B64Manager->Encode(enc_msg)).c_str();
    return fn;
}

std::string decrypt(int steg_manager, std::string filename, Base64* B64Manager, std::string img_extension, std::string meta) {
    cv::Mat matrix_img = cv::imread("../output_imgs/" + (filename + img_extension));
    std::string answ;
    switch (steg_manager) {
        case 1:  // LSB
            std::cout << "CALL LSB" << std::endl;
            answ = decode_lsb(matrix_img);
            break;
        case 2:  // DCT (DOESN'T WORK!!!)
            std::cout << "CALL DCT" << std::endl;
            answ = repair(std::vector<std::string>{
                decode_dct(matrix_img, 0),
                decode_dct(matrix_img, 1),
                decode_dct(matrix_img, 2)
            });
            break;
        default:
            return INVALID_STEG_MANAGER;
    }


    std::cout << "writing to file:" << std::endl;
    std::cout << "make filename" << std::endl;

    std::string fn = filename + ".txt";
    std::cout << "OK. make file obj" << std::endl;

    std::ofstream fout;
    std::cout << "OK. open it" << std::endl;

    fout.open("../output_b64/" + fn);
    std::cout << "OK. write to it" << std::endl;
    std::cout << answ << std::endl;
    fout << std::string(answ.begin(), answ.begin() + answ.find("!-$ex$y-!")); //  <----- JPEG FALLS HERE
    std::cout << "OK. close it" << std::endl;

    fout.close();
    std::cout << "done" << std::endl;

    return answ.c_str();
}




// You can use theese from Python.
extern "C" {

// main func. CALL FROM PYTHON ONLY!!!
void call_manage_data(char* operation_type, char* b64_img, char* txt, char* img_extension, char* filename) {

    // copy filename and img_extension to a string
    std::string filename_      = std::string(filename);
    std::string img_extension_ = std::string(img_extension);

    // get operation type
    int operation = get_operation_type(operation_type);

    // choose steg func to call
    int steg_manager = get_steg_manager_to_call(img_extension);

    // decode b64_img
    Base64 *B64Manager = new Base64();
    std::string meta_ = get_b64_meta_data(b64_img);
    std::string img_decoded = decode_img(b64_img, B64Manager);

    // save decoded img
    std::ofstream fout;
    fout.open("../output_imgs/" + filename_ + img_extension_, std::ios::app |std::ios::binary);
    fout << img_decoded;
    fout.close();

    // magic happens!!
    if (operation == 1) {
        std::cout << "preparations done\ncalling encrypt..." << std::endl;
        const char* answ = encrypt(steg_manager, filename_, B64Manager, txt, img_extension_, meta_).c_str();
    } else if (operation == 2) {
        std::cout << "preparations done\ncalling decrypt..." << std::endl;
        const char* answ = decrypt(steg_manager, filename_, B64Manager, img_extension_, meta_).c_str();
    }

    // nearly forgot this :)
    delete B64Manager;
}


// gets rid of temp files. CALL FROM PYTHON ONLY!!!
void delete_temp_files(char* filenames[], size_t length) {
    for (size_t i = 0; i < length; i++) {
        remove(filenames[i]);
    }
}

}  // extern "C"
