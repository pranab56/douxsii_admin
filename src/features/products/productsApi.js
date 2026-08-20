import { baseApi } from "../../utils/apiBaseQuery";

export const productsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllProduct: builder.query({
            query: ({ searchTerm = '', page = 1 } = {}) => {
                const params = new URLSearchParams();
                if (page) params.append("page", page.toString());
                if (searchTerm) params.append("searchTerm", searchTerm);
                const queryString = params.toString();
                return {
                    url: `/product/all${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["product"],
        }),

        singleGetProduct: builder.query({
            query: (arg) => {
                const productId = typeof arg === "string" ? arg : arg?.productId;
                return {
                    url: `/product/${productId}`,
                    method: "GET",
                };
            },
            providesTags: ["product"],
        }),
    }),
});

// Export hooks
export const {
    useGetAllProductQuery,
    useSingleGetProductQuery
} = productsApi;
