import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apiIntsance";
import { userApi } from "../api/userEndpoints";

export const fetchCategories =  createAsyncThunk("categoriesSlice/fetchCategories",async({page = 1,per_page = 7,keywords=""}) => {
    const getUrl = userApi.routes.getCategories+`?page=${page}&per_page=${per_page}`
    const response = await fetchData({url:keywords ? getUrl+`&keywords=${keywords}` : getUrl})
    return response;
})

export const addCategories = createAsyncThunk("categoriesSlice/addCategories",async(body) => {
    const response = await fetchData({url:userApi.routes.createCategory , method:"POST",body , isFile:true});
    return response;
} )

export const editCategories = createAsyncThunk("categoriesSlice/editCategories",async(body) => {
    const response = await fetchData({url:userApi.routes.updateCategory , method:"PUT",body , isFile:true});
    return response;
} )

export const deleteCategories = createAsyncThunk("categoriesSlice/deleteCategories",async(body) => {
    const response = await fetchData({url:userApi.routes.deleteCategory , method:"DELETE",body});
    return response;
} )

export const handleDeleteInstallment= createAsyncThunk("categoriesSlice/handleDeleteInstallment",async(body) => {
    const response = await fetchData({url:userApi.routes.deleteInstallment , body , method:"DELETE"});
    return response;
})

export const handleEditInstallment= createAsyncThunk("categoriesSlice/handleEditInstallment",async(body) => {
    const response = await fetchData({url:userApi.routes.updateInstallment , body , method:"PUT"});
    return response;
})

export const handleCreateInstallmentCategory = createAsyncThunk("categoriesSlice/handleCreateInstallmentCategory",async(body) => {
    const response  = await fetchData({url: userApi.routes.createCategoryInstallment , method :"POST" , body});
    return  response;
})

export const handleDeleteInstallmentCategory =  createAsyncThunk("categoriesSlice/handleDeleteInstallmentCategory",async(body) => {
    const response = await fetchData({url:userApi.routes.deleteCategoryInstallment , body , method:"DELETE"});
    return response;
})

export const handleEditInstallmentCategory =  createAsyncThunk("categoriesSlice/handleEditInstallmentCategory",async(body) => {
    const response = await fetchData({url:userApi.routes.updateCategoryInstallment , body , method:"PUT"});
    return response;
})

export const handleResortCategory = createAsyncThunk("categoriesSlice/handleResortCategory", async({body}) =>{
    const response = await fetchData({url : userApi?.routes?.resort_category , body , method:"PUT"});
    return response;
})

const initialState = {
  data:[],
  categories:[],
  error:null,
  addLoading:false,
  editLoading:false,
  addInstallment:false,
  editInstallment:false,
  deleteLoading:false,
  deleteInstallmentLoading:false,
  deleteCategoryInstallmentLoading:false,
  updateCategoryInstallmentLoading:false,
  loading:false,
  resort_category_loading:false
}

export const categoriesSlice = createSlice({
    name:"categoriesSlice",
    initialState,
    extraReducers : (builder) => {
        builder.addCase(fetchCategories.pending ,(state , action) => {
            state.loading = true,
            state.error= null
        }),
        builder.addCase(fetchCategories.fulfilled ,(state , action) => {
            state.loading = false,
            state.data = action.payload
        }),
        builder.addCase(fetchCategories.rejected ,(state , action) => {
            state.loading = false,
            state.error= null
        })
        builder.addCase(addCategories.pending ,(state , action) => {
            state.addLoading = true,
            state.error= null
        }),
        builder.addCase(addCategories.fulfilled ,(state , action) => {
            state.addLoading = false,
            state.categories = action.payload
        }),
        builder.addCase(addCategories.rejected ,(state , action) => {
            state.addLoading = false,
            state.error= null
        })
        builder.addCase(editCategories.pending ,(state , action) => {
            state.editLoading = true,
            state.error= null
        }),
        builder.addCase(editCategories.fulfilled ,(state , action) => {
            state.editLoading = false,
            state.categories = action.payload
        }),
        builder.addCase(editCategories.rejected ,(state , action) => {
            state.deleteLoading = false,
            state.error= null
        })
        builder.addCase(deleteCategories.pending ,(state , action) => {
            state.deleteLoading = true,
            state.error= null
        }),
        builder.addCase(deleteCategories.fulfilled ,(state , action) => {
            state.deleteLoading = false,
            state.categories = action.payload
        }),
        builder.addCase(deleteCategories.rejected ,(state , action) => {
            state.editLoading = false,
            state.error= null
        })
        builder.addCase(handleCreateInstallmentCategory.pending ,(state , action) => {
            state.addInstallment = true
        }),
        builder.addCase(handleCreateInstallmentCategory.fulfilled ,(state , action) => {
            state.addInstallment = false
        }),
        builder.addCase(handleCreateInstallmentCategory.rejected ,(state , action) => {
            state.editLoading = false
        })
        builder.addCase(handleDeleteInstallmentCategory.pending ,(state , action) => {
            state.deleteCategoryInstallmentLoading = true
        }),
        builder.addCase(handleDeleteInstallmentCategory.fulfilled ,(state , action) => {
            state.deleteCategoryInstallmentLoading = false
        }),
        builder.addCase(handleDeleteInstallmentCategory.rejected ,(state , action) => {
            state.deleteCategoryInstallmentLoading = false
        })
        builder.addCase(handleEditInstallmentCategory.pending ,(state , action) => {
            state.updateCategoryInstallmentLoading = true
        }),
        builder.addCase(handleEditInstallmentCategory.fulfilled ,(state , action) => {
            state.updateCategoryInstallmentLoading = false
        }),
        builder.addCase(handleEditInstallmentCategory.rejected ,(state , action) => {
            state.updateCategoryInstallmentLoading = false
        })
        builder.addCase(handleDeleteInstallment.pending ,(state , action) => {
            state.deleteInstallmentLoading = true
        }),
        builder.addCase(handleDeleteInstallment.fulfilled ,(state , action) => {
            state.deleteInstallmentLoading = false
        }),
        builder.addCase(handleDeleteInstallment.rejected ,(state , action) => {
            state.deleteInstallmentLoading = false
        })
        builder.addCase(handleEditInstallment.pending ,(state , action) => {
            state.editInstallment = true
        }),
        builder.addCase(handleEditInstallment.fulfilled ,(state , action) => {
            state.editInstallment = false
        }),
        builder.addCase(handleEditInstallment.rejected ,(state , action) => {
            state.editInstallment = false
        })
        builder.addCase(handleResortCategory.pending ,(state , action) => {
            state.resort_category_loading = true
        }),
        builder.addCase(handleResortCategory.fulfilled ,(state , action) => {
            state.resort_category_loading = false
        })
    }
})

export default categoriesSlice.reducer;