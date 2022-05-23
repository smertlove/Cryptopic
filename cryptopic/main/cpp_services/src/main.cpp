#include <iostream>
#include <fstream>

#include <string>

#include <cstring>
#include <cstdlib>
#include <cstdio>

#include <random>

#include <opencv2/core/core.hpp>

#include "Base64.h"
#include "lsb_encryptor.hpp"


using namespace macaron;

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

extern "C" {
    char* call_manage_data(char* b64_img, char* txt, char* name)    {

        // init b64 manager
        Base64 *B64Manager = new Base64();

        // call decoder
        std::string img_decoded = decode_img(b64_img, B64Manager);

        // save img with random name
        std::ofstream fout;
        std::string filename = "../output_imgs/" + get_random_name(65, 90, 20) + ".png";
        fout.open(filename, std::ios::app |std::ios::binary);
        std::cout << "save" << std::endl;
        fout << img_decoded;
        fout.close();

        // remove("../output_imgs/fff.txt");

        return b64_img;
    }
}
