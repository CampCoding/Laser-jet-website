import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { data } from "react-router-dom";
import { fetchData } from "../api/apiIntsance";
import { userApi } from "../api/userEndpoints";

const initialState = {
  data: [],
  loading: false,
  error: null,
  addGeneralLoading: false,
  editGeneralLoading: false,
};

export const fetchNotifications = createAsyncThunk(
  "notificationSlice/fetchNotification",
  async () => {
    const response = await fetchData({ url: userApi.routes.fetchNotification });
    return response;
  }
);

export const handleNotificationToSpecificUser = createAsyncThunk(
  "notificationSlice/handleNotificationToSpecificUser",
  async (body) => {
    body.type = "notify"
    const response = await fetchData({
      url: userApi.routes.createGeneralNotification,
      body,
      method: "POST",
    });
    return response;
  }
);

export const notificationSlice = createSlice({
  name: "notificationSlice",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state, action) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload);
      })
      .addCase(handleNotificationToSpecificUser.pending, (state, action) => {
        state.addGeneralLoading = true;
      })
      .addCase(handleNotificationToSpecificUser.fulfilled, (state, action) => {
        state.addGeneralLoading = false;
      })
      .addCase(handleNotificationToSpecificUser.rejected, (state, action) => {
        state.addGeneralLoading = false;
      });
  },
});

export default notificationSlice.reducer;
