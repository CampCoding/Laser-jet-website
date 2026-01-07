import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userApi } from "../api/userEndpoints";
import { fetchData } from "../api/apiIntsance";

const initialState = {
    addLoading:false,
    deleteLoading:false,
    error:null,
    loading : false,
    data:[],
    editLoading:false
}

export const handleGetCreditForm = createAsyncThunk("creditFormSlice/handleGetCreditForm",async({user_id}) => {
    const response = await fetchData({url:`credit-forms?user_id=${user_id}`});
    return response;
})

export const handleCreateCreditForm = createAsyncThunk("creditFormSlice/handleCreateCreditForm",async(body) => {
    const response = await fetchData({url:userApi.routes.createCreditForm , isFile:true, body , method:"POST"});
    return response;
})

export const handleDeleteDetail = createAsyncThunk("creditFormSlice/handleDeleteDetails",async({detail_id}) => {
    const response = await fetchData({url:`credit-forms/detail/delete`+`?detail_id=${detail_id}`, method:"DELETE"});
    return response;
})

export const handleUpdateCreditForm = createAsyncThunk("creditFormSlice/handleUpdateCreditForm",async(body) => {
    const response = await fetchData({url:userApi.routes.updateCreditForm, method:"PUT",body , isFile:true});
    return response;
})

export const creditFormSlice = createSlice({
    name:"creditFormSlice",
    initialState,
    extraReducers :(builder) => {
        builder
        .addCase(handleGetCreditForm.pending ,(state, action) => {
            state.loading = true
        })
        .addCase(handleGetCreditForm.fulfilled,(state,action) => {
            state.loading = false,
            state.data = action.payload
        })
        .addCase(handleGetCreditForm.rejected ,(state,action) => {
            state.loading = false,
            state.error = action.payload
        })
        .addCase(handleCreateCreditForm.pending ,(state, action) => {
            state.addLoading = true
        })
        .addCase(handleCreateCreditForm.fulfilled,(state,action) => {
            state.addLoading = false 
        })
        .addCase(handleCreateCreditForm.rejected ,(state,action) => {
            state.addLoading = false,
            state.error = action.payload
        })
        .addCase(handleDeleteDetail.pending ,(state, action) => {
            state.deleteLoading = true
        })
        .addCase(handleDeleteDetail.fulfilled,(state,action) => {
            state.deleteLoading = false 
        })
        .addCase(handleDeleteDetail.rejected ,(state,action) => {
            state.deleteLoading = false
        })
        .addCase(handleUpdateCreditForm.pending ,(state, action) => {
            state.editLoading = true
        })
        .addCase(handleUpdateCreditForm.fulfilled,(state,action) => {
            state.editLoading = false 
        })
        .addCase(handleUpdateCreditForm.rejected ,(state,action) => {
            state.editLoading = false
        })
    }
})

export default creditFormSlice.reducer;