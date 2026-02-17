import { adminToast } from './toast';

interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export async function adminApi<T = unknown>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(endpoint, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options,
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      const msg = json.error || json.message || `Request failed (${res.status})`;
      throw new Error(msg);
    }

    return json as ApiResponse<T>;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    throw new Error(message);
  }
}

export async function adminMutate<T = unknown>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  body?: unknown,
  options?: { silent?: boolean; successMessage?: string; errorMessage?: string }
): Promise<ApiResponse<T>> {
  const { silent = false, successMessage, errorMessage } = options ?? {};

  try {
    const result = await adminApi<T>(endpoint, {
      method,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!silent && successMessage) {
      adminToast.success(successMessage);
    }

    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    if (!silent) {
      adminToast.error(errorMessage ?? message);
    }
    throw err;
  }
}
