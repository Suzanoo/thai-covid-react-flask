import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dataService from './dataService';

// Fetch plan from localStorage & cast to JSON object
const queryData = JSON.parse(localStorage.getItem('queryData'));

// Initialize state
const initialState = {
  queryData: queryData ? queryData : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Create async action-reducer
export const setQueryData = createAsyncThunk(
  // Action type
  'covid/query',
  // Payload
  async (query, thunkAPI) => {
    try {
      return await dataService.setQueryData(query);
    } catch (err) {
      const message =
        err.message ||
        (err.response && err.response.data && err.response.data.message) ||
        err.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create async action-reducer
export const fetchCovidData = createAsyncThunk(
  // Action type
  'covid/fetch',
  // Payload
  async (date, thunkAPI) => {
    try {
      const response = await dataService.fetchCovidData(date);
      if (response.data) {
        console.log(response.data);
        return response.data;
      }
    } catch (err) {
      const message =
        err.message ||
        (err.response && err.response.data && err.response.data.message) ||
        err.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Slice
export const queryDataSlice = createSlice({
  name: 'queryData',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false; // ****
      state.isError = false;
      state.message = '';
    },
  },
  // Manage payload life cycle
  extraReducers: (builder) => {
    builder
      .addCase(setQueryData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(setQueryData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.queryData = action.payload;
      })
      .addCase(setQueryData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.queryData = null;
      })
      .addCase(fetchCovidData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCovidData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(fetchCovidData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

// Action
export const { reset } = queryDataSlice.actions;

// Reducer
export default queryDataSlice.reducer;
