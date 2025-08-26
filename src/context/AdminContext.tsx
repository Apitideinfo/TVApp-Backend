import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAuth, adminProfile } from '../services/adminApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Admin {
  id: string;
  username: string;
  admin_id: string;
  email: string;
  created_at: string;
}

interface AdminContextType {
  admin: Admin | null;
  loading: boolean;
  login: (credentials: { admin_id: string; password: string }) => Promise<any>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminSession();
  }, []);

  const checkAdminSession = async () => {
    try {
      const token = await AsyncStorage.getItem('adminToken');
      if (token) {
        const response = await adminProfile.me();
        setAdmin(response.data.admin || null);
      }
    } catch (error) {
      console.error('Session check failed:', error);
      await AsyncStorage.removeItem('adminToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: { admin_id: string; password: string }) => {
    const response = await adminAuth.login(credentials);
    await AsyncStorage.setItem('adminToken', response.data.token);
    setAdmin(response.data.admin);
    return response;
  };

  const logout = () => {
    AsyncStorage.removeItem('adminToken');
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
