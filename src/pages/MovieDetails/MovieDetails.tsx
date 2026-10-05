import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import { getErrorMessage } from "../../services/api";
import { getMovieById, getMovieLinks } from "../../services/movieService";
import type { Movie, MovieLink } from "../../types/Movie";
import { posterOrPlaceholder } from "../../utils/format";

function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [links, setLinks] = useState<MovieLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const movieId = Number(id);
    if (!Number.isFinite(movieId)) {
      setError("That movie id is not valid.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getMovieById(movieId)
      .then((data) => {
        if (!cancelled) {
          setMovie(data);
        }
        // Extra sources are optional — a failure here must not break the page.
        return getMovieLinks(movieId).catch(() => [] as MovieLink[]);
      })
      .then((linkList) => {
        if (!cancelled && linkList) {
          setLinks(linkList);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(getErrorMessage(err, "Could not load this movie."));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <Loader label="Loading movie details..." />;
  }

  if (error || !movie) {
    return <ErrorMessage message={error ?? "Movie not found."} />;
  }

  return (
    <div className="detail-page">
      <Link to="/movies" className="back-link">
        ← Back to movies
      </Link>

      <div
        className="detail-banner"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(10,10,10,0.96) 20%, rgba(10,10,10,0.4) 80%), " +
            `url(${posterOrPlaceholder(movie.bannerUrl ?? movie.posterUrl)})`,
        }}
      >
        <div className="detail-content">
          <img
            className="detail-poster"
            src={posterOrPlaceholder(movie.posterUrl)}
            alt={movie.title}
          />

          <div className="detail-info">
            <h1>{movie.title}</h1>

            <div className="chip-row">
              {movie.releaseYear && <span className="chip">{movie.releaseYear}</span>}
              {movie.language && <span className="chip">{movie.language}</span>}
              {movie.duration && <span className="chip">{movie.duration}</span>}
              {movie.genre && <span className="chip">{movie.genre.name}</span>}
              {movie.rating !== null && <span className="chip">★ {movie.rating.toFixed(1)}</span>}
            </div>

            {movie.description && <p className="detail-description">{movie.description}</p>}

            <div className="button-row">
              <Link to={`/watch/movie/${movie.id}`} className="btn btn-primary">
                ▶ Watch now
              </Link>

              {movie.trailerUrl && (
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                >
                  Trailer
                </a>
              )}

              {movie.downloadUrl && (
                <a
                  href={movie.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                >
                  Download
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {links.length > 0 && (
        <section className="home-section">
          <div className="section-title">
            <h2>Other sources</h2>
          </div>
          <ul className="link-list">
            {links.map((link) => (
              <li key={link.id}>
                <a href={link.url} target="_blank" rel="noreferrer">
                  {link.linkName}
                </a>
                <span className="muted">
                  {[link.linkType, link.quality].filter(Boolean).join(" • ")}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default MovieDetails;
