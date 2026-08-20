import { baseApi } from "../../utils/apiBaseQuery";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    userData: {
      _id: string;
      fullName: string;
      email: string;
      role: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
    forgetToken: string;
  };
}

export interface VerifyOtpRequest {
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
  };
}

export interface ResetPasswordRequest {
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  data: Record<string, unknown>;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Send Forgot Password OTP
    forgotEmail: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: (forgotEmail) => ({
        url: "/auth/forgot-password-otp",
        method: "POST",
        body: forgotEmail,
      }),
    }),

    // Verify OTP
    forgotEmailOTPCheck: builder.mutation<
      VerifyOtpResponse,
      { token?: string | null; data: VerifyOtpRequest }
    >({
      query: ({ token, data }) => ({
        url: "/users/verify-otp",
        method: "POST",
        headers: token ? { token } : undefined,
        body: data,
      }),
    }),

    // Resend OTP
    resendPassword: builder.mutation<
      ForgotPasswordResponse,
      { token?: string | null; data: { email: string } }
    >({
      query: ({ token, data }) => ({
        url: "/auth/resend-otp",
        method: "POST",
        headers: token ? { token } : undefined,
        body: data,
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation<
      ResetPasswordResponse,
      { token?: string | null; data: ResetPasswordRequest }
    >({
      query: ({ token, data }) => ({
        url: "/auth/forgot-password-reset",
        method: "PATCH",
        headers: token ? { token } : undefined,
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotEmailMutation,
  useForgotEmailOTPCheckMutation,
  useResetPasswordMutation,
  useResendPasswordMutation,
} = authApi;
