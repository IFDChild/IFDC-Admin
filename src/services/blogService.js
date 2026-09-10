import { API_URL } from "./apiConfig";

export const uploadBlogImage = async (file) => {

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
        `${API_URL}/uploads/image`,
        {
            method: "POST",
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
    const response = await fetch(`${API_URL}/blogs`);

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