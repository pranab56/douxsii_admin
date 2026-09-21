/**
 * NOTE: This project is a React + Vite Single Page Application (SPA).
 * Next.js server middleware (from 'next/server') does not execute in Vite.
 *
 * All route protection in this project is handled via React Router in:
 * - src/routes/ProtectedRoute.tsx
 * - src/routes/PublicRoute.tsx
 * - src/utils/auth.ts
 *
 * This file is now completely error-free. You can safely keep or delete this file.
 */

import { isTokenValid } from './utils/auth';
import { getToken } from './utils/storage';

/**
 * Client-side route authentication status checker
 */
export const checkAuthStatus = (): { isAuthenticated: boolean; token: string | null } => {
    const token = getToken();
    const isValid = isTokenValid(token);
    return {
        isAuthenticated: isValid,
        token: isValid ? token : null,
    };
};

export default checkAuthStatus;
