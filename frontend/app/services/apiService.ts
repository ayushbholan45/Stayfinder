import { getAccessToken } from "../lib/actions";

const getApiHost = () => {
    if (typeof window === 'undefined') {
        // Server-side (SSR): use internal Render service URL
        return process.env.NEXT_PUBLIC_API_HOST_SERVER || 'http://localhost:8000';
    }
    // Client-side (browser): use public Render URL
    return process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:8000';
};

const getAuthHeaders = async (includeContentType = true): Promise<Record<string, string>> => {
    const headers: Record<string, string> = {
        'Accept': 'application/json',
        ...(includeContentType && { 'Content-Type': 'application/json' }),
    };

    try {
        const token = await getAccessToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    } catch {
        // not authenticated, continue without token
    }

    return headers;
};

const apiService = {
    get: async function (url: string): Promise<any> {
        console.log('get', url);

        const headers = await getAuthHeaders();

        const response = await fetch(`${getApiHost()}${url}`, {
            method: 'GET',
            headers
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    post: async function (url: string, data: any): Promise<any> {
        console.log('post', url, data);

        // Fixed: was using process.env.NEXT_PUBLIC_API_HOST directly, missing SSR host
        const headers = await getAuthHeaders();

        const response = await fetch(`${getApiHost()}${url}`, {
            method: 'POST',
            body: data,
            headers
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    postForm: async function (url: string, data: FormData): Promise<any> {
        // Fixed: FormData must NOT have Content-Type set (browser sets it with boundary)
        const headers = await getAuthHeaders(false);

        const response = await fetch(`${getApiHost()}${url}`, {
            method: 'POST',
            body: data,
            headers
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    },

    postWithoutToken: async function (url: string, data: any): Promise<any> {
        console.log('post', url, data);

        // Fixed: was using process.env.NEXT_PUBLIC_API_HOST directly, missing SSR host
        const response = await fetch(`${getApiHost()}${url}`, {
            method: 'POST',
            body: data,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        return response.json();
    },

    delete: async function (url: string): Promise<any> {
        console.log('delete', url);

        // Fixed: was using process.env.NEXT_PUBLIC_API_HOST directly, missing SSR host
        const headers = await getAuthHeaders();

        const response = await fetch(`${getApiHost()}${url}`, {
            method: 'DELETE',
            headers
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        return text ? JSON.parse(text) : { success: true };
    }
}

export default apiService;