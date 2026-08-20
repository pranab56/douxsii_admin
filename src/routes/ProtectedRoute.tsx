import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import { getToken } from '../utils/storage';
import { getFromLocalStorage } from '../utils/localStorage';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const tokenFromRedux = useAppSelector((state) => state.auth.token);
  const tokenFromStorage = getToken() || getFromLocalStorage('accessToken');

  const token = tokenFromRedux || tokenFromStorage;

  if (!token) {
    // Redirect unauthenticated user to /login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
