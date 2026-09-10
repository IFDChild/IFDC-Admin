import { API_URL, readApiError } from "./apiConfig";

const SESSION_KEY = "ifdc_admin_user";

export const loginUser = async (email, password, rememberDevice = true) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
            remember_device: rememberDevice,
        }),
    });

    if (!response.ok) {
        throw new Error(
            await readApiError(response, "Invalid credentials")
        );
    }

    return await response.json();
};

export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error(
            await readApiError(response, "Registration failed")
        );
    }

    return await response.json();
};

export const saveSession = (data) => {
    try {
        localStorage.setItem(
            SESSION_KEY,
            JSON.stringify({
                token: data.access_token,
                email: data.user?.email,
                role: data.user?.role,
                signedInAt: new Date().toISOString(),
            })
        );
    } catch (err) {
        console.warn("LocalStorage unavailable", err);
    }
};

export const getSession = () => {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export const getToken = () => getSession()?.token ?? null;

export const clearSession = () => {
    try {
        localStorage.removeItem(SESSION_KEY);
    } catch (err) {
        console.warn("LocalStorage unavailable", err);
    }
};

export const authHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};
