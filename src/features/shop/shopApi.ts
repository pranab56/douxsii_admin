import { baseApi } from "../../utils/apiBaseQuery";

export const shopApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        createShop: builder.mutation({
            query: (data) => {
                return {
                    url: `/shop/create`,
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["shop", "profile"]
        }),

        updateShop: builder.mutation({
            query: ({ shopId, data }) => {
                return {
                    url: `/shop/${shopId}`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["shop", "profile"]
        }),


        getAllOrderForAdmin: builder.query({
            query: () => {
                return {
                    url: `/order?page=1`,
                    method: "GET",
                };
            },
            providesTags: ["shop"]
        }),

        getAllProductForAdmin: builder.query({
            query: ({ shopId, page }) => {
                return {
                    url: `/shop/product?shopId=${shopId}&page=${page}`,
                    method: "GET",
                };
            },
            providesTags: ["shop"]
        }),

    }),
});

// Export hooks
export const {
    useCreateShopMutation,
    useUpdateShopMutation,
    useGetAllOrderForAdminQuery,
    useGetAllProductForAdminQuery
} = shopApi;

