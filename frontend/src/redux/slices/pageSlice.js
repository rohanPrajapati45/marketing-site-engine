import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_BASE_URL;


export const getPageBySlug = createAsyncThunk(
  "page/getPageBySlug",

  async (slug, thunkAPI) => {
    try {

      const response = await axios.get(
        `${API}/pages/${slug}`
      );

      return response.data.data;

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        error.message
      );
    }
  }
);





const pageSlice = createSlice({
  name: "page",

  initialState: {
    page: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {

    builder

      .addCase(getPageBySlug.pending, (state) => {
        state.loading = true;
        state.page = null;
        state.error = null;
      })

      .addCase(getPageBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.page = action.payload;
        state.error = null;
      })

      .addCase(getPageBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});



export default pageSlice.reducer;

