import { baseApi } from "../../utils/apiBaseQuery";

export const requestApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllRequest: builder.query({
            query: (params) => {
                return {
                    url: `/shop`,
                    method: "GET",
                    params,
                };
            },
            providesTags: ["request"],
        }),

        getSingleRequest: builder.query({
            query: (id) => {
                return {
                    url: `/shop/${id}`,
                    method: "GET",
                };
            },
            providesTags: ["request"],
        }),

        requestAcceptCancel: builder.mutation({
            query: ({ id, data }) => {
                return {
                    url: `/shop/accept-cancel/${id}`,
                    method: "PATCH",
                    body: data
                };
            },
            invalidatesTags: ["request"],
        }),

    }),
});

// Export hooks
export const {
    useGetAllRequestQuery,
    useRequestAcceptCancelMutation,
} = requestApi;
