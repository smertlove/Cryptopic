#pragma once

enum {
    STORE_ONCE = 1,   // Stores the specified input once.
    STORE_FULL,       // Stores the specified input and fills the rest of the available space with zeros.
    STORE_REPEAT      // Stores the specified input in a repeating manner.
};