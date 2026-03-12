import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function ProfilePage() {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const { wishlistItems } = useCart();

    const handleSignOut = () => {
        signOut();
        navigate("/signin");
    };

    const menuItems = [
        { label: "Order History", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01", path: "/orders" },
        { label: "Address", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" },
        { label: "Bill", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
        { label: "Language", icon: "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" },
        { label: "Preferred exchange rate", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
        { label: "Feedback", icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" },
        { label: "Conversion", icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" },
    ];

    return (
        <div className="min-h-screen bg-[#0F1420] pb-24">
            {/* Header */}
            <header className="bg-[#19233C] pt-6 pb-4 px-5">
                <div className="flex justify-between items-center">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[#4E6793] hover:text-[#E5E7EB] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-medium">Back</span>
                    </button>
                    <h2 className="text-[#E5E7EB] text-lg font-semibold">Profile</h2>
                    <div className="w-14" />
                </div>
            </header>

            {/* User Info Card */}
            <div className="mx-4 mt-5 bg-[#19233C] rounded-2xl p-5 border border-[#2B3D5F]">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#2B3D5F] rounded-full flex items-center justify-center text-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#4E6793]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#E5E7EB]">{user?.name || "User"}</h3>
                        <p className="text-sm text-[#4E6793] mt-0.5">{user?.email || ""}</p>
                        <p className="text-sm text-[#4E6793] mt-0.5">{user?.phone || ""}</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mx-4 mt-4 bg-[#19233C] rounded-2xl p-5 border border-[#2B3D5F]">
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { label: "Wishlist", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", badge: wishlistItems.length > 0 ? wishlistItems.length : null },
                        { label: "Orders", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", path: "/orders" },
                        { label: "Wallet", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
                        { label: "Coupon", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" },
                    ].map((item) => (
                        <button key={item.label} onClick={() => item.path && navigate(item.path)} className="flex flex-col items-center gap-2 relative">
                            <div className="w-12 h-12 bg-[#2B3D5F] rounded-2xl flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#4E6793]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                </svg>
                                {item.badge && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <span className="text-[11px] text-[#4E6793] font-medium">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu List */}
            <div className="mx-4 mt-4 bg-[#19233C] rounded-2xl border border-[#2B3D5F] overflow-hidden">
                {menuItems.map((item, index) => (
                    <button 
                        key={item.label}
                        onClick={() => item.path && navigate(item.path)}
                        className={`w-full flex items-center justify-between p-4 hover:bg-[#2B3D5F] transition-colors ${index !== menuItems.length - 1 ? 'border-b border-[#2B3D5F]' : ''}`}
                    >
                        <div className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#4E6793]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                            </svg>
                            <span className="text-sm text-[#E5E7EB] font-medium">{item.label}</span>
                        </div>
                        <svg className="w-5 h-5 text-[#4E6793]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                ))}
            </div>

            {/* Sign Out Button */}
            <div className="mx-4 mt-6">
                <button
                    onClick={handleSignOut}
                    className="w-full bg-[#19233C] text-red-400 py-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 border border-[#2B3D5F] hover:bg-[#2B3D5F] transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                </button>
            </div>
        </div>
    );
}

export default ProfilePage;