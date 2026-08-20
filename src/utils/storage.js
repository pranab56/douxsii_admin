export const saveToken = (token) => {
    localStorage.setItem("douxsii-admin-token", token);
    // Set cookie so Next.js middleware can read it for route protection
    document.cookie = `douxsii-admin-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
};

export const getToken = () => {
    return localStorage.getItem("douxsii-admin-token");
};

export const removeToken = () => {
    localStorage.removeItem("douxsii-admin-token");
    // Remove cookie
    document.cookie = "douxsii-admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};
