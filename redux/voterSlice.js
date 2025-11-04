import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import voterService from '../services/voterService';

export const registerVoter = createAsyncThunk('voter/registerVoter', async (payload, thunkAPI) => {
  const res = await voterService.registerVoter(payload);
  return res;
});

export const voteCasting = createAsyncThunk('voter/voteCasting', async (payload, thunkAPI) => {
  const res = await voterService.voteCasting(payload);
  return res;
});

const voterSlice = createSlice({
  name: 'voter',
  initialState: {
    current: null,
    isLoading: false,
    error: null
  },
  reducers: {
    setVoter(state, action) { state.current = action.payload; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerVoter.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(registerVoter.fulfilled, (s, a) => { s.isLoading = false; s.current = a.payload; })
      .addCase(registerVoter.rejected, (s, a) => { s.isLoading = false; s.error = a.error.message; })
      .addCase(voteCasting.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(voteCasting.fulfilled, (s, a) => { s.isLoading = false; })
      .addCase(voteCasting.rejected, (s, a) => { s.isLoading = false; s.error = a.error.message; });
  }
});

export const { setVoter } = voterSlice.actions;
export default voterSlice.reducer;
