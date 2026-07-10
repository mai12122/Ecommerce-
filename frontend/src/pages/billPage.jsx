import { useNavigate } from "react-router-dom";
import GenZLogo from "../assets/GenZlogo.png";

function BillPage() {
    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen bg-[#0F1420] pb-24 md:pb-8">
            {/* Header */}
            <header className="sticky top-0 bg-[#19233C] z-10 pt-6 pb-4 px-5">
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1 text-[#4E6793] hover:text-[#E5E7EB] transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-medium">Back</span>
                    </button>
                    <p className="text-sm font-semibold text-[#E5E7EB] tracking-wide">BILLING HISTORY</p>
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md">
                        <img src={GenZLogo} alt="GenZ" className="h-10 w-auto" />
                    </div>
                </div>
            </header>

            <div className="px-5 pt-6 max-w-lg mx-auto">
                {/* Empty State */}
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-20 h-20 bg-[#19233C] rounded-full flex items-center justify-center mb-5 border border-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#4E6793]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-[#E5E7EB] text-lg font-semibold mb-2">No Bills Available</h3>
                    <p className="text-[#4E6793] text-sm text-center mb-6 max-w-xs">
                        Your billing history will appear here. Start placing orders to see your bills!
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-[#4E6793] text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-[#4E6793]/90 transition-colors shadow-lg shadow-[#4E6793]/25"
                    >
                        Start Shopping
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BillPage;