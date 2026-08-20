import { baseApi } from "../../utils/apiBaseQuery";

export interface ProductShopInfo {
    _id: string;
    name: string;
}

export interface ProductUserInfo {
    _id: string;
    profile?: string;
    fullName: string;
    email: string;
}

export interface ProductItem {
    _id: string;
    name: string;
    description?: string;
    type?: string;
    categoryName?: string;
    price: number;
    discount?: number;
    stock?: number;
    availableStock?: number;
    images?: string[];
    rating?: number;
    reviewCount?: number;
    deliveryTime?: string;
    isAvailableForSale?: boolean;
    isGiftWrappingFree?: boolean;
    weight?: number;
    length?: number;
    height?: number;
    width?: number;
    shopId?: ProductShopInfo;
    userId?: ProductUserInfo;
}

export interface GetAllProductResponse {
    success: boolean;
    message: string;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    };
    data?: ProductItem[];
}

export interface SingleProductResponse {
    success: boolean;
    message: string;
    data?: ProductItem;
}

export interface GetAllProductParams {
    searchTerm?: string;
    page?: number;
    type?: string;
}

export const productsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllProduct: builder.query<GetAllProductResponse, GetAllProductParams | void>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params?.page) queryParams.append("page", params.page.toString());
                if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
                if (params?.type && params.type !== "All" && params.type !== "all") {
                    queryParams.append("type", params.type);
                }

                const queryString = queryParams.toString();
                return {
                    url: `/product/all${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["product"],
        }),

        singleGetProduct: builder.query<SingleProductResponse, string | { productId: string }>({
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

export const {
    useGetAllProductQuery,
    useSingleGetProductQuery,
} = productsApi;
