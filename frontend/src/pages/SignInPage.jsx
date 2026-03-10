import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GenZLogo from "../assets/GenZlogo.png";

function SignInPage() {
    const navigate = useNavigate();
    const { signIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        const result = signIn(email, password);
        if (result.success) {
            navigate("/");
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F1420] flex flex-col items-center justify-center px-4">
            {/* Logo & Header */}
            <div className="text-center mb-8">
                <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <img src={GenZLogo} alt="GenZ" className="h-20 w-auto" />
                </div>
                <p className="text-[#4E6793] text-sm">Welcome Back</p>
            </div>

            {/* Card */}
            <div className="w-full max-w-md">
                <div className="bg-[#19233C] rounded-2xl p-8 border border-[#2B3D5F] shadow-xl">
                    <h2 className="text-lg font-semibold text-[#E5E7EB] text-center mb-6">Sign In to Your Account</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="text-sm text-[#4E6793] mb-2 block font-medium">Email Address</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4E6793]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full bg-[#2B3D5F] text-[#E5E7EB] placeholder-[#4E6793] rounded-xl py-3 pl-11 pr-4 outline-none border border-[#2B3D5F] focus:border-[#4E6793] focus:ring-1 focus:ring-[#4E6793] transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-sm text-[#4E6793] mb-2 block font-medium">Password</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4E6793]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full bg-[#2B3D5F] text-[#E5E7EB] placeholder-[#4E6793] rounded-xl py-3 pl-11 pr-12 outline-none border border-[#2B3D5F] focus:border-[#4E6793] focus:ring-1 focus:ring-[#4E6793] transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4E6793] hover:text-[#E5E7EB] transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        {showPassword ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.99 7.99m3.889 1.888L14.12 14.12m0 0l2.829 2.829M3 3l18 18" />
                                        )}
                                    </svg>
                                </button>
                            </div>
                            <div className="text-right mt-2">
                                <span className="text-[#4E6793] text-sm cursor-pointer hover:text-[#E5E7EB] transition-colors">Forgot Password?</span>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                                <p className="text-red-400 text-sm text-center">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-[#4E6793] text-[#E5E7EB] py-3.5 rounded-xl text-base font-semibold flex items-center justify-center gap-2 hover:bg-[#4E6793]/90 transition-colors shadow-lg"
                        >
                            Sign In
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-[#2B3D5F]" />
                        <span className="text-[#4E6793] text-sm">Or continue with</span>
                        <div className="flex-1 h-px bg-[#2B3D5F]" />
                    </div>

                    {/* Google Button */}
                    <button className="w-full bg-[#2B3D5F] text-[#E5E7EB] py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-3 hover:bg-[#2B3D5F]/80 transition-colors border border-[#2B3D5F]">
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Continue with Google
                    </button>
                </div>

                {/* Sign Up Link */}
                <div className="text-center mt-6">
                    <p className="text-[#4E6793] text-sm">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-[#E5E7EB] font-semibold hover:text-[#4E6793] transition-colors">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignInPage;