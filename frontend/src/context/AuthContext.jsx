
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const [user, setUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem("auth_user");
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, []);

    const updateProfile = (updates) => {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem("auth_user", JSON.stringify(updatedUser));
        return { success: true };
    };

    const signIn = async (email, password) => {
        try {
            const res = await fetch(`${BASEURL}/api/auth/signin/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data);
                localStorage.setItem("auth_user", JSON.stringify(data));
                return { success: true };
            }
            return { success: false, error: data.error || "Invalid email or password" };
        } catch {
            return { success: false, error: "Network error. Please try again." };
        }
    };

    const signUp = async (name, email, phone, password) => {
        try {
            const res = await fetch(`${BASEURL}/api/auth/signup/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone, password }),
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data);
                localStorage.setItem("auth_user", JSON.stringify(data));
                return { success: true };
            }
            return { success: false, error: data.error || "Registration failed" };
        } catch {
            return { success: false, error: "Network error. Please try again." };
        }
    };

    const signOut = () => {
        setUser(null);
        localStorage.removeItem("auth_user");
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            signIn, 
            signUp, 
            signOut, 
            updateProfile,  
            isAuthenticated: !!user 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);