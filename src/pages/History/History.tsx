import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Banner from "../../components/common/Banner";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import { getErrorMessage } from "../../services/api";
import { clearWatchHistory, getWatchHistory } from "../../services/watchHistoryService";
import type { WatchHistoryEntry } from "../../types/WatchHistory";
import { episodeLabel, formatDate, posterOrPlaceholder } from "../../utils/format";

/** New page backed by the WatchHistory entity, which had no endpoints before. */
function History() {
  const [entries, setEntries] = useState<WatchHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);

    getWatchHistory()
      .then(setEntries)
      .catch((err: unknown) => setError(getErrorMessage(err, "Could not load your list.")))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const handleClear = async () => {
    if (!window.confirm("Clear your entire watch history?")) {
      return;
    }
    try {
      await clearWatchHistory();
      setEntries([]);
      setNotice("Watch history cleared.");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Could not clear your history."));
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>My list</h1>
        {entries.length > 0 && (
          <button type="button" className="btn btn-secondary" onClick={handleClear}>
            Clear history
          </button>
        )}
      </div>

      {notice && <Banner tone="success" message={notice} onDismiss={() => setNotice(null)} />}

      {loading ? (
        <Loader label="Loading your list..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={load} />
      ) : entries.length === 0 ? (
        <EmptyState
          title="Nothing watched yet"
          hint="Titles you play will show up here."
          action={
            <Link to="/movies" className="btn btn-primary">
              Browse movies
            </Link>
          }
        />
      ) : (
        <ul className="episode-list">
          {entries.map((entry) => {
            const isMovie = entry.movie !== null;
            const title = isMovie ? entry.movie?.title : entry.episode?.title;
            const poster = isMovie ? entry.movie?.posterUrl : entry.episode?.thumbnailUrl;
            const watchLink = isMovie
              ? `/watch/movie/${entry.movie?.id}`
              : `/watch/episode/${entry.episode?.id}`;

            return (
              <li key={entry.id} className="episode-row">
                <img
                  className="episode-thumb"
                  src={posterOrPlaceholder(poster)}
                  alt={title ?? "Title"}
                  loading="lazy"
                />

                <div className="episode-body">
                  <h3>{title ?? "Removed title"}</h3>
                  <p className="muted">
                    {isMovie
                      ? "Movie"
                      : `${entry.episode?.seriesTitle ?? "Series"} • ${episodeLabel(
                          entry.episode?.seasonNumber ?? 1,
                          entry.episode?.episodeNumber ?? 1,
                        )}`}
                  </p>
                  <span className="muted">Watched {formatDate(entry.watchedAt)}</span>
                </div>

                <div className="episode-actions">
                  <Link to={watchLink} className="btn btn-primary btn-sm">
                    ▶ Resume
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default History;
