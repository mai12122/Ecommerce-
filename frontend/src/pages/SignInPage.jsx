import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GenZLogo from "../assets/GenZlogo.png";

function SignInPage() {
    const navigate = useNavigate();
    const { signIn, signInWithGoogle } = useAuth();
    const googleButtonRef = useRef(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    useEffect(() => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
        if (!clientId) return;

        const initializeButton = () => {
            if (!window.google?.accounts?.id || !googleButtonRef.current) return;
            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: async (response) => {
                    const result = await signInWithGoogle(response);
                    if (result.success) {
                        try { localStorage.setItem('show_modal_after_signin', '1'); } catch (storageError) { console.warn('Unable to persist signin flag', storageError); }
                        navigate("/", { state: { showSigninSuccess: true } });
                    } else {
                        console.warn('Google sign-in failed', result.error);
                    }
                },
            });
            window.google.accounts.id.renderButton(googleButtonRef.current, {
                theme: 'filled_black',
                size: 'large',
                width: '100%',
                text: 'signin_with',
                shape: 'rectangular',
            });
        };

        const existingScript = document.getElementById("google-identity-script");
        if (window.google?.accounts?.id) {
            initializeButton();
            return;
        }
        if (existingScript) {
            return;
        }

        const script = document.createElement("script");
        script.id = "google-identity-script";
        script.src = "https://accounts.google.com/gsi/client";
        // Add SRI and crossorigin for improved integrity checks
        script.integrity = "sha384-sw9AdhzJakPBlzCOAMGXgznOau2Nk8CMVVbcddTnxcB4GQThKcr2NOFplN4IxBqa";
        script.crossOrigin = "anonymous";
        script.async = true;
        script.defer = true;
        script.onload = initializeButton;
        document.body.appendChild(script);
    }, [navigate, signInWithGoogle]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const result = await signIn(email, password);
        setLoading(false);
        if (result.success) {
                try { localStorage.setItem('show_modal_after_signin', '1'); } catch (storageError) { console.warn('Unable to persist signin flag', storageError); }
                navigate("/", { state: { showSigninSuccess: true } });
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen bg-[#2B3D5F] flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Gradient Orbs */}
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl" />
                
                {/* Mesh Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20" />
                
                {/* Animated Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo Section - Untouched */}
                <div className="text-center mb-8 animate-fade-in-down">
                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-purple-500/20">
                        <img src={GenZLogo} alt="GenZ" className="h-20 w-auto" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-blue-300 text-sm">Sign in to continue to GenZ</p>
                </div>

                {/* Sign In Card */}
                <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl shadow-black/50 transform transition-all duration-500 hover:shadow-purple-500/10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div className="group">
                            <label htmlFor="email" className="text-sm text-blue-200 mb-2 block font-medium transition-colors group-focus-within:text-purple-300">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${focusedField === 'email' ? 'text-purple-400 scale-110' : 'text-blue-300'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="you@example.com"
                                    className={`w-full bg-[#1a2744]/50 text-white placeholder-blue-400/50 rounded-xl py-4 pl-12 pr-4 outline-none border-2 transition-all duration-300 ${focusedField === 'email' ? 'border-purple-500 shadow-lg shadow-purple-500/20 bg-[#1a2744]' : 'border-white/10 hover:border-white/20'}`}
                                    required
                                />
                                {/* Animated underline */}
                                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 ${focusedField === 'email' ? 'w-full' : 'w-0'}`} />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="group">
                            <label htmlFor="password" className="text-sm text-blue-200 mb-2 block font-medium transition-colors group-focus-within:text-purple-300">
                                Password
                            </label>
                            <div className="relative">
                                <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${focusedField === 'password' ? 'text-purple-400 scale-110' : 'text-blue-300'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </span>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Enter your password"
                                    className={`w-full bg-[#1a2744]/50 text-white placeholder-blue-400/50 rounded-xl py-4 pl-12 pr-12 outline-none border-2 transition-all duration-300 ${focusedField === 'password' ? 'border-purple-500 shadow-lg shadow-purple-500/20 bg-[#1a2744]' : 'border-white/10 hover:border-white/20'}`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-purple-400 transition-all duration-300 hover:scale-110"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        {showPassword ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.99 7.99m3.889 1.888L14.12 14.12m0 0l2.829 2.829M3 3l18 18" />
                                        )}
                                    </svg>
                                </button>
                                {/* Animated underline */}
                                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 ${focusedField === 'password' ? 'w-full' : 'w-0'}`} />
                            </div>
                            <div className="text-right mt-2">
                                <Link to="/forgot-password" className="text-sm text-blue-300 hover:text-purple-400 transition-all duration-300 hover:translate-x-1 inline-block">
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 animate-shake">
                                <p className="text-red-300 text-sm text-center flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {error}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 text-white py-4 rounded-xl text-base font-semibold hover:from-purple-700 hover:via-purple-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing In...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </span>
                            {/* Shine effect */}
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-[#2B3D5F]/50 backdrop-blur-sm text-blue-300 rounded-full border border-white/10">Or continue with</span>
                        </div>
                    </div>

                    <div ref={googleButtonRef} className="w-full flex justify-center [&>div]:w-full [&>div]:!rounded-xl [&>div]:!overflow-hidden" />
                </div>

                <div className="text-center mt-8">
                    <p className="text-blue-300 text-sm">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-white font-semibold hover:text-purple-400 transition-all duration-300 hover:underline underline-offset-4 decoration-purple-500">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>

            {/* Custom Styles for Animations */}
            <style>{`
                @keyframes fade-in-down {
                    0% {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.6s ease-out;
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
                .delay-1000 {
                    animation-delay: 1s;
                }
            `}</style>
        </div>
    );
}

export default SignInPage;