import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        token: null,
    });

    // Check localStorage for token on initial load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuth({ isAuthenticated: true, token });
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token); // Store token in localStorage
        setAuth({ isAuthenticated: true, token });
    };

    const logout = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        setAuth({ isAuthenticated: false, token: null });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};