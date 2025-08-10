export interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}

export interface ErrorResponse {
  message: string;
  status: number;
  details?: unknown;
}

export const formatApiError = (error: unknown): ApiError => {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response: { data?: { message?: string }; status: number } }).response;
    return {
      message: response.data?.message || 'Server error',
      status: response.status,
      details: response.data,
    };
  } else if (error && typeof error === 'object' && 'request' in error) {
    return {
      message: 'No response from server',
      status: 0,
      details: { request: (error as { request: unknown }).request },
    };
  } else {
    return {
      message: error instanceof Error ? error.message : 'Unknown error',
      status: 0,
      details: error,
    };
  }
};

export const isNetworkError = (error: unknown): boolean => {
  return error && typeof error === 'object' && 'request' in error && !('response' in error);
};

export const isServerError = (error: unknown): boolean => {
  return error && typeof error === 'object' && 'response' in error && 
    (error as { response: { status: number } }).response.status >= 500;
};

export const isClientError = (error: unknown): boolean => {
  return error && typeof error === 'object' && 'response' in error && 
    (error as { response: { status: number } }).response.status >= 400 && 
    (error as { response: { status: number } }).response.status < 500;
};

export const getErrorMessage = (error: unknown): string => {
  const formattedError = formatApiError(error);
  return formattedError.message;
};
