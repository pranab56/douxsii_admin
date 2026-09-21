export const saveToken = (token) => {
    if (!token) return;
    localStorage.setItem("douxsii-admin-token", token);
    localStorage.setItem("accessToken", token);
    // Set cookie for consistency
    document.cookie = `douxsii-admin-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    document.cookie = `douxsii-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
};

export const getToken = () => {
    return localStorage.getItem("douxsii-admin-token") || localStorage.getItem("accessToken") || null;
};

export const removeToken = () => {
    localStorage.removeItem("douxsii-admin-token");
    localStorage.removeItem("accessToken");
    // Remove cookies
    document.cookie = "douxsii-admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "douxsii-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

