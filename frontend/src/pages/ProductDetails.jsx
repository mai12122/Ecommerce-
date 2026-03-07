import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const { addToCart, addToWishlist, removeFromWishlist, isWishlisted } = useCart();
  const sizes = [8, 10, 38, 40];

  useEffect(() => {
    fetch(`${BASEURL}/api/products/${id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        return response.json();
      })
        .then((data) => {  
            setProduct(data);
            setLoading(false);
        })
        .catch((error) => {
            setError(error.message);
            setLoading(false);
        }); 
        }, [id]); 
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }
    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
    }
    if (!product) {
        return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
    }
    return (
        <div className="min-h-screen bg-white pb-24 md:pb-8">
            {/* Product Image Section */}
            <div className="relative">
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-[45vh] object-cover" 
                />
                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)}
                    className="absolute top-12 left-4 bg-white rounded-full p-2.5 shadow-md"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                {/* Wishlist Button */}
                <button 
                    onClick={() => isWishlisted(product.id) ? removeFromWishlist(product.id) : addToWishlist(product)}
                    className={`absolute top-12 right-4 rounded-full p-2.5 shadow-md ${isWishlisted(product.id) ? 'bg-red-500' : 'bg-white'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isWishlisted(product.id) ? 'text-white fill-white' : 'text-red-400'}`} fill={isWishlisted(product.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>

            {/* Product Info */}
            <div className="px-5 pt-5">
                {/* Name & Price */}
                <div className="flex items-start justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                    <p className="text-xl font-bold text-purple-600">${product.price}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-sm text-gray-600">4.5 ( 20 Review )</span>
                </div>

                {/* Description */}
                <div className="mt-5">
                    <h2 className="text-base font-bold text-gray-900 mb-2">Description</h2>
                    <p className="text-sm text-gray-500 leading-relaxed italic">
                        {product.description || "No description available for this product."}
                    </p>
                </div>

                {/* Size */}
                <div className="mt-5">
                    <h2 className="text-base font-bold text-gray-900 mb-3">Size</h2>
                    <div className="flex gap-3">
                        {sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`w-11 h-11 rounded-full border-2 text-sm font-medium flex items-center justify-center transition-colors ${
                                    selectedSize === size
                                        ? 'border-purple-600 text-purple-600 bg-purple-50'
                                        : 'border-gray-300 text-gray-600'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-8">
                    <button 
                        className="flex-1 bg-purple-600 text-white py-3.5 rounded-full text-base font-semibold hover:bg-purple-700 transition-colors"
                        onClick={() => addToCart(product.id)}
                    >
                        Add to Cart
                    </button>
                    <button 
                        className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center shrink-0"
                        onClick={() => addToCart(product.id)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}
export default ProductDetail;