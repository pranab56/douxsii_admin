import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFromLocalStorage } from '../utils/localStorage';

export type User = {
  email: string;
  image: string;
  name: string;
  role: string; 
  status: "active" | "inactive"; 
};

export const UserContext = createContext<User | undefined>(undefined);

export const DUMMY_USER: User = {
  email: "admin@douxsii.com",
  image: "/user.svg",
  name: "Mithila Admin",
  role: "SUPER_ADMIN",
  status: "active"
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const token = getFromLocalStorage("accessToken");
    if (token) {
      const localUserStr = getFromLocalStorage("userData");
      if (localUserStr) {
        try {
          setUser(JSON.parse(localUserStr));
        } catch {
          setUser(DUMMY_USER);
        }
      } else {
        setUser(DUMMY_USER);
      }
    } else {
      setUser(undefined);
    }
  }, []);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
