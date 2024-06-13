// Importations nécessaires
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { IMovie } from '../../Types';
import { movies$ } from '../../movies';
import { AppDispatch, RootState } from '../store';
import { removeCategory, setCategories } from './categoriesSlice';

// Définition de l'état des films
interface MoviesState {
    movies: IMovie[];
    likedMovies: string[];
    dislikedMovies: string[];
    loading: boolean;
    error: string | null;
}

// État initial
const initialState: MoviesState = {
    movies: [],
    likedMovies: [],
    dislikedMovies: [],
    loading: false,
    error: null,
};

// Thunk pour récupérer les films et mettre à jour les catégories
export const fetchMovies = createAsyncThunk<IMovie[], undefined, { dispatch: AppDispatch }>(
    'movies/fetchMovies',
    async (_, { dispatch }) => {
        const response: IMovie[] = await movies$;
        const categories = Array.from(new Set(response.flatMap(movie => movie.category)));
        dispatch(setCategories(categories)); // Met à jour les catégories dans le store
        return response;
    }
);

// Thunk pour supprimer un film et vérifier si la catégorie doit également être supprimée
export const deleteMovieAndCheckCategory = createAsyncThunk(
    'movies/deleteMovieAndCheckCategory',
    async (movieId: string, { getState, dispatch }) => {
        const state: RootState = getState() as RootState;
        const movieIndex = state.movies.movies.findIndex(movie => movie.id === movieId);
        if (movieIndex === -1) return;  // Si le film n'est pas trouvé, arrêtez ici

        // Récupère la catégorie avant de supprimer le film
        const movieCategory = state.movies.movies[movieIndex].category;

        // Supprime le film
        dispatch(moviesSlice.actions.deleteMovie(movieId));

        // Attendez que le state soit mis à jour après la suppression du film
        await new Promise(resolve => setTimeout(resolve, 0));

        // Re-vérifie l'état après la suppression
        const updatedState: RootState = getState() as RootState;
        const categoryExists = updatedState.movies.movies.some(movie => movie.category === movieCategory);

        if (!categoryExists) {
            console.log('movieCategory === ', movieCategory)
            dispatch(removeCategory(movieCategory));  // Supprime la catégorie si plus aucun film n'y appartient
        }
    }
);

// Création du slice avec reducers et extraReducers
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
            const isLiked = state.likedMovies.includes(movieId);
            const isDisliked = state.dislikedMovies.includes(movieId);

            if (movieIndex !== -1) {
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
            const isDisliked = state.dislikedMovies.includes(movieId);
            const isLiked = state.likedMovies.includes(movieId);

            if (movieIndex !== -1) {
                if (isDisliked) {
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

// Exportation des actions et du reducer
export const { toggleLikeMovie, toggleDislikeMovie } = moviesSlice.actions;
export default moviesSlice.reducer;
