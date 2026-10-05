export type VideoKind = "youtube" | "vimeo" | "drive" | "file" | "embed" | "none";

export interface VideoSource {
  kind: VideoKind;
  /** Ready to drop into <video src> or <iframe src>. */
  url: string;
}

const FILE_EXTENSIONS = [".mp4", ".webm", ".ogg", ".ogv", ".mov", ".m4v"];

function youTubeId(url: URL): string | null {
  if (url.hostname.endsWith("youtu.be")) {
    return url.pathname.slice(1) || null;
  }
  if (!url.hostname.endsWith("youtube.com")) {
    return null;
  }
  if (url.pathname === "/watch") {
    return url.searchParams.get("v");
  }
  const embedMatch = /^\/(?:embed|v|shorts)\/([\w-]+)/.exec(url.pathname);
  return embedMatch ? embedMatch[1] : null;
}

/**
 * Works out how a stored URL should actually be played. The original Watch
 * page always rendered a <video> tag, which silently showed a black box for
 * the YouTube links people normally paste.
 */
export function resolveVideoSource(rawUrl: string | null | undefined): VideoSource {
  const value = rawUrl?.trim();
  if (!value) {
    return { kind: "none", url: "" };
  }

  let url: URL;
  try {
    url = new URL(value, window.location.origin);
  } catch {
    return { kind: "file", url: value };
  }

  const youtube = youTubeId(url);
  if (youtube) {
    return { kind: "youtube", url: `https://www.youtube.com/embed/${youtube}` };
  }

  if (url.hostname.endsWith("vimeo.com")) {
    const id = /(\d+)/.exec(url.pathname)?.[1];
    if (id) {
      return { kind: "vimeo", url: `https://player.vimeo.com/video/${id}` };
    }
  }

  if (url.hostname.endsWith("drive.google.com")) {
    const id = /\/file\/d\/([\w-]+)/.exec(url.pathname)?.[1];
    if (id) {
      return { kind: "drive", url: `https://drive.google.com/file/d/${id}/preview` };
    }
  }

  const path = url.pathname.toLowerCase();
  if (FILE_EXTENSIONS.some((extension) => path.endsWith(extension))) {
    return { kind: "file", url: value };
  }

  return { kind: "embed", url: value };
}

export function isEmbedded(kind: VideoKind): boolean {
  return kind === "youtube" || kind === "vimeo" || kind === "drive" || kind === "embed";
}
