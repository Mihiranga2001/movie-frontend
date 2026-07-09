import { useEffect, useState } from "react";
import { getAllMovies } from "../../services/movieService";
import MovieCard from "../../components/movie/MovieCard";
import type { Movie } from "../../types/Movie";

function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllMovies()
      .then((data) => {
        setMovies(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <h2>Loading movies...</h2>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Movies</h1>

        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredMovies.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        <div className="movie-grid">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Movies;