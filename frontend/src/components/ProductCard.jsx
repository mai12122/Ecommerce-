import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const { addToWishlist, removeFromWishlist, isWishlisted } = useCart();
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="bg-white rounded-lg overflow-hidden relative hover:shadow-md transition-shadow duration-200">
      {/* Wishlist Heart */}
      <button
        onClick={(e) => {
          e.preventDefault();
          wishlisted ? removeFromWishlist(product.id) : addToWishlist(product);
        }}
        className="absolute top-2 md:top-3 right-2 md:right-3 z-10 bg-white rounded-full p-1.5 md:p-2 shadow-sm hover:shadow-md transition-shadow"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-3.5 md:h-4 w-3.5 md:w-4 ${wishlisted ? 'text-red-600 fill-red-600' : 'text-gray-400'}`}
          fill={wishlisted ? 'currentColor' : 'none'}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <Link to={`/products/${product.id}`}>
        {/* Product Image */}
        <div className="w-full h-32 md:h-40 bg-gray-100 overflow-hidden">
          <img
            src={`${BASEURL}${product.image}`}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Product Info */}
        <div className="p-2 md:p-3">
          <h2 className="text-xs md:text-sm font-semibold text-gray-900 truncate">{product.name}</h2>
          <div className="flex items-center gap-1 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 md:h-3.5 w-3 md:w-3.5 text-yellow-500 fill-yellow-500" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-[10px] md:text-xs text-gray-500 font-medium">4.8</span>
          </div>
          <p className="text-base md:text-lg font-bold text-black mt-1.5">${product.price}</p>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;