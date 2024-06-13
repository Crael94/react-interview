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
    }
});

export const { setCategories, addCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
