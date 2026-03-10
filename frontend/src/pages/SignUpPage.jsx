import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GenZLogo from "../assets/GenZlogo.png";

function SignUpPage() {
    const navigate = useNavigate();
    const { signUp } = useAuth();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (form.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        if (!agreed) {
            setError("Please agree to the Terms of Service");
            return;
        }

        const result = signUp(form.name, form.email, form.phone, form.password);
        if (result.success) {
            navigate("/");
        } else {
            setError(result.error);
        }
    };

    const EyeIcon = ({ show, onToggle }) => (
        <button type="button" onClick={onToggle} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4E6793] hover:text-[#E5E7EB] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                {show ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.99 7.99m3.889 1.888L14.12 14.12m0 0l2.829 2.829M3 3l18 18" />
                )}
            </svg>
        </button>
    );

    return (
        <div className="min-h-screen bg-[#0F1420] flex flex-col items-center justify-center px-4 py-8">
            {/* Logo & Header */}
            <div className="text-center mb-8">
                <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <img src={GenZLogo} alt="GenZ" className="h-20 w-auto" />
                </div>
                <p className="text-[#4E6793] text-sm">Create Your Account</p>
            </div>

            {/* Card */}
            <div className="w-full max-w-md">
                <div className="bg-[#19233C] rounded-2xl p-8 border border-[#2B3D5F] shadow-xl">
                    <h2 className="text-lg font-semibold text-[#E5E7EB] text-center mb-6">Join GenZ Today</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="text-sm text-[#4E6793] mb-2 block font-medium">Full Name</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4E6793]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Your Name"
                                    className="w-full bg-[#2B3D5F] text-[#E5E7EB] placeholder-[#4E6793] rounded-xl py-3 pl-11 pr-4 outline-none border border-[#2B3D5F] focus:border-[#4E6793] focus:ring-1 focus:ring-[#4E6793] transition-all"
                                    required
                                />
                            </div>
                        </div>

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
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="w-full bg-[#2B3D5F] text-[#E5E7EB] placeholder-[#4E6793] rounded-xl py-3 pl-11 pr-4 outline-none border border-[#2B3D5F] focus:border-[#4E6793] focus:ring-1 focus:ring-[#4E6793] transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="text-sm text-[#4E6793] mb-2 block font-medium">Phone Number</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4E6793]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </span>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 000-0000"
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
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    className="w-full bg-[#2B3D5F] text-[#E5E7EB] placeholder-[#4E6793] rounded-xl py-3 pl-11 pr-12 outline-none border border-[#2B3D5F] focus:border-[#4E6793] focus:ring-1 focus:ring-[#4E6793] transition-all"
                                    required
                                />
                                <EyeIcon show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="text-sm text-[#4E6793] mb-2 block font-medium">Confirm Password</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4E6793]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </span>
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    className="w-full bg-[#2B3D5F] text-[#E5E7EB] placeholder-[#4E6793] rounded-xl py-3 pl-11 pr-12 outline-none border border-[#2B3D5F] focus:border-[#4E6793] focus:ring-1 focus:ring-[#4E6793] transition-all"
                                    required
                                />
                                <EyeIcon show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
                            </div>
                        </div>

                        {/* Terms */}
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mt-0.5 accent-[#4E6793] w-4 h-4"
                            />
                            <span className="text-[#4E6793] text-xs leading-relaxed group-hover:text-[#E5E7EB] transition-colors">
                                I agree to the <span className="text-[#E5E7EB] underline decoration-[#4E6793]">Terms of Service</span> and <span className="text-[#E5E7EB] underline decoration-[#4E6793]">Privacy Policy</span>
                            </span>
                        </label>

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
                            Create Account
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </form>
                </div>

                {/* Sign In Link */}
                <div className="text-center mt-6">
                    <p className="text-[#4E6793] text-sm">
                        Already have an account?{" "}
                        <Link to="/signin" className="text-[#E5E7EB] font-semibold hover:text-[#4E6793] transition-colors">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignUpPage;