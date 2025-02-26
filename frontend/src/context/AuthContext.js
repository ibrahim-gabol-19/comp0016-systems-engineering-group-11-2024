import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = process.env.REACT_APP_API_URL;

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        token: null,
        user: null, // 
    });

    // Fetch user details if a token exists
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`${API_URL}api/auth/user/`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                setAuth({
                    isAuthenticated: true,
                    token,
                    user: response.data,  
                });
            })
            .catch(() => {
                localStorage.removeItem('token'); // Clear token if request fails
                setAuth({ isAuthenticated: false, token: null, user: null });
            });
        }
    }, []);

    // Login function - stores token and fetches user data
    const login = async (token) => {
        localStorage.setItem('token', token);
        try {
            const response = await axios.get(`${API_URL}api/auth/user/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("User Data After Login:", response.data);
            setAuth({
                isAuthenticated: true,
                token,
                user: response.data,  // 
            });
        } catch (error) {
            console.error("Failed to fetch user data", error);
        }
    };
    // Logout function - clears token and user info
    const logout = () => {
        localStorage.removeItem('token');
        setAuth({ isAuthenticated: false, token: null, user: null });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
