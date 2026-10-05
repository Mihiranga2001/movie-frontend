import type { ReactNode } from "react";

interface Props {
  title: string;
  hint?: string;
  action?: ReactNode;
}

function EmptyState({ title, hint, action }: Props) {
  return (
    <div className="state-block">
      <h3>{title}</h3>
      {hint && <p>{hint}</p>}
      {action}
    </div>
  );
}

export default EmptyState;
