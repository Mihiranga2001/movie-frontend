import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import { getErrorMessage } from "../../services/api";
import { getSeriesById } from "../../services/seriesService";
import type { TvSeries } from "../../types/TvSeries";
import { episodeLabel, posterOrPlaceholder } from "../../utils/format";

/** New page: the original project had no way to browse a series. */
function SeriesDetails() {
  const { id } = useParams<{ id: string }>();
  const [series, setSeries] = useState<TvSeries | null>(null);
  const [season, setSeason] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const seriesId = Number(id);
    if (!Number.isFinite(seriesId)) {
      setError("That series id is not valid.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getSeriesById(seriesId)
      .then((data) => {
        if (!cancelled) {
          setSeries(data);
          setSeason(data.episodes[0]?.seasonNumber ?? null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(getErrorMessage(err, "Could not load this series."));
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

  const seasons = useMemo(() => {
    if (!series) {
      return [];
    }
    const unique = new Set(series.episodes.map((episode) => episode.seasonNumber));
    return Array.from(unique).sort((a, b) => a - b);
  }, [series]);

  const visibleEpisodes = useMemo(() => {
    if (!series) {
      return [];
    }
    return series.episodes.filter((episode) => season === null || episode.seasonNumber === season);
  }, [series, season]);

  if (loading) {
    return <Loader label="Loading series..." />;
  }

  if (error || !series) {
    return <ErrorMessage message={error ?? "Series not found."} />;
  }

  return (
    <div className="detail-page">
      <Link to="/series" className="back-link">
        ← Back to series
      </Link>

      <div
        className="detail-banner"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(10,10,10,0.96) 20%, rgba(10,10,10,0.4) 80%), " +
            `url(${posterOrPlaceholder(series.bannerUrl ?? series.posterUrl)})`,
        }}
      >
        <div className="detail-content">
          <img
            className="detail-poster"
            src={posterOrPlaceholder(series.posterUrl)}
            alt={series.title}
          />

          <div className="detail-info">
            <h1>{series.title}</h1>

            <div className="chip-row">
              {series.releaseYear && <span className="chip">{series.releaseYear}</span>}
              {series.language && <span className="chip">{series.language}</span>}
              {series.seasonNo && <span className="chip">{series.seasonNo} seasons</span>}
              {series.genre && <span className="chip">{series.genre.name}</span>}
              {series.rating !== null && <span className="chip">★ {series.rating.toFixed(1)}</span>}
            </div>

            {series.description && <p className="detail-description">{series.description}</p>}

            {series.trailerUrl && (
              <div className="button-row">
                <a
                  href={series.trailerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                >
                  Trailer
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="home-section">
        <div className="section-title">
          <h2>Episodes</h2>

          {seasons.length > 1 && (
            <select
              className="select-input"
              value={season ?? ""}
              onChange={(event) => setSeason(Number(event.target.value))}
              aria-label="Choose a season"
            >
              {seasons.map((number) => (
                <option key={number} value={number}>
                  Season {number}
                </option>
              ))}
            </select>
          )}
        </div>

        {visibleEpisodes.length === 0 ? (
          <EmptyState
            title="No episodes yet"
            hint="An administrator can add episodes from the admin dashboard."
          />
        ) : (
          <ul className="episode-list">
            {visibleEpisodes.map((episode) => (
              <li key={episode.id} className="episode-row">
                <img
                  className="episode-thumb"
                  src={posterOrPlaceholder(episode.thumbnailUrl ?? series.posterUrl)}
                  alt={episode.title}
                  loading="lazy"
                />

                <div className="episode-body">
                  <h3>
                    <span className="episode-number">
                      {episodeLabel(episode.seasonNumber, episode.episodeNumber)}
                    </span>{" "}
                    {episode.title}
                  </h3>
                  {episode.description && <p className="muted">{episode.description}</p>}
                  {episode.duration && <span className="chip">{episode.duration}</span>}
                </div>

                <div className="episode-actions">
                  <Link to={`/watch/episode/${episode.id}`} className="btn btn-primary btn-sm">
                    ▶ Play
                  </Link>
                  {episode.downloadUrl && (
                    <a
                      href={episode.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      Download
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default SeriesDetails;
