// src/store/store.js  (or @/store/store.js)
import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./profileSlice";
import transactionsReducer from "./transactionsSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    transactions: transactionsReducer,
    cart: cartReducer,
    // add other slices here
  },
});

// optional typed hooks later if you want
