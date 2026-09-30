export const saveToken = (token) => {
    if (!token) return;
    localStorage.setItem("Denior-admin-token", token);
    localStorage.setItem("accessToken", token);
    // Set cookie for consistency
    document.cookie = `Denior-admin-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    document.cookie = `Denior-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
};

export const getToken = () => {
    return localStorage.getItem("Denior-admin-token") || localStorage.getItem("accessToken") || null;
};

export const removeToken = () => {
    localStorage.removeItem("Denior-admin-token");
    localStorage.removeItem("accessToken");
    // Remove cookies
    document.cookie = "Denior-admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "Denior-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

