const BASE_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

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
