import { useCallback, useEffect, useState } from "react";

import Banner from "../common/Banner";
import Loader from "../common/Loader";
import { getErrorMessage } from "../../services/api";
import {
  createEpisode,
  deleteEpisode,
  getEpisodes,
  updateEpisode,
} from "../../services/seriesService";
import type { Episode, EpisodePayload } from "../../types/Episode";
import type { TvSeries } from "../../types/TvSeries";
import { blankToNull, episodeLabel } from "../../utils/format";

interface Props {
  seriesList: TvSeries[];
}

interface FormState {
  seasonNumber: string;
  episodeNumber: string;
  title: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
  downloadUrl: string;
}

const EMPTY: FormState = {
  seasonNumber: "1",
  episodeNumber: "1",
  title: "",
  description: "",
  duration: "",
  thumbnailUrl: "",
  videoUrl: "",
  downloadUrl: "",
};

/** Episodes had no UI at all in the original project. */
function EpisodeManager({ seriesList }: Props) {
  const [seriesId, setSeriesId] = useState<number | null>(seriesList[0]?.id ?? null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (seriesId === null && seriesList.length > 0) {
      setSeriesId(seriesList[0].id);
    }
  }, [seriesList, seriesId]);

  const loadEpisodes = useCallback(() => {
    if (seriesId === null) {
      setEpisodes([]);
      return;
    }
    setLoading(true);
    getEpisodes(seriesId)
      .then(setEpisodes)
      .catch((err: unknown) => setError(getErrorMessage(err, "Could not load episodes.")))
      .finally(() => setLoading(false));
  }, [seriesId]);

  useEffect(loadEpisodes, [loadEpisodes]);

  const update = (field: keyof FormState, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const resetForm = () => {
    setForm(EMPTY);
    setEditingId(null);
  };

  const startEdit = (episode: Episode) => {
    setEditingId(episode.id);
    setForm({
      seasonNumber: episode.seasonNumber.toString(),
      episodeNumber: episode.episodeNumber.toString(),
      title: episode.title,
      description: episode.description ?? "",
      duration: episode.duration ?? "",
      thumbnailUrl: episode.thumbnailUrl ?? "",
      videoUrl: episode.videoUrl ?? "",
      downloadUrl: episode.downloadUrl ?? "",
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (seriesId === null) {
      return;
    }

    const payload: EpisodePayload = {
      seasonNumber: Number(form.seasonNumber) || 1,
      episodeNumber: Number(form.episodeNumber) || 1,
      title: form.title.trim(),
      description: blankToNull(form.description),
      duration: blankToNull(form.duration),
      thumbnailUrl: blankToNull(form.thumbnailUrl),
      videoUrl: blankToNull(form.videoUrl),
      downloadUrl: blankToNull(form.downloadUrl),
    };

    setSubmitting(true);
    setError(null);
    try {
      if (editingId === null) {
        await createEpisode(seriesId, payload);
        setNotice("Episode added.");
      } else {
        await updateEpisode(editingId, payload);
        setNotice("Episode updated.");
      }
      resetForm();
      loadEpisodes();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Could not save the episode."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (episode: Episode) => {
    if (!window.confirm(`Delete "${episode.title}"?`)) {
      return;
    }
    try {
      await deleteEpisode(episode.id);
      setNotice("Episode deleted.");
      loadEpisodes();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Could not delete the episode."));
    }
  };

  if (seriesList.length === 0) {
    return <p className="muted">Add a TV series first, then you can add episodes to it.</p>;
  }

  return (
    <div>
      {error && <Banner tone="error" message={error} onDismiss={() => setError(null)} />}
      {notice && <Banner tone="success" message={notice} onDismiss={() => setNotice(null)} />}

      <label className="form-field">
        <span>Series</span>
        <select
          value={seriesId ?? ""}
          onChange={(event) => {
            setSeriesId(Number(event.target.value));
            resetForm();
          }}
        >
          {seriesList.map((series) => (
            <option key={series.id} value={series.id}>
              {series.title}
            </option>
          ))}
        </select>
      </label>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editingId === null ? "Add an episode" : "Edit episode"}</h3>

        <div className="form-grid">
          <label className="form-field">
            <span>Season *</span>
            <input
              type="number"
              min={1}
              value={form.seasonNumber}
              onChange={(event) => update("seasonNumber", event.target.value)}
              required
            />
          </label>

          <label className="form-field">
            <span>Episode *</span>
            <input
              type="number"
              min={1}
              value={form.episodeNumber}
              onChange={(event) => update("episodeNumber", event.target.value)}
              required
            />
          </label>

          <label className="form-field form-wide">
            <span>Title *</span>
            <input
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              placeholder="Episode title"
              required
            />
          </label>

          <label className="form-field form-wide">
            <span>Description</span>
            <textarea
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
            />
          </label>

          <label className="form-field">
            <span>Duration</span>
            <input
              value={form.duration}
              onChange={(event) => update("duration", event.target.value)}
              placeholder="48m"
            />
          </label>

          <label className="form-field form-wide">
            <span>Thumbnail URL</span>
            <input
              value={form.thumbnailUrl}
              onChange={(event) => update("thumbnailUrl", event.target.value)}
              placeholder="https://..."
            />
          </label>

          <label className="form-field form-wide">
            <span>Video URL</span>
            <input
              value={form.videoUrl}
              onChange={(event) => update("videoUrl", event.target.value)}
              placeholder="https://..."
            />
          </label>

          <label className="form-field form-wide">
            <span>Download URL</span>
            <input
              value={form.downloadUrl}
              onChange={(event) => update("downloadUrl", event.target.value)}
              placeholder="https://..."
            />
          </label>
        </div>

        <div className="button-row">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Saving..." : editingId === null ? "Add episode" : "Save changes"}
          </button>
          {editingId !== null && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <Loader label="Loading episodes..." />
      ) : episodes.length === 0 ? (
        <p className="muted">This series has no episodes yet.</p>
      ) : (
        <div className="admin-list">
          {episodes.map((episode) => (
            <div className="admin-row" key={episode.id}>
              <div>
                <strong>
                  {episodeLabel(episode.seasonNumber, episode.episodeNumber)} — {episode.title}
                </strong>
                <p className="muted">{episode.duration ?? "No duration set"}</p>
              </div>
              <div className="button-row">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => startEdit(episode)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(episode)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EpisodeManager;
