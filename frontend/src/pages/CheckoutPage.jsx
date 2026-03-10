import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import GenZLogo from "../assets/GenZlogo.png";

const COLORS = {
  bgDarkest: "#0F1420",    
  bgPrimary: "#19233C",    
  bgSecondary: "#2B3D5F",  
  bgAccent: "#4E6793",    
  textLight: "#E5E7EB",    
  border: "#E5E7EB",     
};

const SHIPPING_COST = 15.00;

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

  const shipping = cartItems.length > 0 ? SHIPPING_COST : 0;
  const cartTotal = total + shipping;

  const handleBack = () => navigate(-1);
  const handleContinueShopping = () => navigate("/");
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    navigate("/");
  };

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
    <div className="min-h-screen bg-[#0F1420] pb-24 md:pb-8">
      <header className="sticky top-0 bg-[#19233C] z-10 pt-6 pb-4 px-5">
        <div className="flex justify-between items-center">
          <button onClick={handleBack} className="flex items-center gap-1 text-[#4E6793] hover:text-[#E5E7EB] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back</span>
          </button>
          <p className="text-sm font-semibold text-[#E5E7EB] tracking-wide">CHECKOUT</p>
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md">
            <img src={GenZLogo} alt="GenZ" className="h-10 w-auto" />
          </div>
        </div>
      </header>

      <div className="px-5 pt-6 max-w-md mx-auto">
        {cartItems.length > 0 && (
          <div className="bg-[#19233C] rounded-xl p-4 mb-6 flex justify-between items-center">
            <span className="text-[#E5E7EB] font-medium">
              Order Total ({cartItems.length} items)
            </span>
            <span className="text-[#4E6793] text-xl font-bold">
              ${cartTotal.toFixed(2)}
            </span>
          </div>
        )}
        <div className="flex items-center gap-3 bg-[#19233C] rounded-xl p-4 mb-6 border border-[#2B3D5F]">
          <div className="w-10 h-10 bg-[#2B3D5F] rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-[#4E6793]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#E5E7EB]">
              Cash on Delivery
            </p>
            <p className="text-xs text-[#4E6793]">
              Pay when you receive your order
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-[#4E6793] mb-2 block">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full bg-[#19233C] border border-[#2B3D5F] rounded-xl px-4 py-3.5 text-[#E5E7EB] placeholder-[#4E6793] outline-none focus:border-[#4E6793] focus:ring-1 focus:ring-[#4E6793] transition-all"
              required
            />
          </div>

          <div>
            <label className="text-sm text-[#4E6793] mb-2 block">Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 000 000 0000"
              className="w-full bg-[#19233C] border border-[#2B3D5F] rounded-xl px-4 py-3.5 text-[#E5E7EB] placeholder-[#4E6793] outline-none focus:border-[#4E6793] focus:ring-1 focus:ring-[#4E6793] transition-all"
              required
            />
          </div>
          <div>
            <label className="text-sm text-[#4E6793] mb-2 block">Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Shipping Address"
              className="w-full bg-[#19233C] border border-[#2B3D5F] rounded-xl px-4 py-3.5 text-[#E5E7EB] placeholder-[#4E6793] outline-none focus:border-[#4E6793] focus:ring-1 focus:ring-[#4E6793] transition-all"
              required
            />
          </div>
          {message && (
            <p className="text-center text-sm font-medium text-red-400 bg-red-500/10 rounded-xl py-3">
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4E6793] text-white py-4 rounded-xl text-base font-semibold hover:bg-[#4E6793]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#4E6793]/25"
          >
            {loading ? "Processing..." : "PLACE ORDER"}
          </button>
        </form>
      </div>
      {showSuccess && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-5">
          <div className="bg-[#19233C] rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl border border-[#2B3D5F]">
            <div className="w-20 h-20 bg-[#2B3D5F] rounded-full flex items-center justify-center mx-auto mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-[#4E6793]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#E5E7EB] mb-2">
              Order Placed!
            </h2>
            <p className="text-[#4E6793] text-sm mb-1">
              Your order has been placed successfully.
            </p>
            <p className="text-[#E5E7EB] font-semibold text-lg mb-6">
              Order #{orderId}
            </p>
            <button
              onClick={handleContinueShopping}
              className="w-full bg-[#4E6793] text-white py-3.5 rounded-xl text-base font-semibold hover:bg-[#4E6793]/90 transition-colors"
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