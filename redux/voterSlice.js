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
      return thunkAPI.fulfillWithValue(res.data);
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
  success: false,
  error: false,
  message: "",
  pictureUrl: "",
  metaData: "",
};

const voterSlice = createSlice({
  name: "voter",
  initialState,
  reducers: {
    setVoter(state, action) {
      state.current = action.payload;
    },
    resetVoter: () => initialState,
    resetValue: (state) => {
      state.error = false;
      state.success = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerVoter.pending, (s) => {
        s.isLoading = true;
        s.error = false;
        s.success = false;
        s.message = "";
      })
      .addCase(registerVoter.fulfilled, (s, a) => {
        s.isLoading = false;
        s.current = a.payload;
        s.success = true;
      })
      .addCase(registerVoter.rejected, (s, a) => {
        s.isLoading = false;
        s.success = false;
        s.error = false;
        s.message = a.payload;
      })
      .addCase(voteCasting.pending, (s) => {
        s.isLoading = true;
        s.success = false;
        s.error = false;
        s.message = "";
      })
      .addCase(voteCasting.fulfilled, (s, a) => {
        s.isLoading = false;
        s.success = true;
        s.message = a.payload?.message;
      })
      .addCase(voteCasting.rejected, (s, a) => {
        s.isLoading = false;
        s.success = false;
        s.message = a.payload;
        s.error = true;
      })
      .addCase(uploadPicture.pending, (s) => {
        s.isLoading = true;
        s.error = false;
        s.message = "";
      })
      .addCase(uploadPicture.fulfilled, (s, a) => {
        s.isLoading = false;
        s.pictureUrl = a.payload;
      })
      .addCase(uploadPicture.rejected, (s, a) => {
        s.isLoading = false;
        s.error = true;
        s.message = a.payload;
      })
      .addCase(cnicVerification.pending, (s) => {
        s.isLoading = true;
        s.error = false;
        s.success = false;
        s.message = "";
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

export const { setVoter, resetVoter, resetValue } = voterSlice.actions;
export default voterSlice.reducer;
