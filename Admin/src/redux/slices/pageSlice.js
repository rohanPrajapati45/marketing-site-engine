import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export const fetchPages = createAsyncThunk(
  'pages/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      // The backend probably has GET /pages for public or admin
      const response = await axiosInstance.get('/admin/pages');
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pages');
    }
  }
);

export const createPage = createAsyncThunk(
  'pages/create',
  async (pageData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/admin/pages', pageData);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create page');
    }
  }
);

export const deletePage = createAsyncThunk(
  'pages/delete',
  async (pageId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/admin/pages/${pageId}`);
      return pageId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete page');
    }
  }
);

const initialState = {
  pages: [],
  loading: false,
  error: null,
};

const pageSlice = createSlice({
  name: 'pages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPages.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPages.fulfilled, (state, action) => { state.loading = false; state.pages = action.payload; })
      .addCase(fetchPages.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createPage.fulfilled, (state, action) => { state.pages.push(action.payload); })
      .addCase(deletePage.fulfilled, (state, action) => { 
        state.pages = state.pages.filter(p => p._id !== action.payload); 
      });
  },
});

export default pageSlice.reducer;
