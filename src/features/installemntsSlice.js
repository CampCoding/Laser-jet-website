import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apiIntsance";
import { userApi } from "../api/userEndpoints";

const initialState = {
    loading : false,
    data: [],
    addLoading :false, 
    editLoading : false,
    deleteLoading : false,
    error : null,
    addError:null
}

export const handleFetchInstallment = createAsyncThunk("installmentsSlice/handleFetchInstallment",async() => {
    const response = await fetchData({url:userApi.routes.fetchInstallments});
    return response;
})

export const handleCreateInstallMent = createAsyncThunk("installmentsSlice/handleCreateInstallMent",async(body) => {
    console.log(body)
  const response = await fetchData({url:userApi.routes.createInstallment ,body , method:"POST"});
  return response;
})

export const intsallmentsSlice = createSlice({
    name:"installmentsSlice",
    initialState,
    extraReducers:(builder) => {
        builder
        .addCase(handleFetchInstallment.pending,(state, action) => {
            state.loading = true,
            state.error = null
        })
        .addCase(handleFetchInstallment.fulfilled,(state, action) => {
            state.loading = false,
            state.data = action.payload
        })
        .addCase(handleFetchInstallment.rejected ,(state,action) =>{
            state.loading=false,
            state.error = action.payload
        })
        .addCase(handleCreateInstallMent.pending,(state, action) => {
            state.addLoading = true
        })
        .addCase(handleCreateInstallMent.fulfilled,(state, action) => {
            state.addLoading = false
        })
        .addCase(handleCreateInstallMent.rejected ,(state,action) =>{
            state.addLoading=false,
            state.addError = action.payload
        })
    }
})

export default intsallmentsSlice.reducer;