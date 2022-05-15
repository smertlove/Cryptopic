#include <iostream>
#include <string>

// class ClientDataManager {
//     public:
//         // void receive_data(std::string str) {
//         //     return;
//         // }

//         // std::string send_data(std::string str) {
//         //     return str;
//         // }

//         int manage_data(int str) {
//              std::cout << "2 " << str << std::endl;
//             return str;
//         }
// };

extern "C" {
    // ClientDataManager* make_manager(){ return new ClientDataManager(); }
    // void call_receive_data(ClientDataController* ctrl, std::string str) { ctrl->receive_data(str); }
    char* call_manage_data(char* str)    {
        for (size_t i; i < 10; i++){
            std::cout << *str << std::endl;
            str++;
        }
         return str; }
}
