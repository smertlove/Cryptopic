#include <iostream>
#include <fstream>

#include <string>
#include <cstring>
#include <cstdlib>

#include "Base64.h"

using namespace macaron;

extern "C" {
    char* call_manage_data(char* str)    {
        while (*str != ',') {str++;}
        str++;

        std::cout << "c++ func called" << std::endl;
        size_t size = strlen(str);
        std::string img_b64(str, size);
        std::string img_decoded;
        std::cout << "char converted to string" << std::endl;

        Base64 *B64Encoder = new Base64();
        std::cout << "init encoder" << std::endl;
        B64Encoder->Decode(img_b64, img_decoded);
        std::cout << "decode" << std::endl;
        size_t size2 = img_decoded.length();

        std::ofstream fout;
        fout.open("../output.png", std::ios::app |std::ios::binary);
        fout << img_decoded;
        // fout.write(img_decoded, size2);
        fout.close();
        return str;
    }
}
