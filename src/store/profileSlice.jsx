// src/store/profileSlice.js  (or @/store/profileSlice.js)
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  // allow optional { token } like your old function
  async ({ token } = {}, { rejectWithValue }) => {
    try {
      let authToken = token ;

      // نفس منطق الدالة القديمة
      if (!authToken) {
        const { default: GetMytoken } = await import("@/lib/GetuserToken");
        authToken = await GetMytoken();
      }

      if (!authToken) {
        throw new Error("Missing access token for profile request");
      }

      const res = await fetch(
        "https://lesarjet.camp-coding.site/api/user/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!res.ok) {
        return rejectWithValue("Unable to fetch profile data");
      }

      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Unable to fetch profile data");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    data: null,
    status: "loading",  // 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    clearProfile(state) {
      state.data = null;
      state.status = "loading";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error?.message;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
