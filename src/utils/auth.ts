import { getToken, removeToken } from './storage';
import { removeFromLocalStorage } from './localStorage';

export interface DecodedTokenPayload {
  exp?: number;
  role?: string;
  id?: string;
  userId?: string;
  email?: string;
  [key: string]: unknown;
}

/**
 * Safely decodes a JWT token without external libraries
 */
export const decodeJwt = (token: string): DecodedTokenPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload) as DecodedTokenPayload;
  } catch {
    return null;
  }
};

/**
 * Checks if a token exists, is well-formed, and is not expired
 */
export const isTokenValid = (token: string | null | undefined): boolean => {
  if (!token || typeof token !== 'string') {
    return false;
  }

  const cleanToken = token.trim();
  if (
    cleanToken === '' ||
    cleanToken === 'undefined' ||
    cleanToken === 'null' ||
    cleanToken === '[object Object]'
  ) {
    return false;
  }

  const decoded = decodeJwt(cleanToken);
  if (!decoded) {
    return false;
  }

  // Check expiration if exp field exists
  if (typeof decoded.exp === 'number') {
    const isExpired = decoded.exp * 1000 <= Date.now();
    if (isExpired) {
      return false;
    }
  }

  return true;
};

/**
 * Completely clears all authentication state from storage and cookies
 */
export const clearAuthSession = () => {
  try {
    removeToken();
    removeFromLocalStorage('accessToken');
    removeFromLocalStorage('userData');
    removeFromLocalStorage('role');
    removeFromLocalStorage('permissions');
    removeFromLocalStorage('forgetToken');
  } catch (err) {
    console.error('Error clearing auth session:', err);
  }
};

/**
 * Gets a strictly valid token, or null if missing/expired
 */
export const getValidAuthToken = (): string | null => {
  const token = getToken();
  if (!token || !isTokenValid(token)) {
    if (token) {
      clearAuthSession();
    }
    return null;
  }
  return token;
};
