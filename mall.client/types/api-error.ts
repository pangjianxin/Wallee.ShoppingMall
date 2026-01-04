export interface ApiError {
  error: {
    message: string;
    code?: number;
    originalError?: any;
  };
}
