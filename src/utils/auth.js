import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Provjera podataka o korisniku u local storage
    const storedUser = localStorage.getItem('user');
    
    if (!storedUser) {
      return null;  // Nema korisnika u local storage
    }
    
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return null;
    }
  });

  const navigate = useNavigate();

  // Registruj korisnika i sačuvaj podatke u local storage
  const register = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/');  // Nakon uspješne registracije otvori stranicu Dashboard
    }
  };

  // Provjera podataka o korisniku u local storage-u, ako nema korisnika otvori stranicu Register 
  const login = (userData) => {
    if (!userData) {
      navigate('/register');  // Ako ne postoje podaci o korisniku otvori stranicu Register
      return;
    }

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/');  // Na uspješni login otvori stranicu Dashboard
  };

  // Logout korisnika i uklanjanje podataka iz local storage-a
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');  // Nakon logout-a prikaži Login stranicu
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
