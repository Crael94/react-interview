import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IMovie } from "./Types";
import "./App.css";
import { MovieCard } from "./components";
import { RootState, AppDispatch } from "./redux/store";
import {
  deleteMovie,
  fetchMovies,
  toggleDislikeMovie,
  toggleLikeMovie,
} from "./redux/slices/moviesSlice";

function App() {
  const dispatch: AppDispatch = useDispatch();
  const { movies, loading, error } = useSelector(
    (state: RootState) => state.movies
  );
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    dispatch(deleteMovie(id));
  };

  const handleLike = (id: string) => {
    dispatch(toggleLikeMovie(id));
  };
  const handleDislike = (id: string) => {
    dispatch(toggleDislikeMovie(id));
  };

  return (
    <div className="App">
      <h1>Liste de nos films</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div className="card-container">
        {movies.map((movie: IMovie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onDelete={handleDelete}
            onDislike={handleDislike}
            onLike={handleLike}
          />
        ))}
      </div>
      <div>
        <h2>Categories</h2>
        <ul>
          {categories.map((category) => (
            <li key={category}>{category}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
