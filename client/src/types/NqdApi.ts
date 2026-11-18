export interface NqdApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  error: string | null;
}

export interface NqdHealth {
  database: string;
}
