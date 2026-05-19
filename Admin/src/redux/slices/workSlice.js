import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// ── CATEGORIES ──
export const fetchCategories = createAsyncThunk('work/fetchCategories', async (_, thunkAPI) => {
  try { const res = await api.get('/api/categories/all'); return res.data; }
  catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed'); }
});
export const createCategory = createAsyncThunk('work/createCategory', async (data, thunkAPI) => {
  try { const res = await api.post('/api/categories/create', data); return res.data; }
  catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed'); }
});
export const updateCategory = createAsyncThunk('work/updateCategory', async ({ id, data }, thunkAPI) => {
  try { const res = await api.put(`/api/categories/update/${id}`, data); return res.data; }
  catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed'); }
});
export const deleteCategory = createAsyncThunk('work/deleteCategory', async (id, thunkAPI) => {
  try { await api.delete(`/api/categories/delete/${id}`); return id; }
  catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed'); }
});

// ── SUBCATEGORIES ──
export const fetchSubcategories = createAsyncThunk('work/fetchSubcategories', async (_, thunkAPI) => {
  try { const res = await api.get('/api/subcategories/all'); return res.data; }
  catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed'); }
});
export const createSubcategory = createAsyncThunk('work/createSubcategory', async (data, thunkAPI) => {
  try { const res = await api.post('/api/subcategories/create', data); return res.data; }
  catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed'); }
});
export const updateSubcategory = createAsyncThunk('work/updateSubcategory', async ({ id, data }, thunkAPI) => {
  try { const res = await api.put(`/api/subcategories/update/${id}`, data); return res.data; }
  catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed'); }
});
export const deleteSubcategory = createAsyncThunk('work/deleteSubcategory', async (id, thunkAPI) => {
  try { await api.delete(`/api/subcategories/delete/${id}`); return id; }
  catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed'); }
});

// ── PROJECTS ──
export const fetchProjects = createAsyncThunk('work/fetchProjects', async (_, thunkAPI) => {
  try { const res = await api.get('/api/projects/all'); return res.data; }
  catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed'); }
});
export const createProject = createAsyncThunk('work/createProject', async (data, thunkAPI) => {
  try { const res = await api.post('/api/projects/create', data); return res.data; }
  catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed'); }
});
export const updateProject = createAsyncThunk('work/updateProject', async ({ id, data }, thunkAPI) => {
  try { const res = await api.put(`/api/projects/update/${id}`, data); return res.data; }
  catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed'); }
});
export const deleteProject = createAsyncThunk('work/deleteProject', async (id, thunkAPI) => {
  try { await api.delete(`/api/projects/delete/${id}`); return id; }
  catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed'); }
});

const workSlice = createSlice({
  name: 'work',
  initialState: {
    categories: [],
    subcategories: [],
    projects: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Categories
      .addCase(fetchCategories.pending, (s) => { s.loading = true; })
      .addCase(fetchCategories.fulfilled, (s, a) => { s.loading = false; s.categories = a.payload.categories; })
      .addCase(fetchCategories.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(createCategory.fulfilled, (s, a) => { s.categories.push(a.payload.category); })
      .addCase(updateCategory.fulfilled, (s, a) => { const i = s.categories.findIndex(c => c._id === a.payload.category._id); if (i !== -1) s.categories[i] = a.payload.category; })
      .addCase(deleteCategory.fulfilled, (s, a) => { s.categories = s.categories.filter(c => c._id !== a.payload); })
      // Subcategories
      .addCase(fetchSubcategories.pending, (s) => { s.loading = true; })
      .addCase(fetchSubcategories.fulfilled, (s, a) => { s.loading = false; s.subcategories = a.payload.subCategories || a.payload.subcategories || []; })
      .addCase(fetchSubcategories.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(createSubcategory.fulfilled, (s, a) => { s.subcategories.push(a.payload.subCategory || a.payload.subcategory); })
      .addCase(updateSubcategory.fulfilled, (s, a) => { const sc = a.payload.subCategory || a.payload.subcategory; const i = s.subcategories.findIndex(c => c._id === sc._id); if (i !== -1) s.subcategories[i] = sc; })
      .addCase(deleteSubcategory.fulfilled, (s, a) => { s.subcategories = s.subcategories.filter(c => c._id !== a.payload); })
      // Projects
      .addCase(fetchProjects.pending, (s) => { s.loading = true; })
      .addCase(fetchProjects.fulfilled, (s, a) => { s.loading = false; s.projects = a.payload.projects; })
      .addCase(fetchProjects.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(createProject.fulfilled, (s, a) => { s.projects.push(a.payload.project); })
      .addCase(updateProject.fulfilled, (s, a) => { const i = s.projects.findIndex(p => p._id === a.payload.project._id); if (i !== -1) s.projects[i] = a.payload.project; })
      .addCase(deleteProject.fulfilled, (s, a) => { s.projects = s.projects.filter(p => p._id !== a.payload); });
  },
});

export default workSlice.reducer;
