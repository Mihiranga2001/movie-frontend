import { useState } from "react";

import Banner from "../common/Banner";
import { getErrorMessage } from "../../services/api";
import { createGenre, deleteGenre, updateGenre } from "../../services/genreService";
import type { Genre } from "../../types/Genre";

interface Props {
  genres: Genre[];
  onChanged: () => void;
}

function GenreManager({ genres, onChanged }: Props) {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const reset = () => {
    setName("");
    setEditingId(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (trimmed === "") {
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      if (editingId === null) {
        await createGenre(trimmed);
        setNotice(`Genre "${trimmed}" added.`);
      } else {
        await updateGenre(editingId, trimmed);
        setNotice("Genre updated.");
      }
      reset();
      onChanged();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Could not save the genre."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (genre: Genre) => {
    if (!window.confirm(`Delete the genre "${genre.name}"?`)) {
      return;
    }
    try {
      await deleteGenre(genre.id);
      setNotice("Genre deleted.");
      onChanged();
    } catch (err: unknown) {
      // The API refuses to delete a genre that titles still point at.
      setError(getErrorMessage(err, "Could not delete the genre."));
    }
  };

  return (
    <div>
      {error && <Banner tone="error" message={error} onDismiss={() => setError(null)} />}
      {notice && <Banner tone="success" message={notice} onDismiss={() => setNotice(null)} />}

      <form className="admin-form inline-form" onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={editingId === null ? "New genre name" : "New name"}
          required
        />
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {editingId === null ? "Add genre" : "Save"}
        </button>
        {editingId !== null && (
          <button type="button" className="btn btn-secondary" onClick={reset}>
            Cancel
          </button>
        )}
      </form>

      <div className="admin-list">
        {genres.map((genre) => (
          <div className="admin-row" key={genre.id}>
            <strong>{genre.name}</strong>
            <div className="button-row">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setEditingId(genre.id);
                  setName(genre.name);
                }}
              >
                Rename
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(genre)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GenreManager;
