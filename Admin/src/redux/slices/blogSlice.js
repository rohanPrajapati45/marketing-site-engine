import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchAllBlogs = createAsyncThunk(
  'blogs/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/admin/blogs');
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch blogs');
    }
  }
);

export const fetchSingleBlog = createAsyncThunk(
  'blogs/fetchSingle',
  async (blogId, thunkAPI) => {
    try {
      const res = await api.get(`/admin/blogs/${blogId}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch blog');
    }
  }
);

export const createBlog = createAsyncThunk(
  'blogs/create',
  async (blogData, thunkAPI) => {
    try {
      const res = await api.post('/admin/blogs', blogData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to create blog');
    }
  }
);

export const updateBlog = createAsyncThunk(
  'blogs/update',
  async ({ blogId, data }, thunkAPI) => {
    try {
      const res = await api.put(`/admin/blogs/${blogId}`, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update blog');
    }
  }
);

export const deleteBlog = createAsyncThunk(
  'blogs/delete',
  async (blogId, thunkAPI) => {
    try {
      await api.delete(`/admin/blogs/${blogId}`);
      return blogId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete blog');
    }
  }
);

const blogSlice = createSlice({
  name: 'blogs',
  initialState: {
    blogs: [],
    currentBlog: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.data;
      })
      .addCase(fetchAllBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSingleBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBlog = action.payload.data;
      })
      .addCase(fetchSingleBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.blogs.unshift(action.payload.data);
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        const idx = state.blogs.findIndex(b => b._id === action.payload.data._id);
        if (idx !== -1) state.blogs[idx] = action.payload.data;
        if (state.currentBlog?._id === action.payload.data._id) {
          state.currentBlog = action.payload.data;
        }
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter(b => b._id !== action.payload);
        if (state.currentBlog?._id === action.payload) {
          state.currentBlog = null;
        }
      });
  },
});

export const { clearCurrentBlog } = blogSlice.actions;
export default blogSlice.reducer;
