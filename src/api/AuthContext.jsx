import React, { createContext, useContext, useEffect, useState } from 'react';
import api from './axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const response = await api.get('/auth/me');
                setUser(response.data.data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        setUser(response.data.data);
        return response.data.data;
    };

    const register = async (name, email, password, passwordConfirmation) => {
        const response = await api.post('/auth/register', {
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
        });
        setUser(response.data.data);
        return response.data.data;
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
