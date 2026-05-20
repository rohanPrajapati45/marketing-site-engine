import { configureStore } from "@reduxjs/toolkit";

import pageReducer from "./slices/pageSlice";
import blogReducer from "./slices/blogSlice";
import navigationReducer from "./slices/navigationSlice";

export const store = configureStore({
  reducer: {
    page: pageReducer,
    blog: blogReducer,
    navigation: navigationReducer,
  },
});