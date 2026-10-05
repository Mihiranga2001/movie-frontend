const PLACEHOLDER_POSTER =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="440">
       <rect width="100%" height="100%" fill="#1d1d1d"/>
       <text x="50%" y="50%" fill="#666" font-family="Arial, sans-serif"
             font-size="18" text-anchor="middle">No image</text>
     </svg>`,
  );

export function posterOrPlaceholder(url: string | null | undefined): string {
  return url?.trim() ? url : PLACEHOLDER_POSTER;
}

export function formatRating(rating: number | null | undefined): string | null {
  if (rating === null || rating === undefined) {
    return null;
  }
  return `${rating.toFixed(1)} / 10`;
}

export function formatDate(value: string | null | undefined): string {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function episodeLabel(seasonNumber: number, episodeNumber: number): string {
  const season = String(seasonNumber).padStart(2, "0");
  const episode = String(episodeNumber).padStart(2, "0");
  return `S${season}E${episode}`;
}

/** Drops empty strings so the API stores NULL instead of "". */
export function blankToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

/** Parses a numeric form field, tolerating an empty box. */
export function numberOrNull(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === "") {
    return null;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}
