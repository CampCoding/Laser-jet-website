import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apiIntsance";
import { userApi } from "../api/userEndpoints";

const initialState = {
    loading : false,
    addLoading:false,
    editLoading:false,
    deleteLoading:false,
    error:null,
    addError:null,
    editError:null,
    deleteError:null,
    data:[]
}

export const fetchSocial = createAsyncThunk("socialLinksSlice/fetchSocial",async() => {
    const response = await fetchData({url:userApi.routes.fetchSocials});
    return response;
})


export const addSocial = createAsyncThunk("socialLinksSlice/addSocial",async(body) => {
    const response = await fetchData({url:userApi.routes.createSocial,method:"POST",body});
    return response
})

export const editSocial = createAsyncThunk("socialLinksSlice/editSocial",async(body) => {
    const response = await fetchData({url:userApi.routes.updateSocials,method:"PUT",body});
    return response
})

export const deleteSocial = createAsyncThunk("socialLinksSlice/deleteSocial",async(body) => {
    const response = await fetchData({url:userApi.routes.deleteSocials,method:"DELETE",body});
    return response
})


export const socialLinksSlice = createSlice({
    name:"socialLinksSlice",
    initialState,
    extraReducers:(builder) => {
        builder
        .addCase(fetchSocial.pending,(state, action) => {
            state.loading = true,
            state.error= null
        })
        .addCase(fetchSocial.fulfilled,(state,action) => {
            state.loading = false;
            state.data = action.payload
        })
        .addCase(fetchSocial.rejected,(state, action) => {
            state.loading = false;
            state.error= action.payload
        })
        .addCase(addSocial.pending,(state, action) => {
            state.addLoading = true,
            state.addError= null
        })
        .addCase(addSocial.fulfilled,(state,action) => {
            state.addLoading = false;
        })
        .addCase(addSocial.rejected,(state, action) => {
            state.addLoading = false;
            state.addError= action.payload
        })
        .addCase(editSocial.pending,(state, action) => {
            state.editLoading = true,
            state.editError= null
        })
        .addCase(editSocial.fulfilled,(state,action) => {
            state.editLoading = false;
        })
        .addCase(editSocial.rejected,(state, action) => {
            state.editLoading = false;
            state.editError= action.payload
        })
        .addCase(deleteSocial.pending,(state, action) => {
            state.deleteLoading = true,
            state.deleteError= null
        })
        .addCase(deleteSocial.fulfilled,(state,action) => {
            state.deleteLoading = false;
        })
        .addCase(deleteSocial.rejected,(state, action) => {
            state.deleteLoading = false;
            state.deleteError= action.payload
        })
    }
})

export default socialLinksSlice.reducer;