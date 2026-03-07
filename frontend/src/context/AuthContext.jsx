import { createContext, useContext, useState, useEffect } from "react";
import { MOCK_USERS } from "../Data/mockUsers";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState(MOCK_USERS);
    useEffect(() => {
        const stored = localStorage.getItem("auth_user");
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, []);

    const signIn = (email, password) => {
        const found = users.find(
            (u) => u.email === email && u.password === password
        );
        if (found) {
            const { password: _, ...safeUser } = found;
            setUser(safeUser);
            localStorage.setItem("auth_user", JSON.stringify(safeUser));
            return { success: true };
        }
        return { success: false, error: "Invalid email or password" };
    };

    const signUp = (name, email, phone, password) => {
        const exists = users.find((u) => u.email === email);
        if (exists) {
            return { success: false, error: "Email already registered" };
        }
        const newUser = { id: users.length + 1, name, email, phone, password };
        setUsers((prev) => [...prev, newUser]);
        const { password: _, ...safeUser } = newUser;
        setUser(safeUser);
        localStorage.setItem("auth_user", JSON.stringify(safeUser));
        return { success: true };
    };

    const signOut = () => {
        setUser(null);
        localStorage.removeItem("auth_user");
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signUp, signOut, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
