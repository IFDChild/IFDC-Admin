import { API_URL, readApiError } from "./apiConfig";
import { authHeaders } from "./authService";

const getJson = async (path, fallbackError) => {
    const response = await fetch(`${API_URL}${path}`, {
        headers: { ...authHeaders() },
    });

    if (!response.ok) {
        throw new Error(await readApiError(response, fallbackError));
    }

    return await response.json();
};

/** Messages sent through the website Contact Us form (admin only). */
export const getContactMessages = () =>
    getJson("/contact", "Failed to load contact messages");

/** Enquiries sent through the Partner With Us form (admin only). */
export const getPartnerInquiries = () =>
    getJson("/partners", "Failed to load partner enquiries");
