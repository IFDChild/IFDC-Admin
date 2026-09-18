/**
 * Base address of the API. A VITE_API_URL without a scheme (e.g. entered in
 * Vercel as "ifdc-backend-production.up.railway.app") would otherwise be read
 * as a path on this site, so add https:// unless it is already there.
 */
const normaliseBase = (value) => {
    const base = (value || "").trim().replace(/\/+$/, "");

    if (!base) {
        return "http://localhost:8000";
    }

    return /^https?:\/\//.test(base) ? base : `https://${base}`;
};

const BASE_URL = normaliseBase(import.meta.env.VITE_API_URL);

export const API_URL = `${BASE_URL}/api`;

export const MEDIA_URL = BASE_URL;

/**
 * FastAPI returns { detail: "message" } for HTTPException and
 * { detail: [{ loc, msg }] } for validation errors.
 */
export const readApiError = async (response, fallback) => {
    let payload;

    try {
        payload = await response.json();
    } catch {
        return fallback;
    }

    const detail = payload?.detail;

    if (typeof detail === "string") {
        return detail;
    }

    if (Array.isArray(detail) && detail.length > 0) {
        return detail
            .map((item) => item.msg)
            .join("\n");
    }

    return fallback;
};
