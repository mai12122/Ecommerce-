import { useNavigate } from "react-router-dom";

function AddressPage() {
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
                    <h2 className="text-white text-lg font-semibold">Address</h2>
                    <div className="w-16"></div>
                </div>
            </header>
            
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">My Addresses</h3>
                        <button className="text-blue-600 font-medium text-sm hover:text-blue-700">
                            + Add New
                        </button>
                    </div>
                    <div className="text-center py-8">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-gray-500">No addresses saved yet</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddressPage;