cmake_minimum_required(VERSION 2.8)

project(cryptopic)

set(OpenCV_DIR ../../../../build/) #  change folder if needed
find_package(OpenCV REQUIRED)
include_directories(${OpenCV_INCLUDE_DIRS})



set(HDRS ../include)
set(SOURCE_EXE main.cpp)

add_library(main SHARED ${SOURCE_EXE})

target_include_directories(main PRIVATE ${HDRS})

target_link_libraries(main ${OpenCV_LIBS})