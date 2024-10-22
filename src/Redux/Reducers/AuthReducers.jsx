// authReducer.jsx
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    resetAuth: () => initialState,
    signInSuccess(state, action) {
      state.isLoading = false;
      state.user = action.payload;
      state.error = null;
    },
    signInError(state, action) {
      state.isLoading = false;
      state.user = null;
      state.error = action.payload;
    },
    signUpSuccess(state, action) {
      state.isLoading = false;
      state.user = [];
      state.error = null;
    },
    signUpError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    resetSuccess(state) {
      state.isLoading = false;
      (state.user = null), (state.error = null);
    },
    resetError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});


export const {
  signInSuccess,
  resetAuth,
  signInError,
  signUpSuccess,
  signUpError,
  startLoading,
  resetError,
  resetSuccess,
} = authSlice.actions;

export default authSlice.reducer;
