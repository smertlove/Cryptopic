#include <iostream>
#include <fstream>

#include <string>

#include <cstring>
#include <cstdlib>
#include <cstdio>



#include <opencv2/core/core.hpp>
#include <opencv2/imgcodecs.hpp>

#include "Base64.h"
#include "lsb_encryptor.hpp"
#include "utils.h"


using namespace macaron;

extern "C" {
    char* call_manage_data(char* operation_type, char* b64_img, char* txt, char* img_extension) {

        // init b64 manager
        Base64 *B64Manager = new Base64();

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
        cv::Mat matrix_img = cv::imread("../output_imgs/" + filename);
        matrix_img = encode_lsb(matrix_img, std::string(txt));
        cv::imwrite("../output_encoded/" + filename, matrix_img);
        std::cout << "finish encoding" << std::endl;
        // remove("../output_imgs/fff.txt");



        std::cout << "decode try: " << std::endl;
        
        std::cout << decode_lsb(matrix_img) << std::endl;

        return b64_img;
    }
}
