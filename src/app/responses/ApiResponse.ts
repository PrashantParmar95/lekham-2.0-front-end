export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  error: string | null;
  timestamp: string;
  status: string;
  data: T | null;
}
