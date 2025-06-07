import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

export interface User {
  id: string;
  email: string;
  fullName: string;
  greenPoints: number;
  avatar?: string;
  registeredEvents: string[];
  attendedEvents: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, fullName: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await axios.post('http://192.168.1.13:5000/api/Auth/login', {
        email,
        password,
      });

      // Axios response data is already parsed JSON
      const data = res.data.data; // Adjust if your backend response shape differs

      console.log(data);

      const newUser: User = {
        id: data._id,                // Note underscore for MongoDB id
        email: data.email,
        fullName: data.fullName,
        greenPoints: data.greenPoints || 0,
        registeredEvents: data.registeredEvents || [],
        attendedEvents: data.attendedEvents || [],
        avatar: data.avatarUrl || undefined,
      };

      setUser(newUser);
      return true;

    } catch (err: any) {
      // err.response holds axios error response
      console.error('Login error:', err.response?.data?.message || err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };



  const register = async (email: string, password: string, fullName: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await axios.post('http://192.168.1.13:5000/api/Auth/signUp', {
        email,
        password,
        fullName,
      });

      const resData = await res;
      const userData = resData.data.data;

      const newUser: User = {
        id: userData._id,
        email: userData.email,
        fullName: userData.fullName,
        greenPoints: userData.greenPoints || 0,
        registeredEvents: userData.registeredEvents || [],
        attendedEvents: userData.attendedEvents || [],
        avatar: userData.avatarUrl || undefined,
      };

      setUser(newUser);
      return true;
    } catch (err: any) {
      console.error('Registration error:', {
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };


  const logout = () => {
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
      <AuthContext.Provider value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}>
        {children}
      </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}