import { baseApi } from "../../utils/apiBaseQuery";

export interface ProductShop {
    _id: string;
    name: string;
}

export interface ProductUser {
    _id: string;
    profile?: string;
    fullName: string;
    email: string;
}

export interface ProductItem {
    _id: string;
    shopId?: ProductShop;
    userId?: ProductUser;
    name: string;
    description?: string;
    type?: string;
    categoryName?: string;
    price: number;
    mainPrice?: number;
    discount?: number;
    stock?: number;
    availableStock?: number;
    deliveryTime?: string;
    images?: string[];
    isAvailableForSale?: boolean;
    isGiftWrappingFree?: boolean;
    weight?: number;
    length?: number;
    height?: number;
    width?: number;
    rating?: number;
    reviewCount?: number;
    isFavorite?: boolean;
}

export interface ProductMeta {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
}

export interface GetAllProductResponse {
    success: boolean;
    message: string;
    meta?: ProductMeta;
    data: ProductItem[];
}

export interface SingleProductResponse {
    success: boolean;
    message: string;
    data: ProductItem;
}

export interface GetAllProductParams {
    searchTerm?: string;
    page?: number;
}

export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllProduct: builder.query<GetAllProductResponse, GetAllProductParams | void>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params?.page) queryParams.append("page", params.page.toString());
                if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
                const queryString = queryParams.toString();
                return {
                    url: `/product/user${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["product"],
        }),

        getSingleProduct: builder.query<SingleProductResponse, string | { productId: string }>({
            query: (arg) => {
                const productId = typeof arg === "string" ? arg : arg?.productId;
                return {
                    url: `/product/${productId}`,
                    method: "GET",
                };
            },
            providesTags: ["product"],
        }),

        createProduct: builder.mutation<SingleProductResponse, FormData>({
            query: (data) => ({
                url: `/product/create`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["product"],
        }),

        updateProduct: builder.mutation<SingleProductResponse, { productId: string; data: FormData | Record<string, any> }>({
            query: ({ productId, data }) => ({
                url: `/product/${productId}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["product"],
        }),

        deleteProduct: builder.mutation<{ success: boolean; message: string }, string>({
            query: (productId) => ({
                url: `/product/${productId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["product"],
        }),
    }),
});

// Export hooks
export const {
    useGetAllProductQuery,
    useGetSingleProductQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation
} = productApi;

