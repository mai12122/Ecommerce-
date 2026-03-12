
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

    const updateProfile = async (updates) => {
        try {
            const res = await fetch(`${BASEURL}/api/auth/profile/`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: user.id, ...updates }),
            });
            const data = await res.json();
            if (res.ok) {
                const updatedUser = { ...user, ...data };
                if (data.avatar) {
                    updatedUser.avatar = data.avatar.startsWith('http') ? data.avatar : `${BASEURL}${data.avatar}`;
                }
                setUser(updatedUser);
                localStorage.setItem("auth_user", JSON.stringify(updatedUser));
                return { success: true };
            }
            return { success: false, error: data.error || "Update failed" };
        } catch {
            return { success: false, error: "Network error. Please try again." };
        }
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
                if (data.avatar && !data.avatar.startsWith('http')) {
                    data.avatar = `${BASEURL}${data.avatar}`;
                }
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
                if (data.avatar && !data.avatar.startsWith('http')) {
                    data.avatar = `${BASEURL}${data.avatar}`;
                }
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