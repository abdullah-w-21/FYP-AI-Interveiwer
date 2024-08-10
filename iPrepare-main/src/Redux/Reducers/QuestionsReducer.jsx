// authReducer.jsx
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    quiz: null,
    error: null,
};

const quizSlice = createSlice({
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
        updateGeneration(state, action) {
            state.quiz = state.quiz.map((question, index) => ({
                ...question,
                userResponse: action.payload[index],
            }));
        },
        toggleLock(state, action) {
            const { index } = action.payload;

            // Toggle the lock state of the selected question
            state.quiz = state.quiz.map((question, i) => ({
                ...question,
                locked: i === index ? !question.locked : question.locked,
            }));

            // Set the next question's locked state to false
            if (index + 1 < state.quiz.length) {
                state.quiz[index + 1].locked = false;
            }
        },
        setIsGenerated(state, action) {
            const { index } = action.payload;

            state.quiz = state.quiz.map((question, i) => ({
                ...question,
                isGenerated: i === index ? true : question.isGenerated,
            }));
        },
        setGrading(state, action) {
            const { index, score, feedback, explanation } = action.payload;

            state.quiz = state.quiz.map((question, i) => {
                if (i === index) {
                    return {
                        ...question,
                        score,
                        feedback,
                        explanation,
                    };
                }
                return question;
            });
        },
        
    },
});


export const {
    setGrading,
    resetGeneration,
    generateError,
    setIsGenerated,
    generateSuccess,
    updateGeneration,
    toggleLock
} = quizSlice.actions;

export default quizSlice.reducer;
