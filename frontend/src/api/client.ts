const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5107/api';

export async function httpClient<T>(
    input: string,
    options?: RequestInit
): Promise<T> {
    // Fetch a la API
    const response = await fetch(`${BASE_URL}${input}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options,
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'API error');
    }

    // 204 No Content
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}