import { getAccessToken } from "../lib/actions";

const apiService = {
    get: async function (url: string): Promise<any> {
        console.log('get', url);

        let headers: Record<string, string> = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        try {
            const token = await getAccessToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        } catch {
            // not authenticated, continue without token
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
            method: 'GET',
            headers
        });

        return response.json();
    },

    delete: async function (url: string): Promise<any> {
        console.log('delete', url);

        let headers: Record<string, string> = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        try {
            const token = await getAccessToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        } catch {}

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
            method: 'DELETE',
            headers
        });

        return response.json();
    },

    post: async function (url: string, data: any): Promise<any> {
        console.log('post', url, data);

        let headers: Record<string, string> = {};

        try {
            const token = await getAccessToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        } catch {
            // not authenticated, continue without token
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
            method: 'POST',
            body: data,
            headers
        });

        return response.json();
    },

    postWithoutToken: async function (url: string, data: any): Promise<any> {
        console.log('post', url, data);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
            method: 'POST',
            body: data,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        return response.json();
    }
}

export default apiService;