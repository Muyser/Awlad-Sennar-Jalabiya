import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkUserAuth();
  }, []);

  const getAuthToken = () => {
    return (
      localStorage.getItem("admin_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken")
    );
  };

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      const token = getAuthToken();

      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoadingAuth(false);
        setAuthChecked(true);
        return;
      }

      // التحقق من صلاحية التوكن عبر الـ Backend على Render
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.data || data.user);
        setIsAuthenticated(true);
      } else {
        // إذا كان التوكن غير منتهي الصلاحية ولكن هناك استجابة، أو تم رفضه
        localStorage.removeItem("admin_token");
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('User auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("admin_token");
    localStorage.removeItem("token");
    
    if (shouldRedirect) {
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      authChecked,
      logout,
      checkUserAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};