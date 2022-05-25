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

#define INVALID_OPERATION_TYPE "ERROR: INVALID OPERATION TYPE"
#define INVALID_STEG_MANAGER   "ERROR: INVALID STEGANOGRAPHY FUNC CALLED"





int get_operation_type(char* operation_type) {
    if (!strcmp(operation_type, "decipher-text") || !strcmp(operation_type, "decipher-file")) {
        return DECRYPT;
    } else if (!strcmp(operation_type, "encrypt-text") || !strcmp(operation_type, "encrypt-file")) {
        return ENCRYPT;
    } else {
        return ERR_TYPE;
    }
}

int get_steg_manager_to_call(char* extension_type) {
    if (!strcmp(extension_type, ".png") || !strcmp(extension_type, ".bmp")) {
        return LSB;
    } else if (!strcmp(extension_type, ".jpg") || !strcmp(extension_type, ".jpeg") || !strcmp(extension_type, ".jfif")) {
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

std::string get_b64_meta_data(char* b64_str) {
    std::string meta;
    char* ptr = b64_str;
    while (*ptr != ',') {
        meta += *ptr;
        ++ptr;
    }
    meta += *ptr;
    std::cout << "meta: " << meta << std::endl;
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
        matrix_img = encode_dct(matrix_img, std::string(txt) + "!-$ex$y-!");
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
        case 2:  // DCT
            std::cout << "CALL DCT" << std::endl;
            answ = decode_dct(matrix_img);
            break;
        default:
            return INVALID_STEG_MANAGER;
    }

    // char* answ = decode_lsb(matrix_img);

    // cv::imwrite("../output_encoded/" + filename, matrix_img);
    // std::cout << "finish encoding" << std::endl;

    // std::vector<uchar> buf;
    // cv::imencode(img_extension, matrix_img, buf);
    // std::string enc_msg(buf.begin(), buf.end());
    // std::string encoded = B64Manager->Encode(enc_msg);
    // answ.erase(answ.find("!-$ex$y-!"));
    
    std::cout << "writing to file:" << std::endl;
    std::string fn = filename + ".txt";
    std::ofstream fout;
    fout.open("../output_b64/" + fn);
    fout << std::string(answ.begin(), answ.begin() + answ.find("!-$ex$y-!"));
    fout.close();
    std::cout << "done" << std::endl;

    
    
    return answ.c_str();
}











extern "C" {
    // main func
    void call_manage_data(char* operation_type, char* b64_img, char* txt, char* img_extension, char* filename) {

        std::string filename_      = std::string(filename);
        std::string img_extension_ = std::string(img_extension);

        std::cout << "------------> " << filename_ << img_extension_ << std::endl;

        // get operation type
        int operation = get_operation_type(operation_type);
        std::cout << "get operation type: success" << operation << std::endl;

        // choose steg func
        int steg_manager = get_steg_manager_to_call(img_extension);

        // decode b64
        Base64 *B64Manager = new Base64();
        std::string meta = get_b64_meta_data(b64_img);
        std::string img_decoded = decode_img(b64_img, B64Manager);
        std::cout << "decode b64 img: success" << std::endl;


        // save img with random name
        std::ofstream fout;
        std::string initial_img_fname = filename_ + img_extension_;

        fout.open("../output_imgs/" + initial_img_fname, std::ios::app |std::ios::binary);
        fout << img_decoded;
        fout.close();
        std::cout << "save decoded img: success" << std::endl;

        // magic happens!!
        if (operation == 1) {
            std::cout << "calling encrypt..." << std::endl;
            // delete B64Manager;
            const char* answ = encrypt(steg_manager, filename_, B64Manager, txt, img_extension_, meta).c_str();
            delete B64Manager;
            // return encrypt(steg_manager, filename, B64Manager, txt, img_extension, meta).c_str();
        } else if (operation == 2) {
            std::cout << "calling decrypt..." << std::endl;
            const char* answ = decrypt(steg_manager, filename_, B64Manager, img_extension_, meta).c_str();
            delete B64Manager;
            std::cout << answ << std::endl;
            // return answ;
        } else {
            // return INVALID_OPERATION_TYPE;
        }
    }

    // void delete_temp_files(char* filename, char* extension) {
    //     remove();
    //     remove();
    //     remove();
    // }
}


