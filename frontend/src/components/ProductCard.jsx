import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  
  // Destructured addToCart as well (make sure it exists in your context)
  const { addToWishlist, removeFromWishlist, isWishlisted, addToCart } = useCart();
  const wishlisted = isWishlisted(product.id);

  // Mock data for visual purposes (replace with product.rating / product.reviews)
  const rating = 4.8;
  const reviews = 128; 

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out">
      
      {/* Promotional Badge (Optional) */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        <span className="bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-sm">
          Sale
        </span>
      </div>

      {/* Enhanced Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          wishlisted ? removeFromWishlist(product.id) : addToWishlist(product);
        }}
        className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-md rounded-full p-2 shadow-md hover:scale-110 hover:bg-white transition-all duration-200"
        aria-label="Add to wishlist"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-colors duration-200 ${wishlisted ? 'text-rose-500 fill-rose-500' : 'text-gray-400 fill-transparent'}`}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <Link to={`/products/${product.id}`} className="flex flex-col flex-1">
        
        {/* Product Image Container */}
        <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden">
          <img
            src={`${BASEURL}${product.image}`}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col flex-1 p-4 gap-1.5">
          
          {/* Title */}
          <h2 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h2>
          
          {/* Dynamic Star Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ${i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500 font-medium">({reviews})</span>
          </div>

          {/* Price & Quick Add Button */}
          <div className="flex items-center justify-between mt-auto pt-3">
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold text-gray-900">${product.price}</span>
              {/* <span className="text-xs text-gray-400 line-through">$120.00</span> */}
            </div>
            
            <button 
              type="button"
              className="p-2.5 rounded-full bg-gray-100 text-gray-700 hover:bg-indigo-600 hover:text-white transition-all duration-200 shadow-sm"
              aria-label="Add to cart"
              onClick={(e) => {
                e.preventDefault();
                if (typeof addToCart === 'function') addToCart(product);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;