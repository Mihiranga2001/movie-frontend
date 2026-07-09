import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getMovieById } from "../../services/movieService";
import type { Movie } from "../../types/Movie";

function Watch() {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getMovieById(Number(id))
      .then((data) => {
        setMovie(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <h2>Loading video...</h2>;

  if (!movie) return <h2>Movie not found.</h2>;

  return (
    <div>
      <Link to={`/movies/${movie.id}`} className="back-link">
        ← Back to Details
      </Link>

      <h1 className="watch-title">{movie.title}</h1>

      <div className="video-wrapper">
        <video controls width="100%">
          <source src={movie.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="watch-actions">
        {movie.videoUrl && (
          <a href={movie.videoUrl} target="_blank" rel="noreferrer">
            Open Video Link
          </a>
        )}

        {movie.downloadUrl && (
          <a href={movie.downloadUrl} target="_blank" rel="noreferrer">
            Download Movie
          </a>
        )}
      </div>
    </div>
  );
}

export default Watch;