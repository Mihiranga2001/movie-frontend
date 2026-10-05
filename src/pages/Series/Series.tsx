import { useEffect, useState } from "react";

import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import MediaGrid from "../../components/media/MediaGrid";
import SearchFilterBar from "../../components/media/SearchFilterBar";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { getErrorMessage } from "../../services/api";
import { getAllGenres } from "../../services/genreService";
import { getSeries } from "../../services/seriesService";
import type { Genre } from "../../types/Genre";
import type { TvSeries } from "../../types/TvSeries";

/** This page was a one-line placeholder in the original project. */
function Series() {
  const [series, setSeries] = useState<TvSeries[]>([]);
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

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getSeries({ search: debouncedSearch, genreId })
      .then((data) => {
        if (!cancelled) {
          setSeries(data);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(getErrorMessage(err, "Could not load TV series."));
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
        <h1>TV Series</h1>
        <SearchFilterBar
          search={search}
          onSearchChange={setSearch}
          genres={genres}
          genreId={genreId}
          onGenreChange={setGenreId}
          placeholder="Search series..."
        />
      </div>

      {loading ? (
        <Loader label="Loading series..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : series.length === 0 ? (
        <EmptyState
          title="No series found"
          hint="Try a different search term or clear the genre filter."
        />
      ) : (
        <MediaGrid
          basePath="/series"
          items={series.map((item) => ({
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
    </div>
  );
}

export default Series;
