import { useEffect, useState } from "react";

import type { Genre } from "../../types/Genre";
import type { TvSeries, TvSeriesPayload } from "../../types/TvSeries";
import { blankToNull, numberOrNull } from "../../utils/format";

interface Props {
  genres: Genre[];
  editing: TvSeries | null;
  submitting: boolean;
  onSubmit: (payload: TvSeriesPayload) => void;
  onCancelEdit: () => void;
}

interface FormState {
  title: string;
  description: string;
  releaseYear: string;
  language: string;
  seasonNo: string;
  episodeNo: string;
  rating: string;
  posterUrl: string;
  bannerUrl: string;
  trailerUrl: string;
  genreId: string;
  featured: boolean;
}

const EMPTY: FormState = {
  title: "",
  description: "",
  releaseYear: "",
  language: "",
  seasonNo: "",
  episodeNo: "",
  rating: "",
  posterUrl: "",
  bannerUrl: "",
  trailerUrl: "",
  genreId: "",
  featured: false,
};

function toFormState(series: TvSeries): FormState {
  return {
    title: series.title,
    description: series.description ?? "",
    releaseYear: series.releaseYear?.toString() ?? "",
    language: series.language ?? "",
    seasonNo: series.seasonNo?.toString() ?? "",
    episodeNo: series.episodeNo?.toString() ?? "",
    rating: series.rating?.toString() ?? "",
    posterUrl: series.posterUrl ?? "",
    bannerUrl: series.bannerUrl ?? "",
    trailerUrl: series.trailerUrl ?? "",
    genreId: series.genre?.id.toString() ?? "",
    featured: series.featured,
  };
}

function SeriesForm({ genres, editing, submitting, onSubmit, onCancelEdit }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY);

  useEffect(() => {
    setForm(editing ? toFormState(editing) : EMPTY);
  }, [editing]);

  const update = (field: keyof FormState, value: string | boolean) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    onSubmit({
      title: form.title.trim(),
      description: blankToNull(form.description),
      releaseYear: numberOrNull(form.releaseYear),
      language: blankToNull(form.language),
      seasonNo: numberOrNull(form.seasonNo),
      episodeNo: numberOrNull(form.episodeNo),
      rating: numberOrNull(form.rating),
      posterUrl: blankToNull(form.posterUrl),
      bannerUrl: blankToNull(form.bannerUrl),
      trailerUrl: blankToNull(form.trailerUrl),
      featured: form.featured,
      genreId: form.genreId === "" ? null : Number(form.genreId),
    });
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h3>{editing ? `Edit "${editing.title}"` : "Add a new series"}</h3>

      <div className="form-grid">
        <label className="form-field form-wide">
          <span>Title *</span>
          <input
            value={form.title}
            onChange={(event) => update("title", event.target.value)}
            placeholder="Series title"
            required
          />
        </label>

        <label className="form-field form-wide">
          <span>Description</span>
          <textarea
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
            placeholder="Short synopsis"
          />
        </label>

        <label className="form-field">
          <span>Release year</span>
          <input
            type="number"
            min={1888}
            max={2200}
            value={form.releaseYear}
            onChange={(event) => update("releaseYear", event.target.value)}
          />
        </label>

        <label className="form-field">
          <span>Language</span>
          <input
            value={form.language}
            onChange={(event) => update("language", event.target.value)}
            placeholder="English"
          />
        </label>

        <label className="form-field">
          <span>Total seasons</span>
          <input
            type="number"
            min={0}
            value={form.seasonNo}
            onChange={(event) => update("seasonNo", event.target.value)}
          />
        </label>

        <label className="form-field">
          <span>Total episodes</span>
          <input
            type="number"
            min={0}
            value={form.episodeNo}
            onChange={(event) => update("episodeNo", event.target.value)}
          />
        </label>

        <label className="form-field">
          <span>Rating (0-10)</span>
          <input
            type="number"
            step="0.1"
            min={0}
            max={10}
            value={form.rating}
            onChange={(event) => update("rating", event.target.value)}
          />
        </label>

        <label className="form-field">
          <span>Genre</span>
          <select value={form.genreId} onChange={(event) => update("genreId", event.target.value)}>
            <option value="">No genre</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </label>

        <label className="form-field form-checkbox">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) => update("featured", event.target.checked)}
          />
          <span>Feature this series</span>
        </label>

        <label className="form-field form-wide">
          <span>Poster URL</span>
          <input
            value={form.posterUrl}
            onChange={(event) => update("posterUrl", event.target.value)}
            placeholder="https://..."
          />
        </label>

        <label className="form-field form-wide">
          <span>Banner URL</span>
          <input
            value={form.bannerUrl}
            onChange={(event) => update("bannerUrl", event.target.value)}
            placeholder="https://..."
          />
        </label>

        <label className="form-field form-wide">
          <span>Trailer URL</span>
          <input
            value={form.trailerUrl}
            onChange={(event) => update("trailerUrl", event.target.value)}
            placeholder="https://youtube.com/watch?v=..."
          />
        </label>
      </div>

      <div className="button-row">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : editing ? "Save changes" : "Add series"}
        </button>
        {editing && (
          <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default SeriesForm;
