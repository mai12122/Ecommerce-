
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const COOKIE_NAME = "auth_token";

const AuthContext = createContext();

const readStoredUser = () => {
    try {
        const stored = localStorage.getItem("auth_user");
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

const persistSession = (payload) => {
    if (payload?.token) {
        localStorage.setItem(COOKIE_NAME, payload.token);
    }
    if (payload) {
        localStorage.setItem("auth_user", JSON.stringify(payload));
    }
};

export const AuthProvider = ({ children }) => {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL || "http://127.0.0.1:8000";
    const [user, setUser] = useState(() => readStoredUser());
    const [token, setToken] = useState(() => localStorage.getItem(COOKIE_NAME));

    const updateProfile = async (updates) => {
        try {
            // If avatar is a File, send multipart/form-data so backend can handle file upload.
            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            let res;
            // Backend expects avatar as a data URL (string starting with data:image/).
            // If a File is provided, convert it to data URL then send JSON PUT.
            if (updates.avatar instanceof File) {
                const fileToDataURL = (file) => new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });

                try {
                    const dataUrl = await fileToDataURL(updates.avatar);
                    headers['Content-Type'] = 'application/json';
                    res = await fetch(`${BASEURL}/api/auth/profile/`, {
                        method: 'PUT',
                        headers,
                        credentials: 'include',
                        body: JSON.stringify({ id: user.id, ...updates, avatar: dataUrl }),
                    });
                } catch (e) {
                    console.error('Failed to convert avatar file to data URL', e);
                    return { success: false, error: 'Failed to process image file' };
                }
            } else {
                headers['Content-Type'] = 'application/json';
                res = await fetch(`${BASEURL}/api/auth/profile/`, {
                    method: 'PUT',
                    headers,
                    credentials: 'include',
                    body: JSON.stringify({ id: user.id, ...updates }),
                });
            }

            let data;
            try {
                data = await res.json();
            } catch {
                const text = await res.text();
                data = { error: text || 'Unexpected response' };
            }

            if (res.ok) {
                const updatedUser = { ...user, ...data };
                if (data.avatar) {
                    updatedUser.avatar = data.avatar.startsWith('http') ? data.avatar : `${BASEURL}${data.avatar}`;
                }
                setUser(updatedUser);
                localStorage.setItem('auth_user', JSON.stringify(updatedUser));
                return { success: true };
            }
            // Provide more detailed error when available
            const errorMsg = data?.error || data?.detail || JSON.stringify(data) || `Status ${res.status}`;
            console.error('updateProfile failed:', res.status, errorMsg);
            return { success: false, error: errorMsg };
        } catch (err) {
            console.error('updateProfile error', err);
            return { success: false, error: 'Network error. Please try again.' };
        }
    };

    const signIn = async (email, password) => {
        try {
            const res = await fetch(`${BASEURL}/api/auth/signin/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                if (data.avatar && !data.avatar.startsWith('http')) {
                    data.avatar = `${BASEURL}${data.avatar}`;
                }
                if (data.token) {
                    localStorage.setItem(COOKIE_NAME, data.token);
                    setToken(data.token);
                }
                persistSession(data);
                setUser(data);
                return { success: true };
            }
            return { success: false, error: data.error || "Invalid email or password" };
        } catch {
            return { success: false, error: "Network error. Please try again." };
        }
    };

    const signInWithGoogle = async (credentialResponse) => {
        try {
            const idToken = credentialResponse?.credential || credentialResponse?.id_token;
            const res = await fetch(`${BASEURL}/api/auth/google/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ id_token: idToken }),
            });
            const data = await res.json();
            if (res.ok) {
                if (data.avatar && !data.avatar.startsWith('http')) {
                    data.avatar = `${BASEURL}${data.avatar}`;
                }
                if (data.token) {
                    localStorage.setItem(COOKIE_NAME, data.token);
                    setToken(data.token);
                }
                persistSession(data);
                setUser(data);
                return { success: true };
            }
            return { success: false, error: data.error || "Google sign-in failed" };
        } catch {
            return { success: false, error: "Network error. Please try again." };
        }
    };

    const signUp = async (name, email, phone, password) => {
        try {
            const res = await fetch(`${BASEURL}/api/auth/signup/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name, email, phone, password }),
            });
            const data = await res.json();
            if (res.ok) {
                if (data.avatar && !data.avatar.startsWith('http')) {
                    data.avatar = `${BASEURL}${data.avatar}`;
                }
                if (data.token) {
                    localStorage.setItem(COOKIE_NAME, data.token);
                    setToken(data.token);
                }
                persistSession(data);
                setUser(data);
                return { success: true };
            }
            // Handle validation errors from backend
            let errorMsg = "Registration failed";
            if (data.errors) {
                // Backend returns {'errors': serializer.errors} with field errors
                const errors = data.errors;
                if (errors.email) errorMsg = errors.email[0];
                else if (errors.name) errorMsg = errors.name[0];
                else if (errors.password) errorMsg = errors.password[0];
                else if (errors.phone) errorMsg = errors.phone[0];
                else errorMsg = JSON.stringify(errors);
            } else if (data.error) {
                errorMsg = data.error;
            }
            console.error('Signup error:', data);
            return { success: false, error: errorMsg };
        } catch {
            return { success: false, error: "Network error. Please try again." };
        }
    };

    const signOut = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("auth_user");
        localStorage.removeItem(COOKIE_NAME);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token,
            signIn,
            signInWithGoogle,
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