import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apiIntsance";
import { userApi } from "../api/userEndpoints";


export const fetchProducts = createAsyncThunk("productsSlice/fetchProducts", async ({ page, per_page, keywords, category_id = "" }) => {
    const getUrl = userApi.routes.getProducts + `?page=${page}&per_page=${per_page}`
    let response = await fetchData({ url: keywords ? getUrl + `&keywords=${keywords}` : category_id ? getUrl + `&category_id=${category_id}` : getUrl });
    return response;
})

export const addProduct = createAsyncThunk("productsSlice/addProduct", async (body) => {
    const response = await fetchData({ url: userApi.routes.createproduct, method: "POST", body, isFile: true });
    return response;
})

export const editProduct = createAsyncThunk("productsSlice/editProduct", async (body) => {
    const response = await fetchData({ url: userApi.routes.updateproduct, method: "PUT", body, isFile: true });
    return response;
})

export const deleteProduct = createAsyncThunk("productsSlice/deleteProduct", async (body) => {
    const response = await fetchData({ url: userApi.routes.deleteproduct, method: "DELETE", body });
    return response;
})

const initialState = {
    data: [],
    products: [],
    error: null,
    addLoading: false,
    editLoading: false,
    deleteLoading: false,
    loading: false,
}

export const productsSlice = createSlice({
    name: "productsSlice",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchProducts.pending, (state, action) => {
            state.loading = true,
                state.error = null
        }),
            builder.addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false,
                    state.data = action.payload
            }),
            builder.addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false,
                    state.error = null
            })
        builder.addCase(addProduct.pending, (state, action) => {
            state.addLoading = true,
                state.error = null
        }),
            builder.addCase(addProduct.fulfilled, (state, action) => {
                state.addLoading = false,
                    state.products = action.payload
            }),
            builder.addCase(addProduct.rejected, (state, action) => {
                state.addLoading = false,
                    state.error = null
            })
        builder.addCase(editProduct.pending, (state, action) => {
            state.editLoading = true,
                state.error = null
        }),
            builder.addCase(editProduct.fulfilled, (state, action) => {
                state.editLoading = false,
                    state.data = action.payload
            }),
            builder.addCase(editProduct.rejected, (state, action) => {
                state.deleteLoading = false,
                    state.error = null
            })
        builder.addCase(deleteProduct.pending, (state, action) => {
            state.deleteLoading = true,
                state.error = null
        }),
            builder.addCase(deleteProduct.fulfilled, (state, action) => {
                state.deleteLoading = false,
                    state.data = action.payload
            }),
            builder.addCase(deleteProduct.rejected, (state, action) => {
                state.editLoading = false,
                    state.error = null
            })
    }
})

export default productsSlice.reducer;