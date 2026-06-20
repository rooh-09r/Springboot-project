import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.role && !parsedUser.role.startsWith('ROLE_')) {
          parsedUser.role = `ROLE_${parsedUser.role}`;
        }
        setUser(parsedUser);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await authService.login(credentials);
    const data = response.data;
    let userRole = data.role;
    if (userRole && !userRole.startsWith('ROLE_')) {
      userRole = `ROLE_${userRole}`;
    }
    const userData = {
      id: data.userId,
      email: data.email,
      role: userRole,
    };
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(data.accessToken);
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (data) => {
    const response = await authService.register(data);
    return response.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isUser = user?.role === 'ROLE_USER';

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, isAdmin, isUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
