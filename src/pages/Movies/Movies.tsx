import { useEffect, useState } from "react";

import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import MediaGrid from "../../components/media/MediaGrid";
import SearchFilterBar from "../../components/media/SearchFilterBar";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { getErrorMessage } from "../../services/api";
import { getAllGenres } from "../../services/genreService";
import { getMovies } from "../../services/movieService";
import type { Genre } from "../../types/Genre";
import type { Movie } from "../../types/Movie";

function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [search, setSearch] = useState("");
  const [genreId, setGenreId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebouncedValue(search);

  useEffect(() => {
    getAllGenres()
      .then(setGenres)
      .catch(() => setGenres([]));
  }, []);

  // Filtering runs on the server, so it covers every row rather than only
  // the titles already downloaded.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getMovies({ search: debouncedSearch, genreId })
      .then((data) => {
        if (!cancelled) {
          setMovies(data);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(getErrorMessage(err, "Could not load movies."));
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
  }, [debouncedSearch, genreId]);

  return (
    <div>
      <div className="page-header">
        <h1>Movies</h1>
        <SearchFilterBar
          search={search}
          onSearchChange={setSearch}
          genres={genres}
          genreId={genreId}
          onGenreChange={setGenreId}
          placeholder="Search movies..."
        />
      </div>

      {loading ? (
        <Loader label="Loading movies..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : movies.length === 0 ? (
        <EmptyState
          title="No movies found"
          hint="Try a different search term or clear the genre filter."
        />
      ) : (
        <MediaGrid
          basePath="/movies"
          items={movies.map((movie) => ({
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
    </div>
  );
}

export default Movies;
