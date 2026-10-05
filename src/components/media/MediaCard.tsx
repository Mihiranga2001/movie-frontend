import { Link } from "react-router-dom";

import { formatRating, posterOrPlaceholder } from "../../utils/format";

export interface MediaCardItem {
  id: number;
  title: string;
  posterUrl: string | null;
  releaseYear: number | null;
  language: string | null;
  rating: number | null;
  genreName?: string | null;
}

interface Props {
  item: MediaCardItem;
  /** "/movies" or "/series" — the card links to `${basePath}/${id}`. */
  basePath: string;
  badge?: string;
}

function MediaCard({ item, basePath, badge }: Props) {
  const rating = formatRating(item.rating);

  return (
    <article className="media-card">
      <Link to={`${basePath}/${item.id}`} className="media-card-poster">
        <img src={posterOrPlaceholder(item.posterUrl)} alt={item.title} loading="lazy" />
        {badge && <span className="media-badge">{badge}</span>}
        {rating && <span className="media-rating">★ {item.rating?.toFixed(1)}</span>}
      </Link>

      <div className="media-card-body">
        <h3 title={item.title}>{item.title}</h3>
        <p className="media-meta">
          {[item.releaseYear, item.language, item.genreName].filter(Boolean).join(" • ") || "—"}
        </p>
        <Link to={`${basePath}/${item.id}`} className="btn btn-primary btn-sm">
          View details
        </Link>
      </div>
    </article>
  );
}

export default MediaCard;
