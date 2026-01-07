import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apiIntsance";
import { userApi } from "../api/userEndpoints";

const initialState = {
  loading: false,
  sendVerificationCodeLoading: false,
  verifyCodeLoading: false,
  verificationCodeData: [],
  editLoading: false,
  addLoading: false,
  data: [],
  orderDetails: [],
  loadingDetails: false,
  error: null,
};

export const handleFetcOrders = createAsyncThunk(
  "ordersSlice/handleFetcOrders",
  async (
    { page = 1, per_page = 20, keywords, from, to },
    { rejectWithValue }
  ) => {
    try {
      let apiUrl = `${userApi.routes.fetchOrders}?page=${page}&per_page=${per_page}`;
      const params = new URLSearchParams();

      if (keywords) params.append("keywords", keywords);
      if (from && to) {
        params.append("from", from);
        params.append("to", to);
      }

      apiUrl += `&${params.toString()}`;

      const response = await fetchData({ url: apiUrl });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const handleCreateOrder = createAsyncThunk(
  "ordersSlice/handleCreateOrder",
  async (body) => {
    const response = await fetchData({
      url: userApi.routes.createOrder,
      method: "POST",
      body,
    });
    return response;
  }
);

export const handleFetchOrderDetails = createAsyncThunk(
  "ordersSlice/handleFetchOrderDetails",
  async ({ order_id }) => {
    const response = await fetchData({
      url: userApi.routes.fetchOrderDetails + `?order_id=${order_id}`,
      isFile: true,
      body: { order_id },
    });
    return response;
  }
);

export const handleEditOrder = createAsyncThunk(
  "ordersSlice/handleEditOrder",
  async (body) => {
    const response = await fetchData({
      url: userApi.routes.updateOrder,
      body,
      method: "PUT",
    });
    return response;
  }
);

export const handleSendOtp = createAsyncThunk(
  "ordersSlice/handleSendOtp",
  async ({ formData, phone }) => {
    const response = await fetchData({
      url:
        userApi.routes.sendVerificationCode +
        `?phone=${phone}&order_confirm=${1}`,
      isFile: true,
      body: formData,
    });
    return response;
  }
);

export const handleVerifyCode = createAsyncThunk(
  "ordersSlice/handleVerifyCode",
  async ({ body, phone }) => {
    const response = await fetchData({
      url: userApi.routes.verifyCode + `?phone=${phone}`,
      method: "PUT",
      body,
    });
    return response;
  }
);

export const ordersSlice = createSlice({
  name: "ordersSlice",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(handleFetcOrders.pending, (state, action) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(handleFetcOrders.fulfilled, (state, action) => {
        (state.loading = false), (state.data = action.payload);
      })
      .addCase(handleFetcOrders.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload);
      })
      .addCase(handleEditOrder.pending, (state, action) => {
        state.editLoading = true;
      })
      .addCase(handleEditOrder.fulfilled, (state, action) => {
        state.editLoading = false;
      })
      .addCase(handleEditOrder.rejected, (state, action) => {
        state.editLoading = false;
      })
      .addCase(handleFetchOrderDetails.pending, (state, action) => {
        state.loadingDetails = true;
      })
      .addCase(handleFetchOrderDetails.fulfilled, (state, action) => {
        (state.loadingDetails = false), (state.orderDetails = action.payload);
      })
      .addCase(handleFetchOrderDetails.rejected, (state, action) => {
        state.loadingDetails = false;
      })
      .addCase(handleCreateOrder.pending, (state, action) => {
        state.addLoading = true;
      })
      .addCase(handleCreateOrder.fulfilled, (state, action) => {
        state.addLoading = false;
      })
      .addCase(handleCreateOrder.rejected, (state, action) => {
        state.addLoading = false;
      })
      .addCase(handleSendOtp.pending, (state, action) => {
        state.sendVerificationCodeLoading = true;
      })
      .addCase(handleSendOtp.fulfilled, (state, action) => {
        (state.sendVerificationCodeLoading = false),
          (state.verificationCodeData = action.payload);
      })
      .addCase(handleSendOtp.rejected, (state, action) => {
        state.sendVerificationCodeLoading = false;
      })
      .addCase(handleVerifyCode.pending, (state, action) => {
        state.verifyCodeLoading = true;
      })
      .addCase(handleVerifyCode.fulfilled, (state, action) => {
        state.verifyCodeLoading = false;
      })
      .addCase(handleVerifyCode.rejected, (state, action) => {
        state.verifyCodeLoading = false;
      });
  },
});

export default ordersSlice.reducer;
