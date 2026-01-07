import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apiIntsance";
import { userApi } from "../api/userEndpoints";


const initialState = {
    loading:false,
    error:null,
    data:[]
}

export const handleFetchStatistics = createAsyncThunk("homeSlice/handleFetchStatistics",async() => {
    const res = await fetchData({url:userApi.routes.fetchStatistics})
    return res
})

export const homeSlice = createSlice({
    name:"homeSlice",
    initialState,
    extraReducers:(builder) => {
        builder
        .addCase(handleFetchStatistics.pending , (state, action) => {
            state.loading=true
        })
        .addCase(handleFetchStatistics.fulfilled , (state, action) =>{
            state.data = action.payload,
            state.loading = false
        })
        .addCase(handleFetchStatistics.rejected ,(state,action) => {
            state.loading = false
        })
    }
})

export default homeSlice.reducer