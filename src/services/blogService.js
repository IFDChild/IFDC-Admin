import { API_URL } from "./apiConfig";
import { authHeaders } from "./authService";

export const uploadBlogImage = async (file) => {

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
        `${API_URL}/uploads/image`,
        {
            method: "POST",
            headers: { ...authHeaders() },
            body: formData,
        }
    );

    if (!response.ok) {

        const errorData =
            await response.json();

        throw new Error(
            errorData.detail ||
            "Image upload failed"
        );
    }

    return await response.json();
};
export const getBlogs = async () => {
    const response = await fetch(`${API_URL}/blogs/manage`, {
        headers: { ...authHeaders() },
    });

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData.detail || "Failed to fetch blogs"
        );
    }

    return await response.json();
};

export const createBlog = async (blogData) => {
    const response = await fetch(`${API_URL}/blogs`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
        },
        body: JSON.stringify(blogData),
    });

    if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
            errorData.detail || "Failed to create blog"
        );
    }

    return await response.json();
};
export const deleteBlog = async (id) => {
    const response = await fetch(`${API_URL}/blogs/${id}`, {
        method: "DELETE",
        headers: { ...authHeaders() },
    });

    if (!response.ok) {
        let message = "Failed to delete blog post";
        try {
            const errorData = await response.json();
            if (typeof errorData.detail === "string") message = errorData.detail;
        } catch {
            // keep default message
        }
        throw new Error(message);
    }
};
