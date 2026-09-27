"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const data = await apiFetch("/auth/me");
            setUser(data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const logout = async () => {
        try {
            await apiFetch("/auth/logout", {
                method: "POST",
            });

            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error.message);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                logout,
                refreshUser: fetchUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}