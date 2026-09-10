import { API_URL, readApiError } from "./apiConfig";
import { authHeaders } from "./authService";

/** Backend status -> admin UI presentation. */
export const STATUS_META = {
    new: { label: "Pending", badge: "badge-warning" },
    reviewing: { label: "In Review", badge: "badge-tertiary" },
    accepted: { label: "Approved", badge: "badge-success" },
    rejected: { label: "Rejected", badge: "badge-error" },
};

export const statusMeta = (status) =>
    STATUS_META[status] || { label: status, badge: "badge-draft" };

const request = async (path, options = {}, fallbackError = "Request failed") => {
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            ...(options.headers || {}),
            ...authHeaders(),
        },
    });

    if (response.status === 401) {
        throw new Error(
            "Your session has expired. Please sign in again."
        );
    }

    if (!response.ok) {
        throw new Error(await readApiError(response, fallbackError));
    }

    return await response.json();
};

export const getVolunteers = async (status) => {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";

    return request(
        `/volunteers${query}`,
        {},
        "Failed to load volunteer applications"
    );
};

export const getVolunteer = async (id) =>
    request(
        `/volunteers/${id}`,
        {},
        "Failed to load this application"
    );

export const updateVolunteerStatus = async (id, status) =>
    request(
        `/volunteers/${id}`,
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        },
        "Failed to update the application status"
    );
