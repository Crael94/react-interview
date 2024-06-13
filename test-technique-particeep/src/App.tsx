import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IMovie } from "./Types";
import "./App.css";
import { MovieCard } from "./components";
import { RootState, AppDispatch } from "./redux/store";
import {
  deleteMovieAndCheckCategory,
  fetchMovies,
  toggleDislikeMovie,
  toggleLikeMovie,
} from "./redux/slices/moviesSlice";
import CategorySelect from "./components/Categories/CategoriesSelect";
import CachedIcon from "@mui/icons-material/Cached";
import Pagination from "./components/Pagination/Pagination";

function App() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [displayedMovies, setDisplayedMovies] = useState<IMovie[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [moviesPerPage, setMoviesPerPage] = useState<number>(12);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = displayedMovies.slice(
    indexOfFirstMovie,
    indexOfLastMovie
  );

  const dispatch: AppDispatch = useDispatch();
  const { movies, loading, error } = useSelector(
    (state: RootState) => state.movies
  );
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setDisplayedMovies(movies);
    } else {
      const filteredMovies = movies.filter((movie) =>
        selectedCategories.includes(movie.category)
      );
      setDisplayedMovies(filteredMovies);
    }
  }, [movies, selectedCategories]);

  useEffect(() => {
    setDisplayedMovies(movies);
  }, [movies]);

  const handleGetMovies = useCallback(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  useEffect(() => {
    handleGetMovies();
  }, [handleGetMovies]);

  const handleDelete = (id: string) => {
    dispatch(deleteMovieAndCheckCategory(id));
  };

  const handleLike = (id: string) => {
    dispatch(toggleLikeMovie(id));
  };
  const handleDislike = (id: string) => {
    dispatch(toggleDislikeMovie(id));
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleRefresh = () => {
    setIsRotating(true);
    setTimeout(() => {
      handleGetMovies();
      setIsRotating(false);
    }, 700);
  };

  return (
    <div className="App">
      <div className="header">
        <div className="refresh-container">
          <h1>Liste de nos films</h1>
          <div onClick={handleRefresh}>
            <CachedIcon
              fontSize="large"
              color="disabled"
              className={isRotating ? "rotating" : ""}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
        <CategorySelect
          choices={categories}
          handleChange={(value) => setSelectedCategories(value)}
          inputLabel="Filtrer par catégories"
          selectedChoices={selectedCategories}
        />
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div className="card-container">
        {currentMovies.length > 0 ? (
          currentMovies.map((movie: IMovie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onDelete={handleDelete}
              onDislike={handleDislike}
              onLike={handleLike}
            />
          ))
        ) : (
          <p>Aucun film.</p>
        )}
      </div>
      <Pagination
        setMoviesPerPage={setMoviesPerPage}
        moviesPerPage={moviesPerPage}
        totalMovies={displayedMovies.length}
        paginate={paginate}
      />
    </div>
  );
}

export default App;
