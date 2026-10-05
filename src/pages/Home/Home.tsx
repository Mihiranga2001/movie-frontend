import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import MediaGrid from "../../components/media/MediaGrid";
import { getErrorMessage } from "../../services/api";
import { getMovies } from "../../services/movieService";
import { getSeries } from "../../services/seriesService";
import type { Movie } from "../../types/Movie";
import type { TvSeries } from "../../types/TvSeries";
import { posterOrPlaceholder } from "../../utils/format";

function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<TvSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([getMovies(), getSeries()])
      .then(([movieList, seriesList]) => {
        if (!cancelled) {
          setMovies(movieList);
          setSeries(seriesList);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(getErrorMessage(err, "Could not load the home page."));
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
  }, [reloadKey]);

  if (loading) {
    return <Loader label="Loading home page..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => setReloadKey((key) => key + 1)} />;
  }

  const hero = movies.find((movie) => movie.featured) ?? movies[0] ?? null;

  return (
    <div className="home-page">
      {hero ? (
        <section
          className="hero-section"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(10,10,10,0.96) 15%, rgba(10,10,10,0.35) 75%), " +
              `url(${posterOrPlaceholder(hero.bannerUrl ?? hero.posterUrl)})`,
          }}
        >
          <div className="hero-content">
            <span className="hero-tag">Featured</span>
            <h1>{hero.title}</h1>

            <div className="chip-row">
              {hero.releaseYear && <span className="chip">{hero.releaseYear}</span>}
              {hero.language && <span className="chip">{hero.language}</span>}
              {hero.duration && <span className="chip">{hero.duration}</span>}
              {hero.genre && <span className="chip">{hero.genre.name}</span>}
              {hero.rating !== null && <span className="chip">★ {hero.rating.toFixed(1)}</span>}
            </div>

            {hero.description && <p className="hero-description">{hero.description}</p>}

            <div className="button-row">
              <Link to={`/watch/movie/${hero.id}`} className="btn btn-primary">
                ▶ Watch now
              </Link>
              <Link to={`/movies/${hero.id}`} className="btn btn-secondary">
                More info
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="hero-section hero-empty">
          <div className="hero-content">
            <h1>Welcome to MovieWeb</h1>
            <p className="hero-description">
              There is nothing to show yet. Sign in as an administrator and add your first title
              from the admin dashboard.
            </p>
            <Link to="/admin" className="btn btn-primary">
              Go to admin
            </Link>
          </div>
        </section>
      )}

      <section className="home-section">
        <div className="section-title">
          <h2>Latest movies</h2>
          <Link to="/movies">View all</Link>
        </div>

        {movies.length === 0 ? (
          <p className="muted">No movies have been added yet.</p>
        ) : (
          <MediaGrid
            basePath="/movies"
            items={movies.slice(0, 10).map((movie) => ({
              id: movie.id,
              title: movie.title,
              posterUrl: movie.posterUrl,
              releaseYear: movie.releaseYear,
              language: movie.language,
              rating: movie.rating,
              genreName: movie.genre?.name ?? null,
            }))}
          />
        )}
      </section>

      <section className="home-section">
        <div className="section-title">
          <h2>Latest TV series</h2>
          <Link to="/series">View all</Link>
        </div>

        {series.length === 0 ? (
          <p className="muted">No series have been added yet.</p>
        ) : (
          <MediaGrid
            basePath="/series"
            items={series.slice(0, 10).map((item) => ({
              id: item.id,
              title: item.title,
              posterUrl: item.posterUrl,
              releaseYear: item.releaseYear,
              language: item.language,
              rating: item.rating,
              genreName: item.genre?.name ?? null,
            }))}
          />
        )}
      </section>
    </div>
  );
}

export default Home;
