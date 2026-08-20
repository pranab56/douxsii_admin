import { baseApi } from "../../utils/apiBaseQuery";

export interface NotificationItem {
    _id: string;
    userId?: string;
    title: string;
    message: string;
    type?: string;
    status?: string;
    isRead: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface NotificationApiResponse {
    success: boolean;
    message: string;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    };
    data?: NotificationItem[];
}

export const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllNotification: builder.query<NotificationApiResponse, { page?: number } | void>({
            query: (params) => {
                const page = params?.page || 1;
                return {
                    url: `/notification/admin-all?page=${page}`,
                    method: "GET",
                };
            },
            providesTags: ["notification"],
        }),

        singleReadNotification: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/notification/read/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: ["notification"],
        }),

        readAllNotification: builder.mutation<{ success: boolean; message: string }, void>({
            query: () => ({
                url: `/notification/all-read`,
                method: "POST",
            }),
            invalidatesTags: ["notification"],
        }),
    }),
});

export const {
    useGetAllNotificationQuery,
    useSingleReadNotificationMutation,
    useReadAllNotificationMutation,
} = notificationApi;
