import { Link } from "react-router-dom";
import { useState } from "react";

function ShopProductCard({ product, listView }) {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const [wishlisted, setWishlisted] = useState(false);

  if (listView) {
    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex gap-4 p-3 relative">
        <button
          onClick={(e) => {
            e.preventDefault();
            setWishlisted(!wishlisted);
          }}
          className="absolute top-3 right-3 z-10 bg-white rounded-full p-1.5 shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${wishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} fill={wishlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <Link to={`/products/${product.id}`} className="flex gap-4 w-full">
          <img src={`${BASEURL}${product.image}`} alt={product.name} className="w-28 h-28 object-cover rounded-xl shrink-0" />
          <div className="flex flex-col justify-center">
            <h2 className="text-sm font-bold text-gray-800">{product.name}</h2>
            <div className="flex items-center gap-1 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-xs text-gray-500">4.5 (128)</span>
            </div>
            <p className="text-lg font-bold text-gray-900 mt-1">${product.price}</p>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden relative">
      <button
        onClick={(e) => {
          e.preventDefault();
          setWishlisted(!wishlisted);
        }}
        className="absolute top-3 right-3 z-10 bg-white rounded-full p-1.5 shadow-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${wishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} fill={wishlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <Link to={`/products/${product.id}`}>
        <div className="p-3">
          <img src={`${BASEURL}${product.image}`} alt={product.name} className="w-full h-40 object-cover rounded-xl" />
        </div>
        <div className="px-3 pb-4">
          <h2 className="text-sm font-bold text-gray-800 truncate">{product.name}</h2>
          <div className="flex items-center gap-1 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-xs text-gray-500">4.5 (128)</span>
          </div>
          <p className="text-lg font-bold text-gray-900 mt-1">${product.price}</p>
        </div>
      </Link>
    </div>
  );
}

export default ShopProductCard;
