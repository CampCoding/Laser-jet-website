import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apiIntsance";
import { userApi } from "../api/userEndpoints";

export const fetchUsers = createAsyncThunk(
  "usersSlice/fetchUsers",
  async (keywords, { rejectWithValue }) => {
    const getUrl = userApi.routes.fetchUsers;
    const response = await fetchData({
      url: keywords ? getUrl + `?keywords=${keywords}` : getUrl
    });
    return response;
  }
);

export const fetchTransactionsData = createAsyncThunk(
  "usersSlice/transactions",
  async (userId, { rejectWithValue }) => {
    const getUrl = userApi.routes.transactions;
    const response = await fetchData({ url: `${getUrl}${userId ? "?user_id="+userId:""}` });
    return response;
  }
);

export const ChangeStatus = createAsyncThunk(
  "usersSlice/transactions",
  async (data, { rejectWithValue }) => {
    const getUrl = userApi.routes.installmentUpdateStatus;
    const response = await fetchData({
      url: getUrl,
      method: "PUT",
      body: data
    });
    return response;
  }
);
export const fetchUserData = createAsyncThunk(
  "usersSlice/profile",
  async (userId, { rejectWithValue }) => {
    const getUrl = userApi.routes.profile;
    const response = await fetchData({ url: getUrl + "?user_id=" + userId });
    return response;
  }
);

export const createUser = createAsyncThunk(
  "usersSlice/createUser",
  async (body, { rejectWithValue }) => {
    try {
      const response = await fetchData({
        url: userApi.routes.createUser,
        method: "POST",
        body
      });
      console.log(response);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.message || "There's an error while creating user"
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "usersSlice/updateUser",
  async (body, { rejectWithValue }) => {
    try {
      const response = await fetchData({
        url: userApi.routes.updateUser,
        method: "PUT",
        body
      });
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.message || "There's an error while updating user"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "usersSlice/deleteUser",
  async (body, { rejectWithValue }) => {
    try {
      const response = await fetchData({
        url: userApi.routes.deleteUsers,
        method: "DELETE",
        body
      });
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.message || "There's an error while deleting user"
      );
    }
  }
);

export const handleCreateDeposite = createAsyncThunk("usersSlice/handleCreateDeposite",async({body , user_id}) => {
  const response = await fetchData({url: userApi.routes.createDeposite +`?user_id=${user_id}` , method :"POST" , body});
  return response;
})

export const handleCreateDocs = createAsyncThunk("usersSlice/handleCreateDocs",async({body}) => {
  const response = await fetchData({url: userApi.routes.create_doc , body , isFile:true, method:"POST"});
  return response;
})


export const handleEditDocs = createAsyncThunk("usersSlice/handleEditDocs",async({body , user_id , doc_id }) => {
  const response = await fetchData({url: `${userApi.routes.update_doc}/${doc_id}/${user_id}`, body , method:"PUT", isFile : true });
  return response;
})


export const handleDeleteDocs = createAsyncThunk("usersSlice/handleDeleteDocs",async({doc_id , user_id}) => {
  const response = await fetchData({url: `${userApi.routes.delete_doc}/${doc_id}/${user_id}`, method:"DELETE" , isFile:true});
  return response;
})


export const handleGetDocs = createAsyncThunk("usersSlice/handleGetDocs",async({user_id}) => {
  const response = await fetchData({url: `${userApi.routes.fetch_doc}/${user_id}` , isFile : true});
  return response;
})



const initialState = {
  loading: false,
  addLoading: false,
  deleteLoading: false,
  editLoading: false,
  originalUsers:[],
  fetchUserDataLoading :false,
  userData:[],
  data: [],
  error: null,
  users: [],
  addDepositeLoading : false,
  user_docs : [],
  get_user_docs:false,
  delete_docs_loading : false,
  add_docs_loading:false,
  edit_docs_loading:false,
};

export const usersSlice = createSlice({
  name: "usersSlice",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        (state.loading = false), 
        (state.originalUsers = action.payload);
        (state.users = action.payload);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload);
      })
      .addCase(deleteUser.pending, (state, action) => {
        (state.deleteLoading = true), (state.error = null);
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        (state.deleteLoading = false), (state.users = action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        (state.deleteLoading = false), (state.error = action.payload);
      })
      .addCase(createUser.pending, (state, action) => {
        (state.addLoading = true), (state.error = null);
      })
      .addCase(createUser.fulfilled, (state, action) => {
        (state.addLoading = false), (state.users = action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        (state.addLoading = false), (state.error = action.payload);
      })
      .addCase(updateUser.pending, (state, action) => {
        (state.editLoading = true), (state.error = null);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        (state.editLoading = false), (state.users = action.payload);
      })
      .addCase(updateUser.rejected, (state, action) => {
        (state.editLoading = false), (state.error = action.payload);
      })
      .addCase(fetchUserData.pending , (state, action) => {
        state.fetchUserDataLoading = true
      })
      .addCase(fetchUserData.fulfilled , (state, action) => {
        state.fetchUserDataLoading = false,
        state.userData = action.payload
      })
      .addCase(fetchUserData.rejected ,(state,action) => {
        state.fetchUserDataLoading = false
      })
      .addCase(handleCreateDeposite.pending , (state, action) => {
        state.addDepositeLoading = true
      })
      .addCase(handleCreateDeposite.fulfilled , (state, action) => {
        state.addDepositeLoading = false
      })
      .addCase(handleCreateDeposite.rejected ,(state,action) => {
        state.addDepositeLoading = false
      })
      .addCase(handleGetDocs.fulfilled , (state, action) => {
        state.user_docs = action.payload,
        state.get_user_docs = false
      })
      .addCase(handleGetDocs.pending ,(state,action) => {
        state.get_user_docs = true
      })
      .addCase(handleDeleteDocs.fulfilled , (state, action) => {
        state.delete_docs_loading = false
      })
      .addCase(handleDeleteDocs.pending ,(state,action) => {
        state.delete_docs_loading = true
      })
      .addCase(handleCreateDocs.fulfilled , (state, action) => {
        state.add_docs_loading = false
      })
      .addCase(handleCreateDocs.pending ,(state,action) => {
        state.add_docs_loading = true
      })
      .addCase(handleEditDocs.fulfilled , (state, action) => {
        state.edit_docs_loading = false
      })
      .addCase(handleEditDocs.pending ,(state,action) => {
        state.edit_docs_loading = true
      })
  }
});

export default usersSlice.reducer;
