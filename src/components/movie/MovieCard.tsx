import { Link } from "react-router-dom";
import type { Movie } from "../../types/Movie";

interface Props {
  movie: Movie;
}

function MovieCard({ movie }: Props) {
  return (
    <div className="movie-card">
      <img src={movie.posterUrl} alt={movie.title} />

      <div className="movie-card-body">
        <h3>{movie.title}</h3>
        <p>{movie.releaseYear}</p>
        <p>{movie.language}</p>

        <Link to={`/movies/${movie.id}`} className="details-btn">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default MovieCard;