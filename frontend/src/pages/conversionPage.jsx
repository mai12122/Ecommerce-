import { useNavigate } from "react-router-dom";

function ConversionPage() {
    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen bg-[#0F1420] ">
            <header className="bg-black pt-5 pb-4 px-4 sticky top-0 z-10 shadow-md">
                <div className="flex justify-between items-center max-w-4xl mx-auto">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-medium">Back</span>
                    </button>
                    <h2 className="text-white text-lg font-semibold">Conversion</h2>
                    <div className="w-16"></div>
                </div>
            </header>
            
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Currency Converter</h3>
                    <p className="text-gray-500 mb-6">Convert between different currencies</p>
                    <div className="space-y-4 max-w-sm mx-auto">
                        <input
                            type="number"
                            placeholder="Amount"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>USD to EUR</option>
                            <option>USD to GBP</option>
                            <option>EUR to USD</option>
                        </select>
                        <button className="w-full bg-[#0F1420] text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                            Convert
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConversionPage;