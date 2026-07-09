import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getAllMovies } from "../../services/movieService";
import MovieCard from "../../components/movie/MovieCard";
import type { Movie } from "../../types/Movie";

function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const heroMovie = movies[0];
  const latestMovies = movies.slice(0, 8);

  if (loading) {
    return <h2>Loading home page...</h2>;
  }

  return (
    <div className="home-page">
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

      {heroMovie && (
        <section
          className="hero-section"
          style={{
            backgroundImage: `linear-gradient(to right, #111 30%, rgba(0,0,0,0.4)), url(${heroMovie.bannerUrl})`,
          }}
        >
          <div className="hero-content">
            <h1>{heroMovie.title}</h1>
            <p>{heroMovie.description}</p>

            <div className="hero-info">
              <span>{heroMovie.releaseYear}</span>
              <span>{heroMovie.language}</span>
              <span>{heroMovie.duration}</span>
            </div>

            <div className="hero-buttons">
              <Link to={`/watch/movie/${heroMovie.id}`} className="watch-btn">
                Watch Now
              </Link>

              <Link to={`/movies/${heroMovie.id}`} className="details-btn">
                View Details
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="home-section">
        <div className="section-title">
          <h2>Latest Movies</h2>
          <Link to="/movies">View All</Link>
        </div>

        {filteredMovies.length === 0 ? (
          <p>No movies found.</p>
        ) : (
          <div className="movie-grid">
            {filteredMovies.slice(0, 8).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;