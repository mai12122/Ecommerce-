import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const COLORS = {
  bgDarkest: "#0F1420",    // Main page background
  bgPrimary: "#19233C",    // Header/card backgrounds
  bgSecondary: "#2B3D5F",  // Inactive buttons/cards
  bgAccent: "#4E6793",     // Primary buttons/hover states
  textLight: "#E5E7EB",    // Primary text on dark backgrounds
  textMuted: "#4E6793",    // Secondary text
  border: "#2B3D5F",       // Borders
};

function WishlistPage() {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, addToCart, cartItems } = useCart();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Handler functions
  const handleBack = () => navigate(-1);
  const handleExplore = () => navigate("/");
  const handleAddToBag = (product) => addToCart(product.id);
  const handleRemove = (productId) => removeFromWishlist(productId);

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  // Empty state
  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0F1420] pb-24">
        {/* Header */}
        <div className="bg-[#19233C] sticky top-0 z-40 flex items-center justify-between px-4 py-4 border-b border-[#2B3D5F]">
          <button onClick={handleBack} className="p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-[#E5E7EB]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-[#E5E7EB]">Wishlist</h1>
          <Link to="/cart" className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[#E5E7EB]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center px-8 pt-24">
          {/* Heart Icon */}
          <div className="w-24 h-24 bg-[#19233C] rounded-full flex items-center justify-center mb-6 border border-[#2B3D5F]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-[#4E6793]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-[#E5E7EB] mb-2">
            My Wishlist is Empty!
          </h2>
          <p className="text-[#4E6793] text-sm text-center mb-6">
            Tap heart button to start saving<br />your favorite items.
          </p>
          <button
            onClick={handleExplore}
            className="bg-[#4E6793] text-white px-10 py-3 rounded-xl text-sm font-semibold hover:bg-[#4E6793]/90 transition-colors shadow-lg shadow-[#4E6793]/25"
          >
            Explore
          </button>
        </div>
      </div>
    );
  }

  // Wishlist items
  return (
    <div className="min-h-screen bg-[#0F1420] pb-24">
      {/* Header */}
      <div className="bg-[#19233C] sticky top-0 z-40 flex items-center justify-between px-4 py-4 border-b border-[#2B3D5F]">
        <button onClick={handleBack} className="p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-[#E5E7EB]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-[#E5E7EB]">Wishlist</h1>
        <Link to="/cart" className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[#E5E7EB]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
            />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* Wishlist Items */}
      <div className="flex flex-col gap-3 px-4 pt-4">
        {wishlistItems.map((product) => (
          <div
            key={product.id}
            className="bg-[#19233C] rounded-2xl overflow-hidden border border-[#2B3D5F] flex items-stretch"
          >
            {/* Product Image */}
            <div className="w-28 h-28 shrink-0 bg-[#2B3D5F] rounded-2xl m-3 flex items-center justify-center overflow-hidden">
              <img
                src={`${BASEURL}${product.image}`}
                alt={product.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 py-3 pr-4 flex flex-col justify-center">
              <h3 className="text-base font-semibold text-[#E5E7EB] leading-tight">
                {product.name}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-[#4E6793]">Review (</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-yellow-500 fill-yellow-500"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="text-xs text-[#4E6793]">4.8 )</span>
              </div>
              <p className="text-lg font-bold text-[#E5E7EB] mt-1">
                ${product.price}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  onClick={() => handleAddToBag(product)}
                  className="bg-[#4E6793] text-white text-xs font-medium px-4 py-1.5 rounded-full hover:bg-[#4E6793]/90 transition-colors"
                >
                  Add to Bag
                </button>
                <button
                  onClick={() => handleRemove(product.id)}
                  className="text-[#4E6793] hover:text-red-400 transition-colors p-1"
                  aria-label="Remove from wishlist"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WishlistPage;