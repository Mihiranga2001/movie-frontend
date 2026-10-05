import type { Genre } from "../../types/Genre";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  genres: Genre[];
  genreId: number | null;
  onGenreChange: (value: number | null) => void;
  placeholder?: string;
}

function SearchFilterBar({
  search,
  onSearchChange,
  genres,
  genreId,
  onGenreChange,
  placeholder = "Search by title...",
}: Props) {
  return (
    <div className="filter-bar">
      <input
        type="search"
        className="search-input"
        placeholder={placeholder}
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        aria-label="Search"
      />

      <select
        className="select-input"
        value={genreId ?? ""}
        onChange={(event) => onGenreChange(event.target.value === "" ? null : Number(event.target.value))}
        aria-label="Filter by genre"
      >
        <option value="">All genres</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>

      {(search !== "" || genreId !== null) && (
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            onSearchChange("");
            onGenreChange(null);
          }}
        >
          Clear
        </button>
      )}
    </div>
  );
}

export default SearchFilterBar;
