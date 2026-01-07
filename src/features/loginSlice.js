import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apiIntsance";
import { userApi } from "../api/userEndpoints";
import Cookies from 'js-cookie'
import { conifgs } from "../config";

export const fetchLogin = createAsyncThunk("loginSlice/fetchLogin", async (body) => {
    const response = await fetchData({ url: userApi.routes.login, method: "POST", body })
    return response
})

export const fetchUserProfile = createAsyncThunk("loginSlice/fetchUserProfile",async() => {
    const response = await  fetchData({url:userApi.routes.userProfile})
    if(response?.success) 
    return response.data;
})

export const refreshToken = createAsyncThunk("loginSlice/refreshToken", async () => {
    console.log(Cookies.get())
    const response = await fetchData({ url: userApi.routes.refreshToken, refreshToken: Cookies.get()?.laserget_refresh_token, refresh: true });
    console.log(response)
    return response
})

export const initialState = {
    data: [],
    userProfileData:[],
    loading: false,
    error: null,
    user_permissions :[],
}

export const loginSlice = createSlice({
    name: "loginSlice",
    initialState,
    extraReducers: (buildre) => {
        buildre.addCase(fetchLogin.pending, (state, action) => {
            state.loading = true,
                state.error = null
        }),
            buildre.addCase(fetchLogin.fulfilled, (state, action) => {
                state.loading = false,
                    state.data = action.payload
            }),
            buildre.addCase(fetchLogin.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload
            })
        buildre.addCase(refreshToken.pending, (state, action) => {
            state.loading = true,
                state.error = null
        }),
            buildre.addCase(refreshToken.fulfilled, (state, action) => {
                state.loading = false,
                    state.data = action.payload
            }),
            buildre.addCase(refreshToken.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload
            })

            buildre.addCase(fetchUserProfile.pending, (state, action) => {
                state.loading = true,
                    state.error = null
            }),
                buildre.addCase(fetchUserProfile.fulfilled, (state, action) => {
                    console.log(action)
                    state.user_permissions = action.payload?.permissions
                    localStorage.setItem(conifgs.localStorageUserPermissionsData , JSON.stringify(action.payload?.permissions))
                    state.loading = false,
                        state.userProfileData = action.payload
                }),
                buildre.addCase(fetchUserProfile.rejected, (state, action) => {
                    state.loading = false,
                        state.error = action.payload
                })

    }
})

export default loginSlice.reducer;