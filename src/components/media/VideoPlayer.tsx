import { isEmbedded, resolveVideoSource } from "../../utils/video";

interface Props {
  url: string | null | undefined;
  title: string;
  poster?: string | null;
}

/**
 * Renders an <iframe> for hosted platforms (YouTube, Vimeo, Drive) and a real
 * <video> element for direct file links.
 */
function VideoPlayer({ url, title, poster }: Props) {
  const source = resolveVideoSource(url);

  if (source.kind === "none") {
    return (
      <div className="video-wrapper video-empty">
        <p>No video source has been added for this title yet.</p>
      </div>
    );
  }

  if (isEmbedded(source.kind)) {
    return (
      <div className="video-wrapper video-embed">
        <iframe
          src={source.url}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="video-wrapper">
      <video controls playsInline poster={poster ?? undefined} preload="metadata">
        <source src={source.url} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default VideoPlayer;
