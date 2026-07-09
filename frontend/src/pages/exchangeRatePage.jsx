import { useNavigate } from "react-router-dom";
import { useState } from "react";

function ExchangeRatePage() {
    const navigate = useNavigate();
    const [selectedRate, setSelectedRate] = useState("USD");
    
    const rates = [
        { code: "USD", symbol: "$", name: "US Dollar" },
        { code: "EUR", symbol: "€", name: "Euro" },
        { code: "GBP", symbol: "£", name: "British Pound" },
        { code: "JPY", symbol: "¥", name: "Japanese Yen" },
        { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
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
                    <h2 className="text-white text-lg font-semibold">Exchange Rate</h2>
                    <div className="w-16"></div>
                </div>
            </header>
            
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {rates.map((rate, index) => (
                        <button
                            key={rate.code}
                            onClick={() => setSelectedRate(rate.code)}
                            className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${index !== rates.length - 1 ? 'border-b border-gray-100' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <span className="text-lg font-semibold text-gray-700">{rate.symbol}</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-gray-900 font-medium">{rate.code}</p>
                                    <p className="text-sm text-gray-500">{rate.name}</p>
                                </div>
                            </div>
                            {selectedRate === rate.code && (
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

export default ExchangeRatePage;