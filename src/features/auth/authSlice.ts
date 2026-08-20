import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getToken, removeToken, saveToken } from "../../utils/storage";

export interface AuthState {
  token: string | null;
  role: string | null;
  permissions: string[];
  permissionsReady: boolean;
}

const getStoredRole = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("role") || null;
};

const getStoredPermissions = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("permissions") || "[]");
  } catch {
    return [];
  }
};

const getPermissionsReady = (): boolean => {
  if (typeof window === "undefined") return false;
  const role = localStorage.getItem("role");
  if (!role) return false;
  if (role === "super_admin") return true;
  return localStorage.getItem("permissions") !== null;
};

const initialState: AuthState = {
  token: typeof window !== "undefined" ? getToken() : null,
  role: getStoredRole(),
  permissions: getStoredPermissions(),
  permissionsReady: getPermissionsReady(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      saveToken(action.payload);
    },
    setPermissions: (state, action: PayloadAction<string[]>) => {
      state.permissions = action.payload;
      localStorage.setItem("permissions", JSON.stringify(action.payload));
    },
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
      localStorage.setItem("role", action.payload);
    },
    setPermissionsReady: (state, action: PayloadAction<boolean>) => {
      state.permissionsReady = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.permissions = [];
      state.permissionsReady = false;
      removeToken();
      localStorage.removeItem("role");
      localStorage.removeItem("permissions");
    },
  },
});

export const { setToken, setPermissions, setRole, setPermissionsReady, logout } = authSlice.actions;
export default authSlice.reducer;
