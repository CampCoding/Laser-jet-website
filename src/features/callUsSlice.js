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

export const fetchContacts = createAsyncThunk("callUsSlice/fetchContacts",async () => {
    const response = await fetchData({url:userApi.routes.fetchContatc})
    return response;
})

export const addContact = createAsyncThunk("callUsSlice/addContact",async(body)=>{
    const response = await fetchData({url:userApi.routes.createContact, method:"POST",isFile:true, body});
    console.log(response)
    return response;
})

export const editContact = createAsyncThunk("callUsSlice/editContact",async(body)=>{
    const response = await fetchData({url:userApi.routes.updateContact, method:"PUT",isFile:true, body});
    return response;
})

export const deleteContact = createAsyncThunk("callUsSlice/deleteContact",async({id})=>{
    const response = await fetchData({url:userApi.routes.deleteContact+`/${id}`, method:"DELETE"});
    return response;
})


export const callUsSlice = createSlice({
    name:"callUsSlice",
    initialState,
    extraReducers:(builder) => {
        builder
        .addCase(fetchContacts.pending ,(state, action) => {
            state.loading = true,
            state.error = null
        })
        .addCase(fetchContacts.fulfilled,(state, action) => {
            state.loading = false,
            state.data = action.payload
        })
        .addCase(fetchContacts.rejected,(state, action) => {
            state.loading = false,
            state.error= action.payload
        })
        .addCase(addContact.pending ,(state, action) => {
            state.addLoading = true,
            state.addError = null
        })
        .addCase(addContact.fulfilled,(state, action) => {
            state.addLoading = false
        })
        .addCase(addContact.rejected,(state, action) => {
            state.addLoading = false,
            state.addError= action.payload
        })
        .addCase(editContact.pending ,(state, action) => {
            state.editLoading = true,
            state.editError = null
        })
        .addCase(editContact.fulfilled,(state, action) => {
            state.editLoading = false
        })
        .addCase(editContact.rejected,(state, action) => {
            state.editLoading = false,
            state.editError= action.payload
        })
        .addCase(deleteContact.pending ,(state, action) => {
            state.deleteLoading = true,
            state.deleteError = null
        })
        .addCase(deleteContact.fulfilled,(state, action) => {
            state.deleteLoading = false
        })
        .addCase(deleteContact.rejected,(state, action) => {
            state.deleteLoading = false,
            state.deleteError= action.payload
        })
    }
})

export default callUsSlice.reducer