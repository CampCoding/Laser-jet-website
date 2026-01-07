import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {fetchData} from '../api/apiIntsance';
import {userApi}  from  "../api/userEndpoints";

const initialState = {
    permission_loading :false,
    permission_data : [],
    create_role_loading : false,
    edit_role_loading:false,
    delete_role_loading:false,
    roles:[],
    get_role_loading:false,
    permissions:[],
    get_permissions:false,
    create_permission:false,
    delete_permission:false,
    edit_permission:false,
    create_user_permissions :false, 
    delete_user_permission:false,
    get_user_permission : false,
    user_permissions :[],
    assigning_permission : false,
}

export const handleFetchPermissions = createAsyncThunk("permissionsSlice/handleFetchPermissions",async() => {
    const response = await fetchData({url : userApi.routes.fetchPermission});
    return response;
})

export const handleCreatePermission = createAsyncThunk("permissionsSlice/handleCreatePermission",async({body}) => {
    const response = await fetchData({url : userApi.routes.createPermission , body , method :"POST"});
    return response;
})

export const handleDeletePermission = createAsyncThunk("permissionsSlice/handleDeletePermission",async({body}) => {
    const response = await fetchData({url : userApi.routes.deletePermission , body , method :"DELETE"});
    return response;
})

export const handleUpdatePermission = createAsyncThunk("permissionsSlice/handleUpdatePermission",async({body}) => {
    const response = await fetchData({url : userApi.routes.updatePermission , body , method :"PUT"});
    return response;
})

export const handleCreateUserPermission = createAsyncThunk("permissionsSlice/handleCreateUserPermission",async({body}) =>{
    const response = await fetchData({url:userApi.routes.createRole , method:"POST" , body});
    return response;
})

export const handleDeleteUserPermission = createAsyncThunk("permissionsSlice/handleDeleteUserPermission",async({body}) =>{
    const response = await fetchData({url:userApi.routes.delete_user_permission , method:"DELETE" , body});
    return response;
})




export const handleDeleteRole = createAsyncThunk("permissionsSlice/handleDeleteRole",async({body}) =>{
    const response = await fetchData({url:userApi.routes.deleteRole , method:"DELETE" , body});
    return response;
})

export const handleEditRole = createAsyncThunk("permissionsSlice/handleEditRole",async({body}) =>{
    const response = await fetchData({url:userApi.routes.editRole , method:"PUT" , body});
    return response;
})


export const handleFetchRoles = createAsyncThunk("permissionsSlice/handleFetchRoles",async() =>{
    const response = await fetchData({url : userApi.routes.fetchRole});
    return response;
})

export const handleFetchUserPermission = createAsyncThunk("permissionsSlice/handleFetchUserPermission",async({role_id}) =>{
    const response = await fetchData({url : `${userApi?.routes?.get_user_permission}?role_id=${role_id}`});
    return response;
})
// export const handleFetchPermissions = createAsyncThunk("permissionsSlice/handleFetchPermissions",async() => {
//     const response = await fetchData({url :  userApis});
//     return response;
// })

export const handleAssignPermission = createAsyncThunk("permissionsSlice/handleAssignPermission",async({body}) => {
  const res = await fetchData({url : userApi.routes?.create_user_permission , body , method: "POST" });
  return res;
})

export const permissionsSlice = createSlice({
    name:"permissionsSlice",
    initialState,
    extraReducers:(builder) => {
        builder
        .addCase(handleCreateUserPermission.pending , (state, action) => {
            state.create_role_loading = true
        })
        .addCase(handleCreateUserPermission.fulfilled ,(state,aciton) => {
            state.create_role_loading = false
        })
        .addCase(handleFetchRoles.pending , (state, action) => {
            state.get_role_loading = true
        })
        .addCase(handleFetchRoles.fulfilled ,(state,aciton) => {
            state.get_role_loading = false,
            state.roles = aciton.payload
        })
        .addCase(handleDeleteRole.pending , (state, action) => {
            state.delete_role_loading = true
        })
        .addCase(handleDeleteRole.fulfilled ,(state,aciton) => {
            state.delete_role_loading = false
        })
        .addCase(handleEditRole.pending , (state, action) => {
            state.edit_role_loading = true
        })
        .addCase(handleEditRole.fulfilled ,(state,aciton) => {
            state.edit_role_loading = false
        })
        .addCase(handleFetchPermissions.pending , (state, action) => {
            state.get_permissions = true
        })
        .addCase(handleFetchPermissions.fulfilled ,(state,aciton) => {
            state.get_permissions = false,
            state.permissions = aciton.payload
        })
        .addCase(handleCreatePermission.pending , (state, action) => {
            state.create_permission = true
        })
        .addCase(handleCreatePermission.fulfilled ,(state,aciton) => {
            state.create_permission = false
        })
        .addCase(handleDeletePermission.pending , (state, action) => {
            state.delete_permission = true
        })
        .addCase(handleDeletePermission.fulfilled ,(state,aciton) => {
            state.delete_permission = false
        })
        .addCase(handleUpdatePermission.pending , (state, action) => {
            state.edit_permission = true
        })
        .addCase(handleUpdatePermission.fulfilled ,(state,aciton) => {
            state.edit_permission = false
        })
        .addCase(handleFetchUserPermission.pending , (state, action) => {
            state.get_user_permission = true
        })
        .addCase(handleFetchUserPermission.fulfilled ,(state,aciton) => {
            state.get_user_permission = false,
            state.user_permissions = aciton.payload
        })
        .addCase(handleDeleteUserPermission.pending , (state, action) => {
            state.delete_user_permission = true
        })
        .addCase(handleDeleteUserPermission.fulfilled ,(state,aciton) => {
            state.delete_user_permission = false
        })
        .addCase(handleAssignPermission.pending , (state, action) => {
            state.assigning_permission = true
        })
        .addCase(handleAssignPermission.fulfilled ,(state,aciton) => {
            state.assigning_permission = false
        })
    }
})

export default permissionsSlice.reducer;