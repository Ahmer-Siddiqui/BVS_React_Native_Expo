import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import candidateService from "../services/candidateService";

export const fetchCandidates = createAsyncThunk(
  "candidate/fetch",
  async (cnic, thunkAPI) => {
    try {
      const res = await candidateService.getCandidates(cnic);
      return thunkAPI.fulfillWithValue(res);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  candidates: [],
  isLoading: false,
  success: null,
  error: null,
  message: "",
};

const candidateSlice = createSlice({
  name: "candidate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidates.pending, (s) => {
        s.isLoading = true;
        s.error = null;
      })
      .addCase(fetchCandidates.fulfilled, (s, a) => {
        s.candidates = a.payload?.data?.candidates
        s.isLoading = false;
        s.list = a.payload;
      })
      .addCase(fetchCandidates.rejected, (s, a) => {
        s.isLoading = false;
        s.error = a.error.message;
      });
  },
});

export default candidateSlice.reducer;
