import { useNavigate } from "react-router-dom";

function WalletPage() {
    const navigate = useNavigate();
    
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
                    <h2 className="text-white text-lg font-semibold">Wallet</h2>
                    <div className="w-16"></div>
                </div>
            </header>
            
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg mb-4">
                    <p className="text-blue-100 text-sm mb-1">Total Balance</p>
                    <h3 className="text-3xl font-bold">$0.00</h3>
                    <button className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors">
                        Add Money
                    </button>
                </div>
                
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <p className="text-gray-500">No transactions yet</p>
                </div>
            </div>
        </div>
    );
}

export default WalletPage;