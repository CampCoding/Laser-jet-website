// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { fetchData } from "../api/apiIntsance";
// import { userApi } from "../api/userEndpoints";

// const initialState = {
//     admins_transations_data : [],
//     admin_transactions:[],
//     get_admin_data:false,
//     get_admin_transaction_loading :false,
//     add_transfer_loading:false
// }

// export const handleFetchAdminsTransationsList = createAsyncThunk("adminTransactionsSlice/adminTransactionsSlice",async() => {
//     const response = await fetchData({url: userApi.routes.get_admins_transactions});
//     return response ;
// })

// export const handleFetchAdminTransations = createAsyncThunk("adminTransactionsSlice/adminTransactionsSlice",async({user_id}) => {
//     const response = await fetchData({url: `${userApi.routes.get_admins_transactions}?user_id=${user_id}`});
//     return response ;
// })

// export const handleAdminTransferMoney = createAsyncThunk("adminTransactionsSlice/handleAdminTransferMoney",async({user_id , price}) =>{
//     const response = await fetchData({url : `${userApi.routes.admin_transfer}?user_id=${user_id}&price=${price}`});
//     return response;
// })

// export const adminTransactionsSlice = createSlice({
//     name:"adminTransactionsSlice",
//     initialState,
//     extraReducers : (builder) => {
//         builder
//         .addCase(handleFetchAdminsTransationsList.pending , (state, action) =>{
//             state.get_admin_transaction_loading = true
//         })
//         .addCase(handleFetchAdminsTransationsList.fulfilled ,(state, action) => {
//             state.get_admin_transaction_loading = false,
//             state.admins_transations_data = action.payload
//         })
//         .addCase(handleFetchAdminTransations.pending , (state, action) =>{
//             state.get_admin_transaction_loading = true
//         })
//         .addCase(handleFetchAdminTransations.fulfilled ,(state, action) => {
//             state.get_admin_transaction_loading = false,
//             state.admin_transactions = action.payload
//         })
//         .addCase(handleAdminTransferMoney.pending , (state, action) =>{
//             state.add_transfer_loading = true
//         })
//         .addCase(handleAdminTransferMoney.fulfilled ,(state, action) => {
//             state.add_transfer_loading = false
//         })
//     }
// })

// export default adminTransactionsSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apiIntsance";
import { userApi } from "../api/userEndpoints";

const initialState = {
    admins_transations_data : [],
    admin_transactions:[],
    get_admin_data:false,
    get_admin_transaction_loading :false,
    add_transfer_loading:false
}

export const handleFetchAdminsTransationsList = createAsyncThunk("adminTransactionsSlice/adminTransactionsSlice",async() => {
    const response = await fetchData({url: userApi.routes.get_admins_transactions});
    return response ;
})

export const handleFetchAdminTransations = createAsyncThunk("adminTransactionsSlice/handleFetchAdminTransations",async({user_id}) => {
    const response = await fetchData({url: `${userApi.routes.get_admins_transactions}?user_id=${user_id}`});
    return response ;
})

export const handleAdminTransferMoney = createAsyncThunk("adminTransactionsSlice/handleAdminTransferMoney",async({user_id , price}) =>{
    const response = await fetchData({url : `${userApi.routes.admin_transfer}?user_id=${user_id}&price=${price}`});
    return response;
})

export const adminTransactionsSlice = createSlice({
    name:"adminTransactionsSlice",
    initialState,
    extraReducers : (builder) => {
        builder
        .addCase(handleFetchAdminsTransationsList.pending , (state, action) =>{
            state.get_admin_transaction_loading = true
        })
        .addCase(handleFetchAdminsTransationsList.fulfilled ,(state, action) => {
            state.get_admin_transaction_loading = false,
            state.admins_transations_data = action.payload
        })
        .addCase(handleFetchAdminTransations.pending , (state, action) =>{
            state.get_admin_transaction_loading = true
        })
        .addCase(handleFetchAdminTransations.fulfilled ,(state, action) => {
            state.get_admin_transaction_loading = false,
            state.admin_transactions = action.payload
        })
        .addCase(handleAdminTransferMoney.pending , (state, action) =>{
            state.add_transfer_loading = true
        })
        .addCase(handleAdminTransferMoney.fulfilled ,(state, action) => {
            state.add_transfer_loading = false
        })
    }
})

export default adminTransactionsSlice.reducer;