import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import axios from "axios";

const API =
  "http://localhost:8080";

// GET BLOGS
export const getBlogs =
  createAsyncThunk(
    "blog/getBlogs",

    async (page = 1, thunkAPI) => {
      try {

        const response =
          await axios.get(
            `${API}/blogs?page=${page}`,
          );

        return response.data;

      } catch (error) {

        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            error.message,
        );
      }
    },
  );

// GET SINGLE BLOG
export const getSingleBlog =
  createAsyncThunk(
    "blog/getSingleBlog",

    async (slug, thunkAPI) => {
      try {

        const response =
          await axios.get(
            `${API}/blogs/${slug}`,
          );

        return response.data;

      } catch (error) {

        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            error.message,
        );
      }
    },
  );

const initialState = {

  blogs: [],

  blog: null,
  singleBlog: null,

  loading: false,

  error: null,

  currentPage: 1,

  totalPages: 1,
};

const blogSlice = createSlice({
  name: "blog",

  initialState,

  reducers: {

    setCurrentPage: (
      state,
      action,
    ) => {

      state.currentPage =
        action.payload;
    },

    clearSingleBlog: (
      state,
    ) => {

      state.blog = null;
    },
  },

  extraReducers: (builder) => {

    // GET BLOGS
    builder
      .addCase(
        getBlogs.pending,
        (state) => {

          state.loading = true;

          state.error = null;
        },
      )

      .addCase(
        getBlogs.fulfilled,
        (state, action) => {

          state.loading = false;

          state.blogs = Array.isArray(action.payload.data)
            ? action.payload.data
            : action.payload.data?.blogs ?? [];

          state.currentPage =
            action.payload.pagination?.currentPage ??
            action.payload.data?.currentPage ??
            1;

          state.totalPages =
            action.payload.pagination?.totalPages ??
            action.payload.data?.totalPages ??
            1;
        },
      )

      .addCase(
        getBlogs.rejected,
        (state, action) => {

          state.loading = false;

          state.error =
            action.payload;
        },
      );

    // GET SINGLE BLOG
    builder
      .addCase(
  getSingleBlog.pending,
  (state) => {
    state.loading = true;
  },
)

.addCase(
  getSingleBlog.fulfilled,
  (state, action) => {

    state.loading = false;

    state.singleBlog =
      action.payload.data;
  },
)

.addCase(
  getSingleBlog.rejected,
  (state, action) => {

    state.loading = false;

    state.error = action.payload;
  },
)
  },
});

export const {
  setCurrentPage,
  clearSingleBlog,
} = blogSlice.actions;

export default blogSlice.reducer;