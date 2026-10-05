interface Props {
  message: string;
  onRetry?: () => void;
}

function ErrorMessage({ message, onRetry }: Props) {
  return (
    <div className="state-block state-error" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-secondary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
