import { useCallback, useEffect, useState } from "react";

import EpisodeManager from "../../components/admin/EpisodeManager";
import GenreManager from "../../components/admin/GenreManager";
import MovieForm from "../../components/admin/MovieForm";
import SeriesForm from "../../components/admin/SeriesForm";
import Banner from "../../components/common/Banner";
import Loader from "../../components/common/Loader";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../services/api";
import { getAllGenres } from "../../services/genreService";
import { createMovie, deleteMovie, getMovies, updateMovie } from "../../services/movieService";
import { createSeries, deleteSeries, getSeries, updateSeries } from "../../services/seriesService";
import type { Genre } from "../../types/Genre";
import type { Movie, MoviePayload } from "../../types/Movie";
import type { TvSeries, TvSeriesPayload } from "../../types/TvSeries";

type Tab = "movies" | "series" | "episodes" | "genres";

const TABS: { key: Tab; label: string }[] = [
  { key: "movies", label: "Movies" },
  { key: "series", label: "TV Series" },
  { key: "episodes", label: "Episodes" },
  { key: "genres", label: "Genres" },
];

function Admin() {
  const { user } = useAuth();

  const [tab, setTab] = useState<Tab>("movies");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<TvSeries[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);

  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [editingSeries, setEditingSeries] = useState<TvSeries | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadAll = useCallback(() => {
    setLoading(true);
    Promise.all([getMovies(), getSeries(), getAllGenres()])
      .then(([movieList, seriesList, genreList]) => {
        setMovies(movieList);
        setSeries(seriesList);
        setGenres(genreList);
      })
      .catch((err: unknown) => setError(getErrorMessage(err, "Could not load admin data.")))
      .finally(() => setLoading(false));
  }, []);

  useEffect(loadAll, [loadAll]);

  const reloadGenres = useCallback(() => {
    getAllGenres()
      .then(setGenres)
      .catch(() => undefined);
  }, []);

  // --- movies --------------------------------------------------------

  const handleMovieSubmit = async (payload: MoviePayload) => {
    setSubmitting(true);
    setError(null);
    try {
      if (editingMovie) {
        await updateMovie(editingMovie.id, payload);
        setNotice(`"${payload.title}" updated.`);
      } else {
        await createMovie(payload);
        setNotice(`"${payload.title}" added.`);
      }
      setEditingMovie(null);
      setMovies(await getMovies());
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Could not save the movie."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleMovieDelete = async (movie: Movie) => {
    if (!window.confirm(`Delete "${movie.title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteMovie(movie.id);
      setNotice(`"${movie.title}" deleted.`);
      if (editingMovie?.id === movie.id) {
        setEditingMovie(null);
      }
      setMovies(await getMovies());
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Could not delete the movie."));
    }
  };

  // --- series --------------------------------------------------------

  const handleSeriesSubmit = async (payload: TvSeriesPayload) => {
    setSubmitting(true);
    setError(null);
    try {
      if (editingSeries) {
        await updateSeries(editingSeries.id, payload);
        setNotice(`"${payload.title}" updated.`);
      } else {
        await createSeries(payload);
        setNotice(`"${payload.title}" added.`);
      }
      setEditingSeries(null);
      setSeries(await getSeries());
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Could not save the series."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSeriesDelete = async (item: TvSeries) => {
    if (!window.confirm(`Delete "${item.title}" and all of its episodes?`)) {
      return;
    }
    try {
      await deleteSeries(item.id);
      setNotice(`"${item.title}" deleted.`);
      if (editingSeries?.id === item.id) {
        setEditingSeries(null);
      }
      setSeries(await getSeries());
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Could not delete the series."));
    }
  };

  if (loading) {
    return <Loader label="Loading admin dashboard..." />;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Admin dashboard</h1>
          <p className="muted">Signed in as {user?.email}</p>
        </div>
      </div>

      {error && <Banner tone="error" message={error} onDismiss={() => setError(null)} />}
      {notice && <Banner tone="success" message={notice} onDismiss={() => setNotice(null)} />}

      <div className="tab-bar" role="tablist">
        {TABS.map((entry) => (
          <button
            key={entry.key}
            type="button"
            role="tab"
            aria-selected={tab === entry.key}
            className={tab === entry.key ? "tab active" : "tab"}
            onClick={() => setTab(entry.key)}
          >
            {entry.label}
          </button>
        ))}
      </div>

      {tab === "movies" && (
        <section>
          <MovieForm
            genres={genres}
            editing={editingMovie}
            submitting={submitting}
            onSubmit={handleMovieSubmit}
            onCancelEdit={() => setEditingMovie(null)}
          />

          <h3>All movies ({movies.length})</h3>
          <div className="admin-list">
            {movies.map((movie) => (
              <div className="admin-row" key={movie.id}>
                <div>
                  <strong>{movie.title}</strong>
                  <p className="muted">
                    {[movie.releaseYear, movie.language, movie.genre?.name]
                      .filter(Boolean)
                      .join(" • ") || "No details"}
                  </p>
                </div>
                <div className="button-row">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setEditingMovie(movie);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleMovieDelete(movie)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "series" && (
        <section>
          <SeriesForm
            genres={genres}
            editing={editingSeries}
            submitting={submitting}
            onSubmit={handleSeriesSubmit}
            onCancelEdit={() => setEditingSeries(null)}
          />

          <h3>All series ({series.length})</h3>
          <div className="admin-list">
            {series.map((item) => (
              <div className="admin-row" key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <p className="muted">
                    {[item.releaseYear, item.language, item.genre?.name]
                      .filter(Boolean)
                      .join(" • ") || "No details"}
                  </p>
                </div>
                <div className="button-row">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setEditingSeries(item);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleSeriesDelete(item)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "episodes" && (
        <section>
          <EpisodeManager seriesList={series} />
        </section>
      )}

      {tab === "genres" && (
        <section>
          <GenreManager genres={genres} onChanged={reloadGenres} />
        </section>
      )}
    </div>
  );
}

export default Admin;
