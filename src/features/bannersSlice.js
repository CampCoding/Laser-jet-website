import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apiIntsance";
import { userApi } from "../api/userEndpoints";

export const fetchBanners = createAsyncThunk("bannerSlice/fetchBanners" ,async () => {
    const data = await fetchData({url : userApi.routes.getBanners})
    return data;
})

export const addBanners = createAsyncThunk("bannerSlice/addBanners" ,async (body) => {
    const data = await fetchData({url : userApi.routes.createBanners , body , method :"POST" ,isFile:true})
    return data;
})

export const deleteBanners = createAsyncThunk("bannerSlice/deleteBanners" ,async (body) => {
    const data = await fetchData({url : userApi.routes.deleteBanner , body , method :"DELETE"})
    return data;
})

export const editBanners = createAsyncThunk("bannerSlice/editBanners" ,async (body) => {
    const data = await fetchData({url : userApi.routes.editBanner , body , method :"PUT"})
    return data;
})

const initialState = {
    data:[],
    originalBanners:[],
    addLoading:false,
    editLoading:false,
    deleteLoading:false,
    error:null,
    loading:false
}

export const bannerSlice = createSlice({
    name:"bannerSlice",
    initialState,
    extraReducers :(builder) => {
        builder.addCase(fetchBanners.pending,(state,action) => {
            state.loading = true,
            state.error = null
        }),
        builder.addCase(fetchBanners.fulfilled ,(state,action) => {
            state.data = action.payload,
            state.originalBanners = action.payload,
            state.loading = false
        }),
        builder.addCase(fetchBanners.rejected,(state,action) => {
            state.loading = false,
            state.error = action.payload
        })
        builder.addCase(addBanners.pending,(state,action) => {
            state.addLoading = true,
            state.error = null
        }),
        builder.addCase(addBanners.fulfilled ,(state,action) => {
            state.data = action.payload,
            state.addLoading = false
        }),
        builder.addCase(addBanners.rejected,(state,action) => {
            state.addLoading = false,
            state.error = action.payload
        })
        builder.addCase(deleteBanners.pending,(state,action) => {
            state.deleteLoading = true,
            state.error = null
        }),
        builder.addCase(deleteBanners.fulfilled ,(state,action) => {
            state.data = action.payload,
            state.deleteLoading = false
        }),
        builder.addCase(deleteBanners.rejected,(state,action) => {
            state.deleteLoading = false,
            state.error = action.payload
        })
        builder.addCase(editBanners.pending,(state,action) => {
            state.editLoading = true,
            state.error = null
        }),
        builder.addCase(editBanners.fulfilled ,(state,action) => {
            state.data = action.payload,
            state.editLoading = false
        }),
        builder.addCase(editBanners.rejected,(state,action) => {
            state.editLoading = false,
            state.error = action.payload
        })
    }
})

export default bannerSlice.reducer;