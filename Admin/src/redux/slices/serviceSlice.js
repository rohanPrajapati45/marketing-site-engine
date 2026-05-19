import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchServices = createAsyncThunk(
  'services/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/api/services/all');
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch services');
    }
  }
);

export const createService = createAsyncThunk(
  'services/create',
  async (serviceData, thunkAPI) => {
    try {
      const res = await api.post('/api/services/create', serviceData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to create service');
    }
  }
);

export const updateService = createAsyncThunk(
  'services/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await api.put(`/api/services/update/${id}`, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update service');
    }
  }
);

export const deleteService = createAsyncThunk(
  'services/delete',
  async (id, thunkAPI) => {
    try {
      await api.delete(`/api/services/delete/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete service');
    }
  }
);

const serviceSlice = createSlice({
  name: 'services',
  initialState: {
    services: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload.services;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.services.push(action.payload.service);
      })
      .addCase(updateService.fulfilled, (state, action) => {
        const idx = state.services.findIndex(s => s._id === action.payload.service._id);
        if (idx !== -1) state.services[idx] = action.payload.service;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.services = state.services.filter(s => s._id !== action.payload);
      });
  },
});

export default serviceSlice.reducer;
