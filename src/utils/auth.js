import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (!storedUser || !storedToken) return null;

      return { ...JSON.parse(storedUser), token: storedToken };
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return null;
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', user.token);
    }
  }, [user]);

  const register = (userData, token) => {
    if (userData && token) {
      setUser({ ...userData, token });
      navigate('/login'); // Preusmjerava se na login stranicu
    }
  };

  const login = (userData, token) => {
    if (!userData || !token) {
      navigate('/register');  // Ako podaci nisu validni preusmjerava se na register stranicu
      return;
    }
    setUser({ ...userData, token });
    navigate('/'); // Preusmjerava se na dashboard stranicu
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login'); // Preusmjerava se na login stranicu
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
