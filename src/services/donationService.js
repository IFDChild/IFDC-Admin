import { API_URL, readApiError } from "./apiConfig";
import { authHeaders } from "./authService";

export const DONATION_STATUSES = {
    new: { label: "New", badge: "badge-warning" },
    contacted: { label: "Contacted", badge: "badge-tertiary" },
    closed: { label: "Closed", badge: "badge-success" },
};

const request = async (path, options = {}, fallbackError = "Request failed") => {
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            ...(options.body ? { "Content-Type": "application/json" } : {}),
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

export const getDonationRequests = () =>
    request("/donations", {}, "Failed to load donation requests");

export const getDonationEmailStatus = () =>
    request("/donations/email-status", {}, "Failed to check email settings");

export const updateDonationRequest = (id, changes) =>
    request(`/donations/${id}`, { method: "PATCH", body: JSON.stringify(changes) }, "Failed to update donation request");

export const resendDonationNotification = (id) =>
    request(`/donations/${id}/resend-notification`, { method: "POST" }, "Failed to resend notification");

export const deleteDonationRequest = (id) =>
    request(`/donations/${id}`, { method: "DELETE" }, "Failed to delete donation request");
