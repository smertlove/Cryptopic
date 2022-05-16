#include <iostream>
#include <string>
#include <cstring>
#include <cstdlib>


extern "C" {
    char* call_manage_data(char* str)    {
        std::cout << "c++ func called" << std::endl;
        char* ptr = str;
        *(ptr + 5) = 'R';
        *(ptr + 6) = 'U';
        return str;
    }
}
