import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    matches: [],
};

const matchSlice = createSlice({
    name: 'matches',
    initialState,
    reducers: {
        addMatch: (state, action) => {
            state.matches.push(action.payload);
        },
        updateMatch: (state, action) => {
            const matchIndex = state.matches.findIndex((match) => match.id === action.payload.id);
            if (matchIndex !== -1) {
                state.matches[matchIndex] = action.payload;
            }
        },
        deleteMatch: (state, action) => {
            state.matches = state.matches.filter((match) => match.id !== action.payload.id);
        },
    },
});

export const { addMatch, updateMatch, deleteMatch } = matchSlice.actions;
export default matchSlice.reducer;