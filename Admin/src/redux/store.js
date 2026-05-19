import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import pageReducer from './slices/pageSlice';
import sectionReducer from './slices/sectionSlice';
import blogReducer from './slices/blogSlice';
import serviceReducer from './slices/serviceSlice';
import mediaReducer from './slices/mediaSlice';
import workReducer from './slices/workSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pages: pageReducer,
    sections: sectionReducer,
    blogs: blogReducer,
    services: serviceReducer,
    media: mediaReducer,
    work: workReducer,
  },
});
