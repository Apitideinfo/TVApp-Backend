import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'worker' | 'client' | 'admin' | null;

interface UserData {
  id?: number;
  name?: string;
  email?: string;
  admin_id?: string;
  username?: string;
}

interface UserContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (authenticated: boolean) => void;
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
  authToken: string | null;
  setAuthToken: (token: string | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const logout = () => {
    setUserRole(null);
    setIsAuthenticated(false);
    setUserData(null);
    setAuthToken(null);
  };

  const value = {
    userRole,
    setUserRole,
    isAuthenticated,
    setIsAuthenticated,
    userData,
    setUserData,
    authToken,
    setAuthToken,
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 