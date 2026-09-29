import { baseApi } from "../../utils/apiBaseQuery";

export interface ShopInfo {
    _id: string;
    name: string;
    description?: string;
    website?: string;
    phone?: string;
    tradeLicense?: string;
    image?: string;
    businessName?: string;
    address?: string;
    latitude?: number | string;
    longitude?: number | string;
    workingHours?: string;
}

export interface ProfileData {
    _id: string;
    profile?: string;
    fullName: string;
    email: string;
    role: string;
    isActive?: boolean;
    isDeleted?: boolean;
    address?: string;
    phone?: string;
    dateOfBirth?: string;
    isOnline?: boolean;
    rating?: number;
    reviewCount?: number;
    isStripeConnectedAccount?: boolean;
    isRegistrationFee?: boolean;
    createdAt?: string;
    updatedAt?: string;
    shopId?: ShopInfo | null;
};

export interface GetProfileResponse {
    success: boolean;
    message: string;
    data?: {
        result?: ProfileData;
    };
}

export interface UpdateProfileResponse {
    success: boolean;
    message: string;
    data?: ProfileData;
}

export interface ChangePasswordPayload {
    oldPassword: string;
    newPassword: string;
}

export interface ChangePasswordResponse {
    success: boolean;
    message: string;
}

export const profileApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getMyProfile: builder.query<GetProfileResponse, void>({
            query: () => {
                return {
                    url: `/users/my-profile`,
                    method: "GET",
                };
            },
            providesTags: ["profile"],
        }),


        updateProfile: builder.mutation<UpdateProfileResponse, FormData | Partial<ProfileData>>({
            query: (data) => {
                return {
                    url: `/users/update-my-profile`,
                    method: "PATCH",
                    body: data,
                };
            },
            invalidatesTags: ["profile"],
        }),


        changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordPayload>({
            query: (data) => {
                return {
                    url: `/auth/change-password`,
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["profile"],
        }), 
    }),
});

export const {
    useGetMyProfileQuery,
    useUpdateProfileMutation,
    useChangePasswordMutation,
} = profileApi;
