interface Props {
  label?: string;
}

function Loader({ label = "Loading..." }: Props) {
  return (
    <div className="state-block" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export default Loader;
