import { useNavigate } from "react-router-dom";

function BillPage() {
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
                    <h2 className="text-white text-lg font-semibold">Bill</h2>
                    <div className="w-16"></div>
                </div>
            </header>
            
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bills Available</h3>
                    <p className="text-gray-500">Your billing history will appear here</p>
                </div>
            </div>
        </div>
    );
}

export default BillPage;