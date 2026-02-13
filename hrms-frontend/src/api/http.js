const BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log('API BASE URL: ', BASE_URL);
export async function apiFetch(endpoint, options={}) {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
    }

    return data;
}