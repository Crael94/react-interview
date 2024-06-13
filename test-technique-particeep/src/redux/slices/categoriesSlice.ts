import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CategoriesState {
    categories: string[];
}

const initialState: CategoriesState = {
    categories: [],
};

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setCategories: (state, action: PayloadAction<string[]>) => {
            state.categories = action.payload;
        },
        addCategory: (state, action: PayloadAction<string>) => {
            if (!state.categories.includes(action.payload)) {
                state.categories.push(action.payload);
            }
        },
        removeCategory: (state, action: PayloadAction<string>) => {
            state.categories = state.categories.filter(category => category !== action.payload);
        },
    }
});

export const { setCategories, addCategory, removeCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
