import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/apiClient';
import type { User, LoginResponse } from '../types';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    // Ideally verify token here or fetch user profile
                    // For now we assume token is valid or interceptor will catch 401
                    // const res = await api.get<ApiResponse<{ user: User }>>('/auth/me');
                    // setUser(res.data.data.user);
                } catch (error) {
                    console.error('Auth check failed', error);
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const res = await api.post<LoginResponse>('/auth/login', { email, password });
        const { token, user } = res.data;

        if (user.role !== 'ADMIN') {
            throw new Error('Yetkisiz giriş. Sadece adminler girebilir.');
        }

        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            isAuthenticated: !!token,
            isLoading
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
