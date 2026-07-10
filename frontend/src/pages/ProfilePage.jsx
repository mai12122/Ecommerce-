import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState, useRef, useEffect } from "react";

function ProfilePage() {
    const navigate = useNavigate();
    const { user, signOut, updateProfile } = useAuth();
    const { wishlistItems } = useCart();
    
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState({
        name: "",
        email: "",
        phone: "",
        address: ""
    });
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState(null);

    useEffect(() => {
        if (user) {
            setEditedProfile({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || ""
            });
        }
    }, [user]);

    const handleSignOut = () => {
        signOut();
        navigate("/signin");
    };

    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Image size should be less than 5MB.");
            return;
        }

        setIsUploading(true);
        setSelectedFile(file);
        try {
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        } catch (e) {
            console.error('preview error', e);
            setPreviewUrl(null);
        }
        setIsUploading(false);
        event.target.value = "";
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const getAvatarDisplay = () => {
        if (previewUrl) return previewUrl;
        if (editedProfile.avatar) return editedProfile.avatar;
        if (user?.avatar) return user.avatar;
        return null;
    };

    const handleInputChange = (field, value) => {
        setEditedProfile(prev => ({ ...prev, [field]: value }));
        setSaveMessage(null); 
    };

    const hasUnsavedChanges = () => {
        if (!user) return false;
        return (
            editedProfile.name !== (user.name || "") ||
            editedProfile.email !== (user.email || "") ||
            editedProfile.phone !== (user.phone || "") ||
            editedProfile.address !== (user.address || "") ||
            editedProfile.avatar !== user.avatar ||
            previewUrl !== null
        );
    };

    const handleSave = async () => {
        if (!editedProfile.name.trim()) {
            alert("Name is required.");
            return;
        }
        if (!editedProfile.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedProfile.email)) {
            alert("Please enter a valid email address.");
            return;
        }

        setIsSaving(true);
        setSaveMessage(null);

        try {
            const dataToSave = {
                name: editedProfile.name.trim(),
                email: editedProfile.email.trim(),
                phone: editedProfile.phone.trim(),
                address: editedProfile.address.trim(),
                ...(selectedFile ? { avatar: selectedFile } : (previewUrl ? { avatar: previewUrl } : {}))
            };
            const result = await updateProfile(dataToSave);
            if (result.success) {
                if (previewUrl && selectedFile) {
                    try { URL.revokeObjectURL(previewUrl); } catch (err) { console.warn('Failed to revoke preview URL', err); }
                }
                setPreviewUrl(null);
                setSelectedFile(null);
                setSaveMessage({ type: "success", text: "Profile saved successfully! ✓" });
                setIsEditing(false);
                setTimeout(() => setSaveMessage(null), 3000);
            } else {
                setSaveMessage({ type: "error", text: result.error || "Failed to save. Please try again." });
            }
        } catch (error) {
            console.error("Save failed:", error);
            setSaveMessage({ type: "error", text: "Failed to save. Please try again." });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (user) {
            setEditedProfile({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || ""
            });
        }
        setPreviewUrl(null);
        setIsEditing(false);
        setSaveMessage(null);
    };

    const menuItems = [
        { label: "Order History", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01", path: "/orders" },
        { label: "Address", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", path: "/address" },
        { label: "Bill", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", path: "/bill" },
        { label: "Language", icon: "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129", path: "/language" },
        { label: "Preferred exchange rate", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", path: "/exchange-rate" },
        { label: "Feedback", icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z", path: "/feedback" },
        { label: "Conversion", icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4", path: "/conversion" },
    ];

    return (
        <div className="min-h-screen bg-[#0F1420] pb-24">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
            />

            <header className="bg-black pt-5 pb-4 px-4 sticky top-0 z-10 shadow-md">
                <div className="flex justify-between items-center max-w-4xl mx-auto">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-medium">Back</span>
                    </button>
                    <h2 className="text-white text-lg font-semibold">Profile</h2>
                    {isEditing ? (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="text-gray-400 hover:text-white text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving || !hasUnsavedChanges()}
                                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors shadow-sm"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Saving
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Save
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                        </button>
                    )}
                </div>
            </header>

            <div className="max-w-4xl mx-auto">
                {saveMessage && (
                    <div className={`mx-4 mt-4 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm ${
                        saveMessage.type === "success" 
                            ? "bg-green-50 text-green-800 border border-green-100" 
                            : "bg-red-50 text-red-800 border border-red-100"
                    }`}>
                        {saveMessage.type === "success" ? (
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                        {saveMessage.text}
                    </div>
                )}

                {/* Profile Info Card */}
                <div className="mx-4 mt-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-5">
                        <button 
                            onClick={triggerFileInput}
                            disabled={isUploading}
                            className="relative w-24 h-24 rounded-full overflow-visible ring-2 ring-white shadow-lg bg-gray-100 flex-shrink-0 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"                        >
                            {getAvatarDisplay() ? (
                                <img 
                                    src={getAvatarDisplay()} 
                                    alt="Profile" 
                                    className="w-full h-full rounded-full object-cover transition-transform group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            )}
                            
                            {/* Camera icon badge */}
                            <div className="absolute -bottom-1 right-1 bg-white text-blue-600 rounded-full p-1.5 shadow-md border border-gray-100 flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white z-10">                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full backdrop-blur-sm">
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </button>

                        {isEditing ? (
                            <div className="flex-1 min-w-0 space-y-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={editedProfile.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        className="w-full bg-gray-50 text-gray-900 px-3 py-2.5 rounded-lg text-sm border border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={editedProfile.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        className="w-full bg-gray-50 text-gray-900 px-3 py-2.5 rounded-lg text-sm border border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        value={editedProfile.phone}
                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                        className="w-full bg-gray-50 text-gray-900 px-3 py-2.5 rounded-lg text-sm border border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                                        placeholder="+1234567890"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Address</label>
                                    <input
                                        type="text"
                                        value={editedProfile.address}
                                        onChange={(e) => handleInputChange("address", e.target.value)}
                                        className="w-full bg-gray-50 text-gray-900 px-3 py-2.5 rounded-lg text-sm border border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                                        placeholder="Your address"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 min-w-0 ml-2">
                                <h1 className="text-xl font-bold text-gray-900 tracking-tight truncate">{user?.name || "User"}</h1>
                                
                                <div className="mt-3 space-y-2">
                                    {user?.email && (
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span className="truncate">{user.email}</span>
                                        </div>
                                    )}
                                    {user?.phone && (
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <span className="truncate">{user.phone}</span>
                                        </div>
                                    )}
                                    {user?.address && (
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="truncate">{user.address}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Links Grid */}
                <div className="mx-4 mt-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="grid grid-cols-4 gap-4">
                        {[
                            { label: "Wishlist", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", color: "text-red-500", bg: "bg-red-50", path: "/wishlist", badge: wishlistItems.length > 0 ? wishlistItems.length : null },
                            { label: "Orders", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-blue-500", bg: "bg-blue-50", path: "/orders" },
                            { label: "Wallet", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z", color: "text-green-500", bg: "bg-green-50", path: "/wallet" },
                            { label: "Coupon", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z", color: "text-orange-500", bg: "bg-orange-50", path: "/coupons" },
                        ].map((item) => (
                            <button key={item.label} onClick={() => item.path && navigate(item.path)} className="flex flex-col items-center gap-2 relative group">
                                <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${item.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                    </svg>
                                    {item.badge && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs text-gray-600 font-medium group-hover:text-gray-900 transition-colors">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Menu Items List */}
                <div className="mx-4 mt-4 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    {menuItems.map((item, index) => (
                        <button 
                            key={item.label}
                            onClick={() => item.path && navigate(item.path)}
                            className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group ${index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900 transition-colors">{item.label}</span>
                            </div>
                            <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    ))}
                </div>

                {/* Sign Out Button */}
                <div className="mx-4 mt-6 mb-8">
                    <button
                        onClick={handleSignOut}
                        className="w-full bg-white text-red-600 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;