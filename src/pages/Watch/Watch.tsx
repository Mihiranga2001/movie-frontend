import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import VideoPlayer from "../../components/media/VideoPlayer";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../services/api";
import { getMovieById } from "../../services/movieService";
import { getEpisodeById } from "../../services/seriesService";
import { recordWatch } from "../../services/watchHistoryService";
import { episodeLabel } from "../../utils/format";

interface Playable {
  title: string;
  subtitle: string | null;
  videoUrl: string | null;
  downloadUrl: string | null;
  posterUrl: string | null;
  backLink: string;
}

/**
 * Handles both /watch/movie/:id and /watch/episode/:id.
 *
 * The original version always called getMovieById(), so the episode route
 * fetched the wrong entity and showed the wrong title.
 */
function Watch() {
  const { mediaType, id } = useParams<{ mediaType: string; id: string }>();
  const { isAuthenticated } = useAuth();

  const [item, setItem] = useState<Playable | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const numericId = Number(id);

    if (!Number.isFinite(numericId) || (mediaType !== "movie" && mediaType !== "episode")) {
      setError("That watch link is not valid.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const request =
      mediaType === "movie"
        ? getMovieById(numericId).then<Playable>((movie) => ({
            title: movie.title,
            subtitle: [movie.releaseYear, movie.language, movie.duration]
              .filter(Boolean)
              .join(" • ") || null,
            videoUrl: movie.videoUrl,
            downloadUrl: movie.downloadUrl,
            posterUrl: movie.posterUrl,
            backLink: `/movies/${movie.id}`,
          }))
        : getEpisodeById(numericId).then<Playable>((episode) => ({
            title: episode.title,
            subtitle: `${episode.seriesTitle ?? "Series"} • ${episodeLabel(
              episode.seasonNumber,
              episode.episodeNumber,
            )}`,
            videoUrl: episode.videoUrl,
            downloadUrl: episode.downloadUrl,
            posterUrl: episode.thumbnailUrl,
            backLink: episode.seriesId ? `/series/${episode.seriesId}` : "/series",
          }));

    request
      .then((playable) => {
        if (cancelled) {
          return;
        }
        setItem(playable);

        // Best-effort history entry; a failure must never block playback.
        if (isAuthenticated) {
          recordWatch(
            mediaType === "movie" ? { movieId: numericId } : { episodeId: numericId },
          ).catch(() => undefined);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(getErrorMessage(err, "Could not load this title."));
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
  }, [mediaType, id, isAuthenticated]);

  if (loading) {
    return <Loader label="Loading player..." />;
  }

  if (error || !item) {
    return <ErrorMessage message={error ?? "Title not found."} />;
  }

  return (
    <div className="watch-page">
      <Link to={item.backLink} className="back-link">
        ← Back to details
      </Link>

      <h1 className="watch-title">{item.title}</h1>
      {item.subtitle && <p className="muted">{item.subtitle}</p>}

      <VideoPlayer url={item.videoUrl} title={item.title} poster={item.posterUrl} />

      <div className="button-row">
        {item.videoUrl && (
          <a href={item.videoUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">
            Open source link
          </a>
        )}
        {item.downloadUrl && (
          <a href={item.downloadUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
            Download
          </a>
        )}
      </div>

      {!isAuthenticated && (
        <p className="muted watch-hint">
          <Link to="/login">Log in</Link> to keep track of what you have watched.
        </p>
      )}
    </div>
  );
}

export default Watch;
