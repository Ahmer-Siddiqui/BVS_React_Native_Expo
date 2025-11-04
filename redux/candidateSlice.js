import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import candidateService from '../services/candidateService';

export const fetchCandidates = createAsyncThunk('candidate/fetch', async (cnic, thunkAPI) => {
  const res = await candidateService.getCandidates(cnic);
  return res.candidates || [];
});

const candidateSlice = createSlice({
  name: 'candidate',
  initialState: { list: [], isLoading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidates.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(fetchCandidates.fulfilled, (s, a) => { s.isLoading = false; s.list = a.payload; })
      .addCase(fetchCandidates.rejected, (s, a) => { s.isLoading = false; s.error = a.error.message; });
  }
});

export default candidateSlice.reducer;
