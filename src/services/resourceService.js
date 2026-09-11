import { API_URL, MEDIA_URL, readApiError } from "./apiConfig";
import { authHeaders } from "./authService";

export const AUDIENCES = [
    "Parents & Caregivers",
    "Educators & Schools",
    "Policymakers & Research",
    "Journalists & Media",
    "Children & Young People",
];

/** Absolute URL for a file stored on the API (e.g. /uploads/xyz.pdf). */
export const fileUrl = (path) =>
    !path ? "" : /^https?:\/\//.test(path) ? path : `${MEDIA_URL}${path}`;

export const formatBytes = (bytes) => {
    if (!bytes || bytes < 1024) return `${bytes || 0} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const request = async (path, options = {}, fallbackError = "Request failed") => {
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            ...(options.headers || {}),
            ...authHeaders(),
        },
    });

    if (response.status === 401) {
        throw new Error("Your session has expired. Please sign in again.");
    }

    if (!response.ok) {
        throw new Error(await readApiError(response, fallbackError));
    }

    return response.status === 204 ? null : await response.json();
};

/** Admin listing - includes drafts. */
export const getResources = async () =>
    request(
        "/resources?include_drafts=true",
        {},
        "Failed to load resources"
    );

/** Upload the PDF, then create the record that points at it. */
export const uploadResourceFile = async (file) => {
    const body = new FormData();
    body.append("file", file);

    const response = await fetch(`${API_URL}/uploads/document`, {
        method: "POST",
        body,
        headers: { ...authHeaders() },
    });

    if (!response.ok) {
        throw new Error(await readApiError(response, "File upload failed"));
    }

    return await response.json();
};

export const createResource = async (data) =>
    request(
        "/resources",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        },
        "Failed to create the resource"
    );

export const updateResource = async (id, data) =>
    request(
        `/resources/${id}`,
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        },
        "Failed to update the resource"
    );

export const deleteResource = async (id) =>
    request(
        `/resources/${id}`,
        { method: "DELETE" },
        "Failed to delete the resource"
    );
