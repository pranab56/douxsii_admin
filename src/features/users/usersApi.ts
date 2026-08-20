import { baseApi } from "../../utils/apiBaseQuery";

export interface UserItem {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  isDeleted?: boolean;
  address?: string;
  phone?: string;
  profile?: string;
  isRegistrationFee?: boolean;
  isOnline?: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetAllUsersQueryParams {
  page?: number;
  role?: string;
  status?: string;
  searchTerm?: string;
}

export interface GetAllUsersResponse {
  success: boolean;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data?: {
    result: UserItem[];
    totalUsers?: number;
    activeUsers?: number;
    blockedUsers?: number;
    totalVendor?: number;
    shop?: number;
  };
}

export interface GetSingleUserResponse {
  success: boolean;
  message: string;
  data?: {
    result: UserItem;
    totalOrder?: number;
    totalGiftSend?: number;
    totalGiftReceived?: number;
  };
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<GetAllUsersResponse, GetAllUsersQueryParams>({
      query: ({ role, status, searchTerm, page = 1 }) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page.toString());
        if (role && role !== "All" && role !== "all") params.append("role", role);
        if (status && status !== "All" && status !== "all") params.append("isActive", status);
        if (searchTerm) params.append("searchTerm", searchTerm);

        return {
          url: `/users/all?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["users"],
    }),

    getSingleUsers: builder.query<GetSingleUserResponse, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "GET",
      }),
      providesTags: ["users"],
    }),

    blockUnblockUser: builder.mutation<{ success: boolean; message: string }, string>({
      query: (userId) => ({
        url: `/users/blocked/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetSingleUsersQuery,
  useBlockUnblockUserMutation,
} = usersApi;
