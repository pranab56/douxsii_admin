import { baseApi } from "../../utils/apiBaseQuery";

export interface SettingsData {
    logo?: string;
    platformName?: string;
    privacyPolicy?: string;
    aboutUs?: string;
    support?: string;
    termsOfService?: string;
}

export interface SettingsResponse {
    success: boolean;
    message: string;
    data?: SettingsData;
}

export const settingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getSettings: builder.query<SettingsResponse, { key?: string; value?: string } | void>({
            query: (params) => {
                const key = params?.key || 'termsOfService';
                const value = params?.value || key;
                return {
                    url: `/setting?${key}=${value}`,
                    method: "GET",
                };
            },
            providesTags: ["settings"],
        }),

        updateSettings: builder.mutation<SettingsResponse, SettingsData | { data: SettingsData }>({
            query: (arg) => {
                const body = 'data' in arg ? arg.data : arg;
                return {
                    url: `/setting`,
                    method: "PATCH",
                    body,
                };
            },
            invalidatesTags: ["settings"],
        }),
    }),
});

export const {
    useGetSettingsQuery,
    useUpdateSettingsMutation,
} = settingsApi;
