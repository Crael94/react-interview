import { FC } from "react";
import { IMovie } from "../../Types";
import "../../App.css";
import RatioBar from "./RatioBar";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface IProps {
  movie: IMovie;
  onDelete: (movieId: string) => void;
  onLike: (movieId: string) => void;
  onDislike: (movieId: string) => void;
}

const MovieCard: FC<IProps> = ({ movie, onDelete, onDislike, onLike }) => {
  const { likedMovies, dislikedMovies } = useSelector(
    (state: RootState) => state.movies
  );
  const isLiked = likedMovies.includes(movie.id);
  const isDisliked = dislikedMovies.includes(movie.id);

  return (
    <div className="movie-card">
      <div className="delete-button" onClick={() => onDelete(movie.id)}>
        <DeleteForeverIcon htmlColor="#ef6351" />
      </div>
      <div>
        <p className="title">{movie.title}</p>
        <p className="category">{movie.category}</p>
      </div>
      <RatioBar
        dislikes={movie.dislikes}
        likes={movie.likes}
        onLike={onLike}
        onDislike={onDislike}
        movieId={movie.id}
        isLiked={isLiked}
        isDisliked={isDisliked}
      />
    </div>
  );
};

export default MovieCard;
