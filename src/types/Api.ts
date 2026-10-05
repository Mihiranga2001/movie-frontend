/** Error body returned by the backend's GlobalExceptionHandler. */
export interface ApiErrorBody {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  fieldErrors: Record<string, string> | null;
}

export interface MessageResponse {
  message: string;
}
