import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apiIntsance";
import { userApi } from "../api/userEndpoints";

export const fetchEmployees = createAsyncThunk("employeeSlice/fetchEmployees",async(keywords ,{rejectWithValue}) => {
    const getUrl = userApi.routes.fetchEmployee
    const response = await fetchData({url: keywords ? getUrl+`?keywords=${keywords}` : getUrl})
    return response;
})

export const createEmployees = createAsyncThunk("employeeSlice/createEmployees",async (body , {rejectWithValue}) =>{
 try {
   const response = await fetchData({url:userApi.routes.createEmployee , method:"POST",body , isFile: true})
   console.log(response)
   return response
 }catch(error) {
   return rejectWithValue(error?.response?.message || "There's an error while creating employees")
 }
})

export const updateEmployees = createAsyncThunk("employeeSlice/updateEmployees",async (body , {rejectWithValue}) =>{
    try {
      const response = await fetchData({url:userApi.routes.updateEmployee , method:"PUT",body , isFile: true})
      console.log(response)
      return response
    }catch(error) {
      return rejectWithValue(error?.response?.message || "There's an error while creating employees")
    }
   })

export const deleteEmployees = createAsyncThunk("employeeSlice/deleteEmployees",async (body , {rejectWithValue}) =>{
    try {
      const response = await fetchData({url:userApi.routes.deleteEmployee , method:"DELETE",body})
      return response
    }catch(error) {
      return rejectWithValue(error?.response?.message || "There's an error while deleting employees")
    }
   })

const initialState = {
    loading:false,
    addLoading:false,
    editLoading:false,
    deleteLoading:false,
    addEmployeesData:[],
    error:null,
    employees:[],
}

export const employeesSlcie = createSlice({
    name:"employeeSlice",
    initialState,
    extraReducers:(builder)=> {
        builder
        .addCase(fetchEmployees.pending ,(state,action) =>{
            state.loading = true,
            state.error = null
        })
        .addCase(fetchEmployees.fulfilled,(state , action) => {
            state.loading= false,
            state.employees= action.payload
        }).addCase(fetchEmployees.rejected ,(state,action) => {
            state.loading = false,
            state.error=  action.payload
        })
        .addCase(createEmployees.pending ,(state,action) =>{
            state.addLoading = true,
            state.error = null
        })
        .addCase(createEmployees.fulfilled,(state , action) => {
            state.addLoading= false,
            state.addEmployeesData= action.payload
        }).addCase(createEmployees.rejected ,(state,action) => {
            state.addLoading = false,
            state.error=  action.payload
        })
        .addCase(deleteEmployees.pending ,(state,action) =>{
            state.deleteLoading = true,
            state.error = null
        })
        .addCase(deleteEmployees.fulfilled,(state , action) => {
            state.deleteLoading= false,
            state.addEmployeesData= action.payload
        }).addCase(deleteEmployees.rejected ,(state,action) => {
            state.deleteLoading = false,
            state.error=  action.payload
        })
        .addCase(updateEmployees.pending ,(state,action) =>{
            state.editLoading = true,
            state.error = null
        })
        .addCase(updateEmployees.fulfilled,(state , action) => {
            state.editLoading= false,
            state.addEmployeesData= action.payload
        }).addCase(updateEmployees.rejected ,(state,action) => {
            state.editLoading = false,
            state.error=  action.payload
        })
    } 
})

export default employeesSlcie.reducer