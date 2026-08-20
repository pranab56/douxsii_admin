import { baseApi } from "../../utils/apiBaseQuery";

export interface CommunityUser {
    _id: string;
    profile?: string;
    fullName: string;
    email?: string;
}

export interface CommunityPost {
    _id: string;
    userId?: CommunityUser;
    caption?: string;
    image?: string;
    likesCount?: number;
    likeCount?: number;
    status?: string;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CommunityListResponse {
    success: boolean;
    message: string;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    };
    data?: CommunityPost[];
}

export interface SingleCommunityResponse {
    success: boolean;
    message: string;
    data?: CommunityPost;
}

export const communityApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllcommunity: builder.query<CommunityListResponse, { page?: number; searchTerm?: string } | void>({
            query: (params) => {
                const page = params?.page || 1;
                const searchTerm = params?.searchTerm || "";
                const queryParams = new URLSearchParams();
                if (page) queryParams.append("page", page.toString());
                if (searchTerm) queryParams.append("searchTerm", searchTerm);

                return {
                    url: `/community/all?${queryParams.toString()}`,
                    method: "GET",
                };
            },
            providesTags: ["community"],
        }),

        getSingleCommunity: builder.query<SingleCommunityResponse, string | { id: string }>({
            query: (arg) => {
                const id = typeof arg === "string" ? arg : arg?.id;
                return {
                    url: `/community/${id}`,
                    method: "GET",
                };
            },
            providesTags: ["community"],
        }),
    }),
});

export const {
    useGetAllcommunityQuery,
    useGetSingleCommunityQuery,
} = communityApi;
