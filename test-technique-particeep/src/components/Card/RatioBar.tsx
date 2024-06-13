import { FC } from "react";
import "../../App.css";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

interface IProps {
  movieId: string;
  likes: number;
  dislikes: number;
  isLiked: boolean;
  isDisliked: boolean;
  onLike: (movieId: string) => void;
  onDislike: (movieId: string) => void;
}

const RatioBar: FC<IProps> = ({
  dislikes,
  likes,
  onDislike,
  onLike,
  movieId,
  isLiked,
  isDisliked,
}) => {
  const total = likes + dislikes;
  const likePercentage = (likes / total) * 100;
  const dislikePercentage = (dislikes / total) * 100;

  return (
    <div className="ratio-container">
      {likes}
      <div onClick={() => onLike(movieId)}>
        <ThumbUpIcon
          fontSize="small"
          style={{ cursor: "pointer" }}
          htmlColor={isLiked ? "#a3b18a" : "#000000"}
        />
      </div>
      <div className="ratio-bar">
        <div
          className="ratio-bar__likes"
          style={{ width: `${likePercentage}%` }}
        ></div>
        <div
          className="ratio-bar__dislikes"
          style={{ width: `${dislikePercentage}%` }}
        ></div>
      </div>
      <div onClick={() => onDislike(movieId)}>
        <ThumbDownIcon
          fontSize="small"
          style={{ cursor: "pointer" }}
          htmlColor={isDisliked ? "#ef6351" : "#000000"}
        />
      </div>
      {dislikes}
    </div>
  );
};

export default RatioBar;
