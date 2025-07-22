import { configureStore } from "@reduxjs/toolkit";
import scoreReducer from './scoreSlice';

const store = configureStore({
    reducer: {
        scores: scoreReducer,
    }
});

export default store;