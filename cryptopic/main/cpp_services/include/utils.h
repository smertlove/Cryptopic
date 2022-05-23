#pragma once

#include <string>

#include "Base64.h"
using namespace macaron;
namespace utils {

int get_operation_type(char* operation_type);
int get_img_extension(char* extension_type);

std::string get_random_name(size_t start, size_t finish, size_t n);
std::string decode_img(char* b64_img, Base64 *b64_manager);

}  // namespace utils