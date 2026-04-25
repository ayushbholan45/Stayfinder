'use server';

import { cookies } from 'next/headers';

export async function handleRefresh() {
    console.log('handleRefresh');

    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
        await resetAuthCookies();
        return null;
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/auth/token/refresh/`, {
            method: 'POST',
            body: JSON.stringify({ refresh: refreshToken }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const json = await response.json();
        console.log('Response - Refresh:', json);

        if (json.access) {
            const cookieStore = await cookies();
            cookieStore.set('session_access_token', json.access, {
                httpOnly: true,
                secure: false,
                maxAge: 60 * 60,
                path: '/'
            });
            return json.access;
        }

        await resetAuthCookies();
        return null;

    } catch (error) {
        console.log('error', error);
        await resetAuthCookies();
        return null;
    }
}

export async function handleLogin(userId: string, accessToken: string, refreshToken: string) {
    const cookieStore = await cookies();

    cookieStore.set('session_userid', userId, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
    });

    cookieStore.set('session_access_token', accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60,
        path: '/'
    });

    cookieStore.set('session_refresh_token', refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
    });
}

export async function resetAuthCookies() {
    const cookieStore = await cookies();
    cookieStore.set('session_userid', '');
    cookieStore.set('session_access_token', '');
    cookieStore.set('session_refresh_token', '');
}

export async function getUserId() {
    const cookieStore = await cookies();
    const userId = cookieStore.get('session_userid')?.value;
    return userId ? userId : null;
}

export async function getAccessToken() {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get('session_access_token')?.value;

    if (!accessToken) {
        accessToken = await handleRefresh() ?? undefined;
    }

    return accessToken ?? null;
}

export async function getRefreshToken() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('session_refresh_token')?.value;
    return refreshToken ?? null;
}