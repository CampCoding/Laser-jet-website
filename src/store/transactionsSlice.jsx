// src/store/transactionsSlice.js (or @/store/transactionsSlice.js)
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import GetMytoken from "../lib/GetuserToken"; // عدّل المسار حسب مشروعك

// 👇 Async thunk = نسخة Redux من GetTransactionsData
export const getTransactionsThunk = createAsyncThunk(
  "transactions/fetch",
  // payload = { userId }
  async ({  }, { rejectWithValue }) => {
    try {
      const token = await GetMytoken();

      const res = await fetch(
        `https://lesarjet.camp-coding.site/api/admin/transactions/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          // cache: "no-store", // لو حابب تستعملها
        }
      );

      if (!res.ok) {
        return rejectWithValue("Failed to fetch transactions");
      }

      const data = await res.json();
      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unexpected error while fetching transactions";
      return rejectWithValue(message);
    }
  }
);

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: {
    data: null,
    status: "loading", //  'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    resetTransactions(state) {
      state.data = null;
      state.status = "loading";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTransactionsThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getTransactionsThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(getTransactionsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error?.message;
      });
  },
});

export const { resetTransactions } = transactionsSlice.actions;
export default transactionsSlice.reducer;
