// src/store/cartSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const CART_API_URL = "https://lesarjet.camp-coding.site/api/user/cart/list";

// 🔵 Thunk لجلب سلة التسوق
// تقدر تبعتله { token } لو محتاج Authorization
export const getCartThunk = createAsyncThunk(
  "cart/getCart",
  async ({ token } = {}, { rejectWithValue }) => {
    try {
      let authToken = token;

      // نفس منطق الدالة القديمة
      if (!authToken) {
        const { default: GetMytoken } = await import("@/lib/GetuserToken");
        authToken = await GetMytoken();
      }

      if (!authToken) {
        throw new Error("Missing access token for profile request");
      }

      const response = await axios.get(CART_API_URL, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // شكل الريسبونس:
      // { success: true, message: "...", data: [ ... ] }
      if (response.data?.success) {
        return response.data;
      } else {
        return rejectWithValue(
          response.data?.message || "فشل في جلب سلة التسوق"
        );
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "حدث خطأ أثناء جلب سلة التسوق";
      return rejectWithValue(msg);
    }
  }
);

// 🔵 Initial State
const initialState = {
  data: null, // هنا هيكون الـ response كله (success, message, data)
  items: [], // اختصار سريع لـ data.data
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

// 🔵 Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // مسح سلة التسوق من الـ state (لو حبيت تستعملها عند تسجيل الخروج مثلاً)
    resetCart: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCartThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getCartThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        state.items = action.payload?.data || [];
        state.error = null;
      })
      .addCase(getCartThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "فشل في جلب سلة التسوق";
      });
  },
});

export const { resetCart } = cartSlice.actions;

export default cartSlice.reducer;
