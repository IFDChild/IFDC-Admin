import { API_URL, MEDIA_URL, readApiError } from "./apiConfig";
import { authHeaders } from "./authService";

export const NEWS_CATEGORIES = [
    "Announcements",
    "Press Releases",
    "Events",
    "Partnerships",
    "Media Coverage",
];

export const newsImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `${MEDIA_URL}${path}`;
};

export const uploadNewsImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/uploads/image`, {
        method: "POST",
        headers: { ...authHeaders() },
        body: formData,
    });

    if (!response.ok) {
        throw new Error(await readApiError(response, "Image upload failed"));
    }

    return await response.json();
};

export const getAllNews = async () => {
    const response = await fetch(`${API_URL}/news/manage`, {
        headers: { ...authHeaders() },
    });

    if (!response.ok) {
        throw new Error(await readApiError(response, "Failed to load news"));
    }

    return await response.json();
};

export const createNews = async (newsData) => {
    const response = await fetch(`${API_URL}/news`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
        },
        body: JSON.stringify(newsData),
    });

    if (!response.ok) {
        throw new Error(await readApiError(response, "Failed to create news article"));
    }

    return await response.json();
};

export const updateNews = async (id, changes) => {
    const response = await fetch(`${API_URL}/news/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
        },
        body: JSON.stringify(changes),
    });

    if (!response.ok) {
        throw new Error(await readApiError(response, "Failed to update news article"));
    }

    return await response.json();
};

export const deleteNews = async (id) => {
    const response = await fetch(`${API_URL}/news/${id}`, {
        method: "DELETE",
        headers: { ...authHeaders() },
    });

    if (!response.ok) {
        throw new Error(await readApiError(response, "Failed to delete news article"));
    }
};
