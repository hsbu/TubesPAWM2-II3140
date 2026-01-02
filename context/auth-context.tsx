import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, apiClient, getMe } from '../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    signIn: (token: string, user: User) => Promise<void>;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    signIn: async () => { },
    signOut: async () => { },
    refreshUser: async () => { },
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = async () => {
        // Only try to get user if we have a token stored
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) {
            // No token - user is not logged in, this is normal
            setUser(null);
            return;
        }

        try {
            console.log('Refreshing user data...');
            const response = await getMe();
            console.log('getMe response:', response);
            if (response.success) {
                console.log('Updated user data:', response.data);
                setUser(response.data);
            } else {
                console.log('getMe failed:', response);
                setUser(null);
            }
        } catch (error) {
            console.error('Error refreshing user:', error);
            // Token expired or invalid - clear it
            await apiClient.clearAuthToken();
            setUser(null);
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            await refreshUser();
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const signIn = async (token: string, userData: User) => {
        await apiClient.setAuthToken(token);
        // Don't use userData from signin, fetch fresh data from /api/me
        await refreshUser();
    };

    const signOut = async () => {
        await apiClient.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                signIn,
                signOut,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
