import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apiIntsance";
import { userApi } from "../api/userEndpoints";

const initialState = {
  data: [],
  addLoading: false,
  editLoading: false,
  deleteLoading: false,
  error: null,
  loading: false,
};

export const handleCreateInstallment = createAsyncThunk(
  "cartSlice/handleInstallment",
  async (body) => {
    const response = await fetchData({
      url: userApi.routes.createInstallment,
      body,
      method: "POST",
    });
    return response;
  }
);

export const handleCreateCart = createAsyncThunk(
  "cartSlice/handleCreateOrder",
  async (body) => {
    const response = await fetchData({
      url: userApi.routes.createCart,
      body,
      method: "POST",
    });
    return response;
  }
);

export const handleFetchCart = createAsyncThunk(
  "cartSlice/handleFetchCart",
  async (user_id) => {
    const formData = new FormData();
    formData.append("user_id", user_id);
    const response = await fetchData({
      url: userApi.routes.fetchCart + `?user_id=${user_id}`,
      body: formData,
      isFile: true,
      method: "GET",
    });
    return response;
  }
);

export const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(handleCreateCart.pending, (state, action) => {
        (state.addLoading = true), (state.error = null);
      })
      .addCase(handleCreateCart.fulfilled, (state, action) => {
        state.addLoading = false;
      })
      .addCase(handleCreateCart.rejected, (state, action) => {
        (state.addLoading = false), (state.error = action.payload);
      })
      .addCase(handleFetchCart.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(handleFetchCart.fulfilled, (state, action) => {
        (state.loading = false), (state.data = action.payload);
      })
      .addCase(handleFetchCart.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(handleCreateInstallment.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(handleCreateInstallment.fulfilled, (state, action) => {
        (state.loading = false), (state.data = action.payload);
      })
      .addCase(handleCreateInstallment.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export default cartSlice.reducer;
