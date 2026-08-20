import { baseApi } from "../../utils/apiBaseQuery";

export interface SupportMember {
    _id: string;
    profile?: string;
    fullName: string;
    email: string;
    role: string;
    isActive?: boolean;
    isDeleted?: boolean;
    address?: string;
    phone?: string;
    isOnline?: boolean;
    agentStatus?: string;
    rating?: number;
    ratings?: number;
    reviewCount?: number;
    isVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface SupportTeamResponse {
    success: boolean;
    message: string;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    };
    data?: SupportMember[];
}

export interface CreateSupportMemberPayload {
    fullName: string;
    email: string;
    role: 'support_manager' | 'support_agent' | string;
    password: string;
    phone: string;
}

export const supportApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllSupportMembers: builder.query<SupportTeamResponse, { page?: number; limit?: number; search?: string } | void>({
            query: (params) => {
                const page = params?.page || 1;
                const limit = params?.limit || 10;
                const search = params?.search || '';
                let url = `/support-team?page=${page}&limit=${limit}`;
                if (search) {
                    url += `&searchTerm=${encodeURIComponent(search)}`;
                }
                return {
                    url,
                    method: "GET",
                };
            },
            providesTags: ["users"],
        }),

        getSingleSupportMember: builder.query<{ success: boolean; data: SupportMember }, string>({
            query: (id) => ({
                url: `/support-team/${id}`,
                method: "GET",
            }),
            providesTags: ["users"],
        }),

        createSupportMember: builder.mutation<{ success: boolean; message: string }, CreateSupportMemberPayload>({
            query: (data) => ({
                url: `/support-team/create`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["users"],
        }),

        updateSupportMember: builder.mutation<{ success: boolean; message: string }, { id: string; data: Partial<CreateSupportMemberPayload> }>({
            query: ({ id, data }) => ({
                url: `/support-team/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["users"],
        }),

        deleteSupportMember: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/support-team/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["users"],
        }),
    }),
});

export const {
    useGetAllSupportMembersQuery,
    useGetSingleSupportMemberQuery,
    useCreateSupportMemberMutation,
    useUpdateSupportMemberMutation,
    useDeleteSupportMemberMutation,
} = supportApi;
