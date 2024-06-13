import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { IMovie } from '../../Types';
import { movies$ } from '../../movies';
import { AppDispatch } from '../store';
import { setCategories } from './categoriesSlice';

interface MoviesState {
    movies: IMovie[];
    likedMovies: string[];
    dislikedMovies: string[];
    loading: boolean;
    error: string | null;
}

const initialState: MoviesState = {
    movies: [],
    likedMovies: [],
    dislikedMovies: [],
    loading: false,
    error: null,
};

export const fetchMovies = createAsyncThunk<IMovie[], undefined, { dispatch: AppDispatch }>(
    'movies/fetchMovies',
    async (_, { dispatch }) => {
        const response: IMovie[] = await movies$;
        const categories = Array.from(new Set(response.flatMap(movie => movie.category)));
        dispatch(setCategories(categories)); // Utiliser l'action setCategories du categoriesSlice
        return response;
    }
);

const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        deleteMovie: (state, action: PayloadAction<string>) => {
            state.movies = state.movies.filter(movie => movie.id !== action.payload);
        },
        toggleLikeMovie: (state, action: PayloadAction<string>) => {
            const movieId = action.payload;
            const movieIndex = state.movies.findIndex(movie => movie.id === movieId);

            if (movieIndex !== -1) {
                const isLiked = state.likedMovies.includes(movieId);
                const isDisliked = state.dislikedMovies.includes(movieId);
                if (isLiked) {
                    state.likedMovies = state.likedMovies.filter(id => id !== movieId);
                    state.movies[movieIndex].likes -= 1;
                } else {
                    state.likedMovies.push(movieId);
                    state.movies[movieIndex].likes += 1;
                    if (isDisliked) {
                        state.dislikedMovies = state.dislikedMovies.filter(id => id !== movieId);
                        state.movies[movieIndex].dislikes -= 1;
                    }
                }
            }
        },
        toggleDislikeMovie: (state, action: PayloadAction<string>) => {
            const movieId = action.payload;
            const movieIndex = state.movies.findIndex(movie => movie.id === movieId);

            if (movieIndex !== -1) {
                const isAlreadyDisliked = state.dislikedMovies.includes(movieId);
                const isLiked = state.likedMovies.includes(movieId);
                if (isAlreadyDisliked) {
                    state.dislikedMovies = state.dislikedMovies.filter(id => id !== movieId);
                    state.movies[movieIndex].dislikes -= 1;
                } else {
                    state.dislikedMovies.push(movieId);
                    state.movies[movieIndex].dislikes += 1;
                    if (isLiked) {
                        state.likedMovies = state.likedMovies.filter(id => id !== movieId);
                        state.movies[movieIndex].likes -= 1;
                    }
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMovies.fulfilled, (state, action: PayloadAction<IMovie[]>) => {
                state.loading = false;
                state.movies = action.payload;
            })
            .addCase(fetchMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch movies';
            });
    },
});

export const { deleteMovie, toggleLikeMovie, toggleDislikeMovie } = moviesSlice.actions;
export default moviesSlice.reducer;
