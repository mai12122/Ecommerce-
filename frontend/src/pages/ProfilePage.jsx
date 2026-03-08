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

    return (
        <div className="min-h-screen bg-gray-100 pb-24">
            <div className="bg-purple-600  pt-12 pb-16 px-5 relative">
                <button className="absolute top-12 right-5 w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {user?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">{user?.name || "User"}</h1>
                        <span className="inline-block bg-purple-500 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full mt-1 uppercase tracking-wider">
                            VIP Member
                        </span>
                    </div>
                </div>
                <div className="flex justify-around mt-8 bg-white/10 rounded-2xl py-4">
                    <div className="text-center">
                        <p className="text-white text-xl font-bold">{wishlistItems.length}</p>
                        <p className="text-purple-200 text-xs mt-0.5">Wishlist</p>
                    </div>
                    <div className="w-px bg-white/20" />
                    <div className="text-center">
                        <p className="text-white text-xl font-bold">0</p>
                        <p className="text-purple-200 text-xs mt-0.5">Coupons</p>
                    </div>
                    <div className="w-px bg-white/20" />
                    <div className="text-center">
                        <p className="text-white text-xl font-bold">55</p>
                        <p className="text-purple-200 text-xs mt-0.5">Points</p>
                    </div>
                </div>
            </div>

            {/* My Orders */}
            <div className="mx-5 -mt-4 bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-base font-bold text-gray-900">My Orders</h2>
                    <span className="text-purple-600 text-sm font-medium cursor-pointer">View All</span>
                </div>
                <div className="flex justify-around">
                    {[
                        { label: "Pending", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
                        { label: "Processing", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
                        { label: "Shipped", icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" },
                        { label: "Review", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
                        { label: "Returns", icon: "M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" },
                    ].map((item) => (
                        <div key={item.label} className="flex flex-col items-center gap-2">
                            <div className="w-11 h-11 bg-purple-50 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                </svg>
                            </div>
                            <span className="text-[11px] text-gray-600">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Services */}
            <div className="mx-5 mt-4 bg-white rounded-2xl p-5 shadow-sm">
                <h2 className="text-base font-bold text-gray-900 mb-5">Services</h2>
                <div className="flex justify-around">
                    {[
                        { label: "Order\nHistory", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", action: () => {} },
                        { label: "Address", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", action: () => {} },
                        { label: "Support", icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z", action: () => {} },
                        { label: "About Us", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", action: () => {} },
                    ].map((item) => (
                        <button key={item.label} onClick={item.action} className="flex flex-col items-center gap-2">
                            <div className="w-11 h-11 bg-purple-50 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                </svg>
                            </div>
                            <span className="text-[11px] text-gray-600 text-center whitespace-pre-line">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Account Info */}
            <div className="mx-5 mt-4 bg-white rounded-2xl p-5 shadow-sm">
                <h2 className="text-base font-bold text-gray-900 mb-4">Account Info</h2>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-600">{user?.email}</span>
                    </div>
                    {user?.phone && (
                        <div className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="text-sm text-gray-600">{user.phone}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Sign Out */}
            <div className="mx-5 mt-4">
                <button
                    onClick={handleSignOut}
                    className="w-full bg-white text-red-500 py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm hover:bg-red-50 transition-colors"
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
