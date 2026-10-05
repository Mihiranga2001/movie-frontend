import MediaCard from "./MediaCard";
import type { MediaCardItem } from "./MediaCard";

interface Props {
  items: MediaCardItem[];
  basePath: string;
  badge?: string;
}

function MediaGrid({ items, basePath, badge }: Props) {
  return (
    <div className="media-grid">
      {items.map((item) => (
        <MediaCard key={item.id} item={item} basePath={basePath} badge={badge} />
      ))}
    </div>
  );
}

export default MediaGrid;
