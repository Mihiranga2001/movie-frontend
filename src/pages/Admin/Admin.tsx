import { useEffect, useState } from "react";

import MovieForm from "../../components/admin/MovieForm";
import type { Movie } from "../../types/Movie";
import {
  addMovie,
  deleteMovie,
  getAllMovies,
} from "../../services/movieService";

function Admin() {
  const [movies, setMovies] = useState<Movie[]>([]);

  const loadMovies = () => {
    getAllMovies().then((data) => setMovies(data));
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleAddMovie = async (movie: Partial<Movie>) => {
    await addMovie(movie);
    loadMovies();
    alert("Movie added successfully");
  };

  const handleDeleteMovie = async (id: number) => {
    await deleteMovie(id);
    loadMovies();
    alert("Movie deleted successfully");
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <h2>Add Movie</h2>
      <MovieForm onSubmit={handleAddMovie} />

      <h2>Movie List</h2>

      <div className="admin-movie-list">
        {movies.map((movie) => (
          <div className="admin-movie-item" key={movie.id}>
            <div>
              <h3>{movie.title}</h3>
              <p>{movie.language} | {movie.releaseYear}</p>
            </div>

            <button onClick={() => handleDeleteMovie(movie.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;