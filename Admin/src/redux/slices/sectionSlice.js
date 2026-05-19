import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const createSection = createAsyncThunk(
  'sections/create',
  async ({ pageId, sectionData }, thunkAPI) => {
    try {
      const res = await api.post(`/admin/pages/${pageId}/sections`, sectionData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to create section');
    }
  }
);

export const updateSection = createAsyncThunk(
  'sections/update',
  async ({ sectionId, data }, thunkAPI) => {
    try {
      const res = await api.put(`/admin/sections/${sectionId}`, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update section');
    }
  }
);

export const deleteSection = createAsyncThunk(
  'sections/delete',
  async (sectionId, thunkAPI) => {
    try {
      await api.delete(`/admin/sections/${sectionId}`);
      return sectionId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete section');
    }
  }
);

export const reorderSections = createAsyncThunk(
  'sections/reorder',
  async ({ pageId, sections }, thunkAPI) => {
    try {
      const res = await api.put(`/admin/pages/${pageId}/reorder-sections`, { sections });
      return { sections };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to reorder sections');
    }
  }
);

export const reorderCards = createAsyncThunk(
  'sections/reorderCards',
  async ({ sectionId, cards }, thunkAPI) => {
    try {
      const res = await api.put(`/admin/sections/${sectionId}/reorder-cards`, { cards });
      return { sectionId, cards };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to reorder cards');
    }
  }
);

const sectionSlice = createSlice({
  name: 'sections',
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createSection.pending, (state) => { state.loading = true; })
      .addCase(createSection.fulfilled, (state) => { state.loading = false; })
      .addCase(createSection.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateSection.pending, (state) => { state.loading = true; })
      .addCase(updateSection.fulfilled, (state) => { state.loading = false; })
      .addCase(updateSection.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(deleteSection.pending, (state) => { state.loading = true; })
      .addCase(deleteSection.fulfilled, (state) => { state.loading = false; })
      .addCase(deleteSection.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(reorderSections.pending, (state) => { state.loading = true; })
      .addCase(reorderSections.fulfilled, (state) => { state.loading = false; })
      .addCase(reorderSections.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default sectionSlice.reducer;
