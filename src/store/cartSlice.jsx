// src/store/cartSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const CART_API_URL = "https://lesarjet.camp-coding.site/api/user/cart/list";

// 🔵 Thunk لجلب سلة التسوق
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

// ✅ Initial State
const initialState = {
  data: null, // response كله (success, message, data)
  items: [], // اختصار سريع لـ data.data
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

// ✅ Helpers
const toNum = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

// ✅ Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // مسح سلة التسوق من الـ state (لو حبيت تستعملها عند تسجيل الخروج مثلاً)
    resetCart: () => initialState,

    // ✅ تحديث كمية منتج محليًا (بدون refetch)
    setCartItemQty: (state, action) => {
      const { product_id, quantity } = action.payload || {};
      const pid = toNum(product_id, null);
      if (pid == null) return;

      const item = state.items?.find(
        (x) => toNum(x.product_id) === pid
      );
      if (!item) return;

      item.quantity = Math.max(1, toNum(quantity, 1));
    },

    // ✅ زيادة كمية منتج محليًا
    incCartItemQty: (state, action) => {
      const { product_id, step = 1 } = action.payload || {};
      const pid = toNum(product_id, null);
      if (pid == null) return;

      const item = state.items?.find(
        (x) => toNum(x.product_id) === pid
      );
      if (!item) return;

      const s = Math.max(1, toNum(step, 1));
      item.quantity = Math.max(1, toNum(item.quantity, 1) + s);
    },

    // ✅ تقليل كمية منتج محليًا
    decCartItemQty: (state, action) => {
      const { product_id, step = 1 } = action.payload || {};
      const pid = toNum(product_id, null);
      if (pid == null) return;

      const item = state.items?.find(
        (x) => toNum(x.product_id) === pid
      );
      if (!item) return;

      const s = Math.max(1, toNum(step, 1));
      item.quantity = Math.max(1, toNum(item.quantity, 1) - s);
    },

    // ✅ حذف منتج محليًا (بدون refetch)
    removeCartItemLocal: (state, action) => {
      const { product_id } = action.payload || {};
      const pid = toNum(product_id, null);
      if (pid == null) return;

      state.items = (state.items || []).filter(
        (x) => toNum(x.product_id) !== pid
      );

      // optional: لو بتحب data كمان يبقى متسق
      if (state.data?.data) {
        state.data.data = state.items;
      }
    },

    // ✅ استبدال items مرة واحدة (مفيد للـ rollback السريع لو حبيت)
    setCartItemsLocal: (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : [];
      if (state.data?.data) {
        state.data.data = state.items;
      }
    },
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

export const {
  resetCart,
  setCartItemQty,
  incCartItemQty,
  decCartItemQty,
  removeCartItemLocal,
  setCartItemsLocal,
} = cartSlice.actions;

export default cartSlice.reducer;
