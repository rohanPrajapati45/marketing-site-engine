import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";

const initialState = {
  navItems: [],
  loading: false,
  error: null,
};

// FETCH NAVIGATION
export const getNavigation = createAsyncThunk(
  "navigation/getNavigation",

  async (_, thunkAPI) => {
    try {

      const response = await axios.get(
        "http://localhost:8080/navigation"
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

const navigationSlice = createSlice({
  name: "navigation",

  initialState,

  reducers: {},

  extraReducers: (builder) => {

    builder

      .addCase(getNavigation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getNavigation.fulfilled, (state, action) => {
        state.loading = false;
        state.navItems = action.payload;
      })

      .addCase(getNavigation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default navigationSlice.reducer;