import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { logout } from '../features/auth/authSlice';
import { baseURL } from './BaseURL';
import { getToken } from './storage';

const cleanBaseURL = (baseURL || "").endsWith('/') ? baseURL.slice(0, -1) : (baseURL || "");

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${cleanBaseURL}/api/v1`,
  prepareHeaders: (headers) => {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    const forgetToken = typeof window !== "undefined" ? localStorage.getItem("forgetToken") : null;
    if (forgetToken && !headers.has("token")) {
      headers.set("token", forgetToken);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  const url = typeof args === "string" ? args : args?.url;
  const isAuthEndpoint = url?.startsWith("/");

  if (result.error?.status === 401 && !isAuthEndpoint) {
    api.dispatch(logout());
    api.dispatch(baseApi.util.resetApiState());
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ["overview", "users", "orders", "product", "payAndWith", "gift", "gift-wallet", "community", "faq", "revenue", "blog", "profile", "customar", "partner", "property", "inquiries", "reviews", "transportation", "poa", "newsletter", "reservation", "advertisement", "settings", "disclaimer", "chat", "notification", "request"],
});
