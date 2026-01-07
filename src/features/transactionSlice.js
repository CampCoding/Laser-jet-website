import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apiIntsance";
import { userApi } from "../api/userEndpoints";


const initialState = {
    data:[],
    editLoading:false,
    originalInstallments :[],
    loading:false,
    error:null,
    installmentError:null
}

export const handleFetchAdminTransactions = createAsyncThunk("transactionsSlice/handleFetchAdminTransactions",async() =>{
    const response = await fetchData({url:userApi.routes.fetchAdminTransaction});
    return response
})

export const handleUpdateInstallmentTransaction = createAsyncThunk("transactionsSlice/handleUpdateInstallmentTransaction",async(body) =>{
    const res = await fetchData({url:userApi.routes.updateTransactionInstallment , method:"PUT",body})
    return res;
})

export const transactionsSlice = createSlice({
    name:"transactionsSlice",
    initialState,
    extraReducers:(builder) => {
        builder
        .addCase(handleFetchAdminTransactions.pending , (state, action) => {
            state.loading = true,
            state.error = false
        })
        .addCase(handleFetchAdminTransactions.fulfilled ,(state, action) => {
            state.data = action.payload,
            state.originalInstallments = action.payload,
            state.loading = false
        })
        .addCase(handleFetchAdminTransactions.rejected ,(state,action) => {
            state.error = action.payload,
            state.loading = false
        })
        .addCase(handleUpdateInstallmentTransaction.pending , (state, action) => {
            state.editLoading = true
        })
        .addCase(handleUpdateInstallmentTransaction.fulfilled ,(state, action) => {
            state.editLoading = false
        })
        .addCase(handleUpdateInstallmentTransaction.rejected ,(state,action) => {
            state.installmentError = action.payload
        })
    }
})

export default transactionsSlice.reducer