import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GenZLogo from "../assets/GenZlogo.png";

function OrderHistory() {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${BASEURL}/api/orders/`);
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [BASEURL]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

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
          <p className="text-sm font-semibold text-[#E5E7EB] tracking-wide">ORDER HISTORY</p>
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md">
            <img src={GenZLogo} alt="GenZ" className="h-10 w-auto" />
          </div>
        </div>
      </header>

      <div className="px-5 pt-6 max-w-lg mx-auto">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-3 border-[#4E6793] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#4E6793] mt-4 text-sm">Loading orders...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-[#19233C] rounded-full flex items-center justify-center mb-5 border border-[#2B3D5F]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#4E6793]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-[#E5E7EB] text-lg font-semibold mb-2">No Orders Yet</h3>
            <p className="text-[#4E6793] text-sm text-center mb-6 max-w-xs">
              Looks like you haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-[#4E6793] text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-[#4E6793]/90 transition-colors shadow-lg shadow-[#4E6793]/25"
            >
              Start Shopping
            </button>
          </div>
        )}

        {/* Orders Summary */}
        {!loading && orders.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[#E5E7EB] text-base font-semibold">
                {orders.length} Order{orders.length !== 1 ? "s" : ""}
              </h3>
              <span className="text-xs text-[#4E6793] bg-[#19233C] px-3 py-1.5 rounded-full border border-[#2B3D5F]">
                Most Recent First
              </span>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {orders.map((order) => {
                const isExpanded = expandedOrder === order.id;
                const itemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

                return (
                  <div
                    key={order.id}
                    className="bg-[#19233C] rounded-2xl border border-[#2B3D5F] overflow-hidden transition-all duration-300"
                  >
                    {/* Order Header - Clickable */}
                    <button
                      onClick={() => toggleOrder(order.id)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-[#2B3D5F]/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {/* Order Icon */}
                        <div className="w-12 h-12 bg-[#2B3D5F] rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#4E6793]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>

                        <div>
                          <p className="text-[#E5E7EB] font-semibold text-sm">
                            Order #{order.id}
                          </p>
                          <p className="text-[#4E6793] text-xs mt-0.5">
                            {formatDate(order.created_at)} · {formatTime(order.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-[#E5E7EB] font-bold text-sm">
                            ${parseFloat(order.total_amount).toFixed(2)}
                          </p>
                          <p className="text-[#4E6793] text-xs">
                            {itemCount} item{itemCount !== 1 ? "s" : ""}
                          </p>
                        </div>
                        {/* Expand Arrow */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 text-[#4E6793] transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {/* Expanded Items */}
                    {isExpanded && (
                      <div className="border-t border-[#2B3D5F]">
                        {/* Status Badge */}
                        <div className="px-4 pt-3 pb-2 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-medium px-3 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                            Completed
                          </span>
                          <span className="text-xs text-[#4E6793]">
                            Cash on Delivery
                          </span>
                        </div>

                        {/* Items List */}
                        <div className="px-4 pb-4 space-y-3">
                          {order.items?.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 bg-[#0F1420] rounded-xl p-3"
                            >
                              {/* Product Image */}
                              <div className="w-14 h-14 bg-[#2B3D5F] rounded-lg overflow-hidden flex-shrink-0">
                                {item.product_image ? (
                                  <img
                                    src={
                                      item.product_image.startsWith("http")
                                        ? item.product_image
                                        : `${BASEURL}${item.product_image}`
                                    }
                                    alt={item.product_name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#4E6793]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                  </div>
                                )}
                              </div>

                              {/* Item Details */}
                              <div className="flex-1 min-w-0">
                                <p className="text-[#E5E7EB] text-sm font-medium truncate">
                                  {item.product_name}
                                </p>
                                <p className="text-[#4E6793] text-xs mt-0.5">
                                  Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                                </p>
                              </div>

                              {/* Item Total */}
                              <p className="text-[#E5E7EB] text-sm font-semibold flex-shrink-0">
                                ${(item.quantity * parseFloat(item.price)).toFixed(2)}
                              </p>
                            </div>
                          ))}

                          {/* Order Total Row */}
                          <div className="flex items-center justify-between pt-2 border-t border-[#2B3D5F]">
                            <span className="text-[#4E6793] text-sm">Total</span>
                            <span className="text-[#E5E7EB] text-base font-bold">
                              ${parseFloat(order.total_amount).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Continue Shopping */}
            <div className="mt-6 mb-4">
              <button
                onClick={() => navigate("/")}
                className="w-full bg-[#2B3D5F] text-[#E5E7EB] py-3.5 rounded-xl text-sm font-semibold hover:bg-[#4E6793] transition-colors border border-[#4E6793]/30"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default OrderHistory;
