import { useState } from "react";
import type { Movie } from "../../types/Movie";

interface Props {
  onSubmit: (movie: Partial<Movie>) => void;
}

function MovieForm({ onSubmit }: Props) {
  const [movie, setMovie] = useState<Partial<Movie>>({
    title: "",
    description: "",
    releaseYear: 2026,
    language: "",
    duration: "",
    posterUrl: "",
    bannerUrl: "",
    trailerUrl: "",
    videoUrl: "",
    downloadUrl: "",
    type: "MOVIE",
    genre: {
      id: 1,
      name: "",
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setMovie({
      ...movie,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(movie);
  };

  return (
    <form className="movie-form" onSubmit={handleSubmit}>
      <input name="title" placeholder="Movie title" onChange={handleChange} />

      <textarea
        name="description"
        placeholder="Description"
        onChange={handleChange}
      />

      <input name="releaseYear" placeholder="Release year" onChange={handleChange} />
      <input name="language" placeholder="Language" onChange={handleChange} />
      <input name="duration" placeholder="Duration" onChange={handleChange} />
      <input name="posterUrl" placeholder="Poster URL" onChange={handleChange} />
      <input name="bannerUrl" placeholder="Banner URL" onChange={handleChange} />
      <input name="trailerUrl" placeholder="Trailer URL" onChange={handleChange} />
      <input name="videoUrl" placeholder="Video URL" onChange={handleChange} />
      <input name="downloadUrl" placeholder="Download URL" onChange={handleChange} />

      <button type="submit">Save Movie</button>
    </form>
  );
}

export default MovieForm;