#include <cstring>
#include <string>

#include <random>

#include "utils.h"
#include "Base64.h"

using namespace macaron;

namespace utils {

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

}  // namespace utils