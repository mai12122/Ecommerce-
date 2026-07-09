import { useNavigate } from "react-router-dom";
import { useState } from "react";

function LanguagePage() {
    const navigate = useNavigate();
    const [selectedLang, setSelectedLang] = useState("English");
    
    const languages = [
        { name: "English", flag: "🇺🇸" },
        { name: "Spanish", flag: "🇪🇸" },
        { name: "French", flag: "🇫🇷" },
        { name: "German", flag: "🇩🇪" },
        { name: "Chinese", flag: "🇨🇳" },
    ];
    
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-black pt-5 pb-4 px-4 sticky top-0 z-10 shadow-md">
                <div className="flex justify-between items-center max-w-4xl mx-auto">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-medium">Back</span>
                    </button>
                    <h2 className="text-white text-lg font-semibold">Language</h2>
                    <div className="w-16"></div>
                </div>
            </header>
            
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {languages.map((lang, index) => (
                        <button
                            key={lang.name}
                            onClick={() => setSelectedLang(lang.name)}
                            className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${index !== languages.length - 1 ? 'border-b border-gray-100' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{lang.flag}</span>
                                <span className="text-gray-900 font-medium">{lang.name}</span>
                            </div>
                            {selectedLang === lang.name && (
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default LanguagePage;