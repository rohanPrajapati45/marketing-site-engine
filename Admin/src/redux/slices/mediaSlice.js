import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchMedia = createAsyncThunk(
  'media/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/admin/media');
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch media');
    }
  }
);

export const uploadMedia = createAsyncThunk(
  'media/upload',
  async (formData, thunkAPI) => {
    try {
      const res = await api.post('/admin/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to upload media');
    }
  }
);

export const deleteMedia = createAsyncThunk(
  'media/delete',
  async (id, thunkAPI) => {
    try {
      await api.delete(`/admin/media/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete media');
    }
  }
);

const mediaSlice = createSlice({
  name: 'media',
  initialState: {
    items: [],
    loading: false,
    uploading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
      })
      .addCase(fetchMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadMedia.pending, (state) => {
        state.uploading = true;
      })
      .addCase(uploadMedia.fulfilled, (state, action) => {
        state.uploading = false;
        if (Array.isArray(action.payload.data)) {
          state.items.unshift(...action.payload.data);
        } else {
          state.items.unshift(action.payload.data);
        }
      })
      .addCase(uploadMedia.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      })
      .addCase(deleteMedia.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i._id !== action.payload);
      });
  },
});

export default mediaSlice.reducer;
