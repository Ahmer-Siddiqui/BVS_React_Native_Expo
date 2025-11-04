import { configureStore } from '@reduxjs/toolkit';
import voterReducer from './voterSlice';
import candidateReducer from './candidateSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    voter: voterReducer,
    candidate: candidateReducer,
    ui: uiReducer
  }
});
