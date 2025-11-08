import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import candidateService from "../services/candidateService";

export const fetchCandidates = createAsyncThunk(
  "candidate/fetch",
  async (cnic, thunkAPI) => {
    try {
      const res = await candidateService.getCandidates(cnic);
      return thunkAPI.fulfillWithValue(res?.data);
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
        s.error = false;
        s.success = false;
      })
      .addCase(fetchCandidates.fulfilled, (s, a) => {
        s.candidates = a.payload?.data?.candidates;
        s.success = true;
        s.error = false;
        s.isLoading = false;
      })
      .addCase(fetchCandidates.rejected, (s, a) => {
        s.message = a.payload;
        s.success = false;
        s.isLoading = false;
        s.error = true;
      });
  },
});

export default candidateSlice.reducer;
