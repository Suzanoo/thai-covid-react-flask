import { configureStore } from '@reduxjs/toolkit';
import queryDataReducer from '../features/dataService/dataSlice';

export const store = configureStore({
  reducer: {
    queryData: queryDataReducer,
  },
});
