import { configureStore } from '@reduxjs/toolkit';
import matchSliceReducer from './matchslice';

const store = configureStore({
    reducer: {
        matches: matchSliceReducer,
    },
});

export default store;