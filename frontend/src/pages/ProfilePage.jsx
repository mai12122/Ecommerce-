
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState, useRef, useEffect } from "react";

function ProfilePage() {
    const navigate = useNavigate();
    const { user, signOut, updateProfile } = useAuth();
    const { wishlistItems } = useCart();
    
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState({
        name: "",
        email: "",
        phone: ""
    });
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState(null);

    useEffect(() => {
        if (user) {
            setEditedProfile({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || ""
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
        const reader = new FileReader();
        
        reader.onloadend = () => {
            const base64Image = reader.result;
            setPreviewUrl(base64Image);
            setEditedProfile(prev => ({ ...prev, avatar: base64Image }));
            setIsUploading(false);
        };
        
        reader.onerror = () => {
            alert("Failed to read image. Please try again.");
            setIsUploading(false);
        };
        
        reader.readAsDataURL(file);
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
                ...(editedProfile.avatar && { avatar: editedProfile.avatar })
            };
            updateProfile(dataToSave);
            setPreviewUrl(null);
            setSaveMessage({ type: "success", text: "Profile saved successfully! ✓" });
            setIsEditing(false);
        
            setTimeout(() => setSaveMessage(null), 3000);
            
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
                phone: user.phone || ""
            });
        }
        setPreviewUrl(null);
        setIsEditing(false);
        setSaveMessage(null);
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
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
            />

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
            {saveMessage && (
                <div className={`mx-4 mt-3 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
                    saveMessage.type === "success" 
                        ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}>
                    {saveMessage.type === "success" ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                    {saveMessage.text}
                </div>
            )}

            <div className="mx-4 mt-4 bg-[#19233C] rounded-2xl p-5 border border-[#2B3D5F]">
                <div className="flex items-start gap-4">
                    <button 
                        onClick={triggerFileInput}
                        disabled={isUploading}
                        className="relative w-20 h-20 bg-[#2B3D5F] rounded-full flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-[#4E6793] transition-all disabled:opacity-50 "
                    >
                        {getAvatarDisplay() ? (
                            <img 
                                src={getAvatarDisplay()} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#4E6793]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        )}
                        
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        
                        {isUploading && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full">
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </button>

                    <div className="flex-1 min-w-0 space-y-3">
                        {/* Name */}
                        <div>
                            <label className="block text-xs text-[#4E6793] mb-1">Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedProfile.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    className="w-full bg-[#2B3D5F] text-[#E5E7EB] px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4E6793]"
                                    placeholder="Your name"
                                />
                            ) : (
                                <p className="text-[#E5E7EB] font-medium">{user?.name || "User"}</p>
                            )}
                        </div>
                        
                        {/* Email */}
                        <div>
                            <label className="block text-xs text-[#4E6793] mb-1">Email</label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={editedProfile.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    className="w-full bg-[#2B3D5F] text-[#E5E7EB] px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4E6793]"
                                    placeholder="your@email.com"
                                />
                            ) : (
                                <p className="text-[#4E6793] text-sm">{user?.email || ""}</p>
                            )}
                        </div>
                        
                        {/* Phone */}
                        <div>
                            <label className="block text-xs text-[#4E6793] mb-1">Phone</label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={editedProfile.phone}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                    className="w-full bg-[#2B3D5F] text-[#E5E7EB] px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4E6793]"
                                    placeholder="+1234567890"
                                />
                            ) : (
                                <p className="text-[#4E6793] text-sm">{user?.phone || ""}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex gap-3">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="flex-1 bg-[#2B3D5F] hover:bg-[#3D5075] disabled:opacity-50 text-[#E5E7EB] py-3 px-4 rounded-xl text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving || !hasUnsavedChanges()}
                                className="flex-1 bg-[#4E6793] hover:bg-[#5E7DB3] disabled:opacity-50 disabled:hover:bg-[#4E6793] text-white py-3 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="w-full bg-[#2B3D5F] hover:bg-[#3D5075] text-[#E5E7EB] py-3 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Profile
                        </button>
                    )}
                </div>
                <button
                    onClick={triggerFileInput}
                    disabled={isUploading}
                    className="w-full mt-3 bg-[#19233C] hover:bg-[#2B3D5F] disabled:opacity-50 text-[#4E6793] py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {isUploading ? "Processing..." : "Change Photo"}
                </button>
            </div>

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