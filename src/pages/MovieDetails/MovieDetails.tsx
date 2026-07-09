import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getMovieById } from "../../services/movieService";
import type { Movie } from "../../types/Movie";

function MovieDetails() {
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

  if (loading) {
    return <h2>Loading movie details...</h2>;
  }

  if (!movie) {
    return <h2>Movie not found.</h2>;
  }

  return (
    <div>
      <div
        className="movie-detail-banner"
        style={{
          backgroundImage: `linear-gradient(to right, #111 30%, rgba(0,0,0,0.4)), url(${movie.bannerUrl})`,
        }}
      >
        <div className="movie-detail-content">
          <img src={movie.posterUrl} alt={movie.title} />

          <div>
            <h1>{movie.title}</h1>
            <p>{movie.description}</p>

            <div className="movie-info">
              <span>{movie.releaseYear}</span>
              <span>{movie.language}</span>
              <span>{movie.duration}</span>
              <span>{movie.genre?.name}</span>
            </div>

            <div className="movie-actions">
              <Link to={`/watch/movie/${movie.id}`} className="watch-btn">
                Watch Now
              </Link>

              {movie.downloadUrl && (
                <a
                  href={movie.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="download-btn"
                >
                  Download
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;