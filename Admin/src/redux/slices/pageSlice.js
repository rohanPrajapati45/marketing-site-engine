import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { createSection, updateSection, deleteSection, reorderSections, reorderCards } from './sectionSlice';

export const fetchAllPages = createAsyncThunk(
  'pages/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/admin/pages');
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch pages');
    }
  }
);

export const fetchSinglePage = createAsyncThunk(
  'pages/fetchSingle',
  async (pageId, thunkAPI) => {
    try {
      const res = await api.get(`/admin/pages/${pageId}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch page');
    }
  }
);

export const createPage = createAsyncThunk(
  'pages/create',
  async (pageData, thunkAPI) => {
    try {
      const res = await api.post('/admin/pages', pageData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to create page');
    }
  }
);

export const updatePage = createAsyncThunk(
  'pages/update',
  async ({ pageId, data }, thunkAPI) => {
    try {
      const res = await api.put(`/admin/pages/${pageId}`, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update page');
    }
  }
);

export const deletePage = createAsyncThunk(
  'pages/delete',
  async (pageId, thunkAPI) => {
    try {
      await api.delete(`/admin/pages/${pageId}`);
      return pageId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete page');
    }
  }
);

const pageSlice = createSlice({
  name: 'pages',
  initialState: {
    pages: [],
    currentPage: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentPage: (state) => {
      state.currentPage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPages.fulfilled, (state, action) => {
        state.loading = false;
        state.pages = [...(action.payload.data || [])].sort((a, b) => (a.navOrder || 0) - (b.navOrder || 0));
      })
      .addCase(fetchAllPages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSinglePage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSinglePage.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPage = action.payload.data;
      })
      .addCase(fetchSinglePage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPage.fulfilled, (state, action) => {
        state.pages.unshift(action.payload.data);
      })
      .addCase(updatePage.fulfilled, (state, action) => {
        const idx = state.pages.findIndex(p => p._id === action.payload.data._id);
        if (idx !== -1) state.pages[idx] = action.payload.data;
        if (state.currentPage?._id === action.payload.data._id) {
          state.currentPage = { ...state.currentPage, ...action.payload.data };
        }
      })
      .addCase(deletePage.fulfilled, (state, action) => {
        state.pages = state.pages.filter(p => p._id !== action.payload);
        if (state.currentPage?._id === action.payload) {
          state.currentPage = null;
        }
      })
      .addCase(createSection.fulfilled, (state, action) => {
        const createdSection = action.payload?.data;
        const pageId = action.meta.arg.pageId;
        if (!state.currentPage || state.currentPage._id !== pageId || !createdSection) return;
        state.currentPage.sections = [...(state.currentPage.sections || []), createdSection].sort((a, b) => a.order - b.order);
      })
      .addCase(updateSection.fulfilled, (state, action) => {
        const updatedSection = action.payload?.data;
        if (!state.currentPage || !updatedSection) return;
        const sections = state.currentPage.sections || [];
        const index = sections.findIndex((section) => section._id === updatedSection._id);
        if (index !== -1) {
          sections[index] = { ...sections[index], ...updatedSection };
          state.currentPage.sections = [...sections].sort((a, b) => a.order - b.order);
        }
      })
      .addCase(deleteSection.fulfilled, (state, action) => {
        if (!state.currentPage) return;
        state.currentPage.sections = (state.currentPage.sections || []).filter((section) => section._id !== action.payload);
      })
      .addCase(reorderSections.fulfilled, (state, action) => {
        if (!state.currentPage) return;
        const orderMap = new Map((action.payload.sections || []).map((item) => [item.sectionId, item.order]));
        state.currentPage.sections = (state.currentPage.sections || [])
          .map((section) => ({ ...section, order: orderMap.get(section._id) ?? section.order }))
          .sort((a, b) => a.order - b.order);
      })
      .addCase(reorderCards.fulfilled, (state, action) => {
        if (!state.currentPage) return;
        const section = (state.currentPage.sections || []).find((item) => item._id === action.payload.sectionId);
        if (section) {
          section.data = {
            ...section.data,
            cards: action.payload.cards,
          };
        }
      });
  },
});

export const { clearCurrentPage } = pageSlice.actions;
export default pageSlice.reducer;
