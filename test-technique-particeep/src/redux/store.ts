import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './slices/moviesSlice';
import categoriesReducer from './slices/categoriesSlice';

const store = configureStore({
    reducer: {
        movies: moviesReducer,
        categories: categoriesReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
