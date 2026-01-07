import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apiIntsance";
import { conifgs } from "../config";
import { userApi } from "../api/userEndpoints";

const initialState = {
    loading :false,
    addLoading:false ,
    editLoading:false, 
    deleteLoading:false,
    error:null,
    addError:null,
    editError:null,
    deleteError:null,
    data:[]
}

export const getSettings = createAsyncThunk("settingsSlice/getSettings",async () => {
    const response = await fetchData({url:userApi.routes.fetchSetting})
    return response;
})

export const updateSettings = createAsyncThunk("settingsSlice/updateSettings",async(body) => {
  const response = await fetchData({url:userApi.routes.updateSetting, method:"PUT", body,isFile:true});
  return response;
})

export const settingsSlice = createSlice({
    name:"settingsSlice",
    initialState,
    extraReducers:(builder) => {
        builder
        .addCase(getSettings.pending ,(state, action) => {
            state.loading = true,
            state.error = null
        })
        .addCase(getSettings.fulfilled,(state, action) => {
            state.loading = false,
            state.data = action.payload
        })
        .addCase(getSettings.rejected,(state, action) => {
            state.loading = false,
            state.error= action.payload
        })
        .addCase(updateSettings.pending ,(state, action) => {
            state.editLoading = true,
            state.editError = null
        })
        .addCase(updateSettings.fulfilled,(state, action) => {
            state.editLoading = false
        })
        .addCase(updateSettings.rejected,(state, action) => {
            state.editLoading = false,
            state.editError= action.payload
        })
    }
})

export default settingsSlice.reducer;