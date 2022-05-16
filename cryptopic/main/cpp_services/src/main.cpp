#include <iostream>
#include <fstream>

#include <string>
#include <cstring>
#include <cstdlib>

#include <random>

#include "Base64.h"

using namespace macaron;



extern "C" {
    char* call_manage_data(char* str, char* txt, char* name)    {

        while (*str != ',') {str++;}
        str++;

        std::cout << "c++ func called" << std::endl;


        std::string img_b64(str);

        std::string img_decoded;
        std::cout << "char converted to string" << std::endl;

        Base64 *B64Encoder = new Base64();
        std::cout << "init encoder" << std::endl;
        B64Encoder->Decode(img_b64, img_decoded);
        std::cout << "decode" << std::endl;
        

        std::ofstream fout;
        fout.open("../output_imgs/" + std::string(name) + ".png", std::ios::app |std::ios::binary);
        std::cout << "save" << std::endl;
        fout << img_decoded;
        fout.close();

        return str;
    }
}
