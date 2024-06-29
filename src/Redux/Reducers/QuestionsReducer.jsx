// authReducer.jsx
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    quiz: null,
    error: null,
};

const authSlice = createSlice({
    name: "questions",
    initialState,
    reducers: {
        startLoading(state) {
            state.isLoading = true;
        },

        resetGeneration: () => initialState,
        generateSuccess(state, action) {
            state.isLoading = false;
            state.quiz = action.payload;
            state.error = null;
        },
        generateError(state, action) {
            state.isLoading = false;
            state.quiz = null;
            state.error = action.payload;
        },
    },
});


export const {
    resetGeneration,
    generateError,
    generateSuccess,
} = authSlice.actions;

export default authSlice.reducer;
