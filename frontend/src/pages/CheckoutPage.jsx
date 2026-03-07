import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CheckoutPage() {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const navigate = useNavigate();
    const { cartItems, total, clearCart } = useCart();

    const [form, setForm] = useState({
        name: "",
        phone: "",
        address: "",
        payment_method: "COD",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            const res = await fetch(`${BASEURL}/api/orders/create/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    phone: form.phone,
                    address: form.address,
                    payment_method: form.payment_method,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                clearCart();
                setOrderId(data.order_id);
                setShowSuccess(true);
            } else {
                setMessage(data.error || "Something went wrong");
            }
        } catch {
            setMessage("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 flex items-center px-4 py-4 shadow-sm">
                <button onClick={() => navigate(-1)} className="p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="flex-1 text-center text-lg font-bold text-gray-900 tracking-wide">CHECKOUT</h1>
                <div className="w-6" />
            </div>

            <div className="px-5 pt-6 max-w-md mx-auto">
                {/* Order total */}
                {cartItems.length > 0 && (
                    <div className="bg-purple-50 rounded-xl p-4 mb-6 flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Order Total ({cartItems.length} items)</span>
                        <span className="text-purple-600 text-xl font-bold">${total}</span>
                    </div>
                )}

                {/* COD Badge */}
                <div className="flex items-center gap-3 bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">Cash on Delivery</p>
                        <p className="text-xs text-gray-500">Pay when you receive your order</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="text-sm text-gray-500 mb-1 block">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Full Name"
                            className="w-full border-b-2 border-gray-200 focus:border-purple-600 outline-none py-3 text-gray-800 text-base transition-colors"
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="text-sm text-gray-500 mb-1 block">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+1 000 000 0000"
                            className="w-full border-b-2 border-gray-200 focus:border-purple-600 outline-none py-3 text-gray-800 text-base transition-colors"
                            required
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="text-sm text-gray-500 mb-1 block">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Shipping Address"
                            className="w-full border-b-2 border-gray-200 focus:border-purple-600 outline-none py-3 text-gray-800 text-base transition-colors"
                            required
                        />
                    </div>

                    {/* Error Message */}
                    {message && (
                        <p className="text-center text-sm font-medium text-red-500">
                            {message}
                        </p>
                    )}

                    {/* Checkout Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 text-white py-4 rounded-full text-base font-bold uppercase tracking-wider hover:bg-purple-700 transition-colors disabled:opacity-50 mt-4"
                    >
                        {loading ? "Processing..." : "CHECKOUT"}
                    </button>
                </form>
            </div>

            {/* Success Popup */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-5">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
                        {/* Checkmark */}
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Order Placed!</h2>
                        <p className="text-gray-500 text-sm mb-1">Your order has been placed successfully.</p>
                        <p className="text-purple-600 font-semibold text-lg mb-6">Order #{orderId}</p>
                        <button
                            onClick={() => navigate("/")}
                            className="w-full bg-purple-600 text-white py-3.5 rounded-full text-base font-semibold hover:bg-purple-700 transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CheckoutPage;
