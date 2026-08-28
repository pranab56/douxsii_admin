import { baseApi } from "../../utils/apiBaseQuery";

export interface CategoryItem {
    _id: string;
    name: string;
    image?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CategoryApiResponse {
    success: boolean;
    message: string;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    };
    data: CategoryItem[];
}

export interface SingleCategoryApiResponse {
    success: boolean;
    message: string;
    data: CategoryItem;
}

export const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllCategory: builder.query<CategoryApiResponse, { page?: number; limit?: number; searchTerm?: string } | number | void>({
            query: (arg) => {
                let pageNumber = 1;
                let searchTerm = '';
                if (typeof arg === 'number') {
                    pageNumber = arg;
                } else if (arg && typeof arg === 'object') {
                    pageNumber = arg.page || 1;
                    searchTerm = arg.searchTerm || '';
                }
                let url = `/category?page=${pageNumber}`;
                if (searchTerm) {
                    url += `&searchTerm=${encodeURIComponent(searchTerm)}`;
                }
                return {
                    url,
                    method: "GET",
                };
            },
            providesTags: ["category"],
        }),

        getSingleCategory: builder.query<SingleCategoryApiResponse, string>({
            query: (id) => {
                return {
                    url: `/category/${id}`,
                    method: "GET",
                };
            },
            providesTags: ["category"],
        }),

        createCategory: builder.mutation<SingleCategoryApiResponse, { name: string } | FormData>({
            query: (data) => {
                return {
                    url: `/category/create`,
                    method: "POST",
                    body: data
                };
            },
            invalidatesTags: ["category"],
        }),

        updateCategory: builder.mutation<SingleCategoryApiResponse, { id: string; data: { name: string } | FormData }>({
            query: ({ id, data }) => {
                return {
                    url: `/category/${id}`,
                    method: "PATCH",
                    body: data
                };
            },
            invalidatesTags: ["category"],
        }),

        deleteCategory: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => {
                return {
                    url: `/category/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["category"],
        }),
    }),
});

// Export hooks
export const {
    useGetAllCategoryQuery,
    useGetSingleCategoryQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi;
