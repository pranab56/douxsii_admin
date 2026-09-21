import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getToken } from '../utils/storage';
import { getFromLocalStorage } from '../utils/localStorage';
import { isTokenValid, clearAuthSession } from '../utils/auth';
import { logout } from '../features/auth/authSlice';

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const dispatch = useAppDispatch();
  const tokenFromRedux = useAppSelector((state) => state.auth.token);
  const tokenFromStorage = getToken() || getFromLocalStorage('accessToken');

  const token = tokenFromRedux || tokenFromStorage;
  const isValid = isTokenValid(token);

  if (isValid) {
    // If user is already legitimately logged in, redirect to dashboard
    return <Navigate to="/" replace />;
  }

  // If token is invalid or expired, clean it up
  if (token && !isValid) {
    dispatch(logout());
    clearAuthSession();
  }

  return <>{children}</>;
};

export default PublicRoute;
