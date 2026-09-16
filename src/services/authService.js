import { API_URL, readApiError } from "./apiConfig";

const SESSION_KEY = "ifdc_admin_user";
export const SESSION_EVENT = "ifdc-session-change";

const notifySessionChange = () => {
    try {
        window.dispatchEvent(new Event(SESSION_EVENT));
    } catch {
        // non-browser environment
    }
};

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
            await readApiError(response, "Invalid email or password")
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

/**
 * "Remember this device" keeps the session in localStorage (survives
 * restarts); otherwise it lives in sessionStorage and ends with the tab.
 */
const stores = () => {
    const found = [];
    try { found.push(window.localStorage); } catch { /* unavailable */ }
    try { found.push(window.sessionStorage); } catch { /* unavailable */ }
    return found;
};

export const saveSession = (data, rememberDevice = true) => {
    const session = {
        token: data.access_token,
        expiresAt: Date.now() + (data.expires_in ?? 86400) * 1000,
        user: data.user,
        email: data.user?.email,
        role: data.user?.role,
        signedInAt: new Date().toISOString(),
    };

    clearSession();

    try {
        const store = rememberDevice ? window.localStorage : window.sessionStorage;
        store.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (err) {
        console.warn("Browser storage unavailable", err);
    }
    notifySessionChange();
};

export const getSession = () => {
    for (const store of stores()) {
        try {
            const raw = store.getItem(SESSION_KEY);
            if (!raw) continue;

            const session = JSON.parse(raw);
            if (!session?.token || (session.expiresAt && session.expiresAt <= Date.now())) {
                store.removeItem(SESSION_KEY);
                continue;
            }
            return session;
        } catch {
            // ignore malformed entries
        }
    }
    return null;
};

export const updateSessionUser = (user) => {
    for (const store of stores()) {
        try {
            const raw = store.getItem(SESSION_KEY);
            if (!raw) continue;
            const session = JSON.parse(raw);
            store.setItem(
                SESSION_KEY,
                JSON.stringify({ ...session, user, email: user.email, role: user.role })
            );
        } catch {
            // ignore
        }
    }
    notifySessionChange();
};

export const getToken = () => getSession()?.token ?? null;

export const clearSession = () => {
    for (const store of stores()) {
        try {
            store.removeItem(SESSION_KEY);
        } catch {
            // ignore
        }
    }
    notifySessionChange();
};

export const authHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export class UnauthorizedError extends Error {}

export const fetchCurrentUser = async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
        headers: { ...authHeaders() },
    });

    if (response.status === 401) {
        throw new UnauthorizedError(
            await readApiError(response, "Your session has expired")
        );
    }

    if (!response.ok) {
        throw new Error(
            await readApiError(response, "Could not verify your session")
        );
    }

    return await response.json();
};

export const changePassword = async (currentPassword, newPassword) => {
    const response = await fetch(`${API_URL}/auth/change-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
        },
        body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
        }),
    });

    if (!response.ok) {
        throw new Error(
            await readApiError(response, "Could not change password")
        );
    }
};
