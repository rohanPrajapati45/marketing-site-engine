import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



export const getPageBySlug = createAsyncThunk(
  "page/getPageBySlug",

  async (slug, thunkAPI) => {
    try {

      const response = await axios.get(
<<<<<<< HEAD
        `http://localhost:8080/pages/${slug}`
=======
        `http://localhost:3000/pages/${slug}`
>>>>>>> e9f4b006f55e7ee1b7cef12b68cfe9dac2adf4e5
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

