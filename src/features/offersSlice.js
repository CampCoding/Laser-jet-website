import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apiIntsance";
import { userApi } from "../api/userEndpoints";

export const fetchOffers = createAsyncThunk(
  "offersSlice/fetchOffers",
  async ({ page, per_page }) => {
    const getUrl =
      userApi.routes.getOffers + `?page=${page}&per_page=${per_page}`;
    let response = await fetchData({ url: getUrl });
    console.log(response);
    return response;
  }
);

export const fetchOfferProducts = createAsyncThunk(
  "productsSlice/fetchOfferProducts",
  async ({ offer_id }) => {
    const getUrl = userApi.routes.offerProduct + `?offer_id=${offer_id}`;
    let response = await fetchData({ url: getUrl });
    return response;
  }
);
export const deleteOfferProducts = createAsyncThunk(
  "productsSlice/deleteOfferProducts",
  async ({ offer_id, product_id }) => {
    const getUrl = userApi.routes.deleteOfferProduct;
    let response = await fetchData({
      url: getUrl,
      method: "DELETE",
      body: {
        offer_id,
        product_id,
      },
    });
    return response;
  }
);
export const addOfferProducts = createAsyncThunk(
  "productsSlice/addOfferProducts",
  async (data) => {
    const getUrl = userApi.routes.addOfferProducts;
    let response = await fetchData({
      url: getUrl,
      method: "POST",
      body: data,
    });
    return response;
  }
);
export const addOffer = createAsyncThunk(
  "offersSlice/offerAddition",
  async (body) => {
    const response = await fetchData({
      url: userApi.routes.createOffer,
      method: "POST",
      body,
    });
    return response;
  }
);

export const editOffer = createAsyncThunk(
  "offersSlice/offerEdition",
  async (body) => {
    const response = await fetchData({
      url: userApi.routes.editOffer,
      method: "PUT",
      body,
    });
    return response;
  }
);

export const deleteOffer = createAsyncThunk(
  "offersSlice/deleteOffer",
  async (body) => {
    const response = await fetchData({
      url: userApi.routes.deleteOffer,
      method: "DELETE",
      body,
    });
    return response;
  }
);

const initialState = {
  data: [],
  products: [],
  offerProducts: [],
  error: null,
  addLoading: false,
  editLoading: false,
  deleteLoading: false,
  loading: false,
};

export const offersSlice = createSlice({
  name: "offersSlice",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchOffers.pending, (state, action) => {
      (state.loading = true), (state.error = null);
    }),
      builder.addCase(fetchOffers.fulfilled, (state, action) => {
        (state.loading = false), (state.data = action.payload);
      }),
      builder.addCase(fetchOffers.rejected, (state, action) => {
        (state.loading = false), (state.error = null);
      });
    builder.addCase(addOffer.pending, (state, action) => {
      (state.addLoading = true), (state.error = null);
    }),
      builder.addCase(addOffer.fulfilled, (state, action) => {
        (state.addLoading = false), (state.products = action.payload);
      }),
      builder.addCase(addOffer.rejected, (state, action) => {
        (state.addLoading = false), (state.error = null);
      });
    builder.addCase(editOffer.pending, (state, action) => {
      (state.editLoading = true), (state.error = null);
    }),
      builder.addCase(editOffer.fulfilled, (state, action) => {
        (state.editLoading = false), (state.data = action.payload);
      }),
      builder.addCase(editOffer.rejected, (state, action) => {
        (state.deleteLoading = false), (state.error = null);
      });
    builder.addCase(fetchOfferProducts.pending, (state, action) => {
      (state.deleteLoading = true), (state.error = null);
    }),
      builder.addCase(fetchOfferProducts.fulfilled, (state, action) => {
        (state.deleteLoading = false), (state.offerProducts = action.payload);
      }),
      builder.addCase(fetchOfferProducts.rejected, (state, action) => {
        (state.editLoading = false), (state.error = null);
      });
    builder.addCase(deleteOfferProducts.pending, (state, action) => {
      (state.deleteLoading = true), (state.error = null);
    }),
      builder.addCase(deleteOfferProducts.fulfilled, (state, action) => {
        state.deleteLoading = false;
      }),
      builder.addCase(deleteOfferProducts.rejected, (state, action) => {
        (state.editLoading = false), (state.error = null);
      });
    builder.addCase(deleteOffer.pending, (state, action) => {
      (state.deleteLoading = true), (state.error = null);
    }),
      builder.addCase(deleteOffer.fulfilled, (state, action) => {
        (state.deleteLoading = false), (state.data = action.payload);
      }),
      builder.addCase(deleteOffer.rejected, (state, action) => {
        (state.editLoading = false), (state.error = null);
      });
  },
});

export default offersSlice.reducer;
