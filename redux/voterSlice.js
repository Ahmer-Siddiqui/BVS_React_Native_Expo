import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import voterService from "../services/voterService";
import uploadService from "../services/uploadService";

export const registerVoter = createAsyncThunk(
  "voter/registerVoter",
  async (payload, thunkAPI) => {
    try {
      const res = await voterService.registerVoter(payload);
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

export const voteCasting = createAsyncThunk(
  "voter/voteCasting",
  async (payload, thunkAPI) => {
    try {
      const res = await voterService.voteCasting(payload);
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
export const uploadPicture = createAsyncThunk(
  "voter/upload-picture",
  async (payload, thunkAPI) => {
    try {
      const res = await uploadService.uploadFile(payload);
      return thunkAPI.fulfillWithValue(res);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();

      // You can include metaData along with message in the reject value:
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const cnicVerification = createAsyncThunk(
  "voter/cnic-verification",
  async (payload, thunkAPI) => {
    try {
      const res = await voterService.cnicVerification(payload);
      return thunkAPI.fulfillWithValue(res?.data);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      const metaData = error.response?.data?.metaData || null;

      // You can include metaData along with message in the reject value:
      return thunkAPI.rejectWithValue({ message, metaData });
    }
  }
);

const initialState = {
  voter: {},
  isLoading: false,
  success: null,
  error: false,
  message: "",
  pictureUrl: "",
  metaData: ""
};

const voterSlice = createSlice({
  name: "voter",
  initialState,
  reducers: {
    setVoter(state, action) {
      state.current = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerVoter.pending, (s) => {
        s.isLoading = true;
        s.error = null;
      })
      .addCase(registerVoter.fulfilled, (s, a) => {
        s.isLoading = false;
        s.current = a.payload;
      })
      .addCase(registerVoter.rejected, (s, a) => {
        s.isLoading = false;
        s.error = a.error.message;
      })
      .addCase(voteCasting.pending, (s) => {
        s.isLoading = true;
        s.error = null;
      })
      .addCase(voteCasting.fulfilled, (s, a) => {
        s.isLoading = false;
      })
      .addCase(voteCasting.rejected, (s, a) => {
        s.isLoading = false;
        s.error = a.error.message;
      })
      .addCase(uploadPicture.pending, (s) => {
        s.isLoading = true;
        s.error = null;
      })
      .addCase(uploadPicture.fulfilled, (s, a) => {
        s.isLoading = false;
        s.pictureUrl = a.payload;
      })
      .addCase(uploadPicture.rejected, (s, a) => {
        s.isLoading = false;
        s.error = a.error.message;
      })
      .addCase(cnicVerification.pending, (s) => {
        s.isLoading = true;
        s.error = false;
        s.success = false;
      })
      .addCase(cnicVerification.fulfilled, (s, a) => {
        s.voter = a.payload?.data;
        s.success = true;
        s.error = false;
        s.isLoading = false;
      })
      .addCase(cnicVerification.rejected, (s, a) => {
        s.message = a.payload?.message;
        s.metaData = a.payload?.metaData;
        s.success = false;
        s.isLoading = false;
        s.error = true;
      });
  },
});

export const { setVoter } = voterSlice.actions;
export default voterSlice.reducer;
