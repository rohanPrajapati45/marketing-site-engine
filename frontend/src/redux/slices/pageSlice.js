import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



export const getPageBySlug = createAsyncThunk(
  "page/getPageBySlug",

  async (slug, thunkAPI) => {
    try {

      const response = await axios.get(
        `http://localhost:3000/pages/${slug}`
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
      })

      .addCase(getPageBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.page = action.payload;
      })

      .addCase(getPageBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});



export default pageSlice.reducer;

