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

  const clothingSizes = ['S', 'M', 'L', 'XL', '2XL'];
  const shoeSizes = Array.from({ length: 8 }, (_, i) => i + 35); 

  const categoryName = product?.category?.name?.toLowerCase() || '';
  const categorySlug = product?.category?.slug?.toLowerCase() || '';
  const isShoeCategory = ['shoe', 'footwear', 'sneaker', 'sandal', 'boot'].some(
    (term) => categoryName.includes(term) || categorySlug.includes(term)
  );
  const sizes = isShoeCategory ? shoeSizes : clothingSizes;

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
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-[#4E6793] text-sm font-medium">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <p className="text-red-500 text-sm">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-[#4E6793] text-sm font-medium">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24 md:pb-8">
      {/* Image Section */}
      <div className="relative bg-[#F8FAFC]">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-[50vh] md:h-[55vh] object-cover" 
        />
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 bg-white rounded-full p-3 shadow-md border border-[#E5E7EB] hover:bg-[#F8FAFC] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#2B3D5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Wishlist Button */}
        <button 
          onClick={() => isWishlisted(product.id) ? removeFromWishlist(product.id) : addToWishlist(product)}
          className={`absolute top-5 right-5 rounded-full p-3 shadow-md border transition-colors ${
            isWishlisted(product.id) 
              ? 'bg-[#4E6793] border-[#4E6793]' 
              : 'bg-white border-[#E5E7EB] hover:bg-[#F8FAFC]'
          }`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 ${isWishlisted(product.id) ? 'text-white fill-white' : 'text-[#2B3D5F]'}`} 
            fill={isWishlisted(product.id) ? 'currentColor' : 'none'} 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <div className="px-5 pt-6">
        {/* Category Badge */}
        <span className="inline-block px-3 py-1 bg-[#F1F5F9] rounded-full text-xs font-medium text-[#4E6793] mb-3">
          {product.category?.name || 'Uncategorized'}
        </span>

        {/* Title & Price */}
        <div className="flex items-start justify-between mb-3">
          <h1 className="text-xl md:text-2xl font-bold text-[#0F1420] leading-tight">{product.name}</h1>
          <p className="text-xl font-bold text-[#4E6793]">${product.price}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg 
                key={star} 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 ${star <= 4 ? 'text-[#4E6793] fill-[#4E6793]' : 'text-[#E5E7EB] fill-[#E5E7EB]'}`} 
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-[#2B3D5F]">4.5 (20 Reviews)</span>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#E5E7EB] mb-6" />

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-[#4E6793] mb-3 uppercase tracking-wider">Description</h2>
          <p className="text-sm text-[#2B3D5F] leading-relaxed">
            {product.description || "No description available for this product."}
          </p>
        </div>

        {/* Size Selection */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-[#4E6793] uppercase tracking-wider">Size</h2>
            <button className="text-xs text-[#4E6793] underline hover:text-[#2B3D5F] transition-colors">
              Size Guide
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`min-w-12 h-12 rounded-xl border text-sm font-medium flex items-center justify-center transition-all ${
                  selectedSize === size
                    ? 'bg-[#4E6793] border-[#4E6793] text-white shadow-lg shadow-[#4E6793]/25'
                    : 'bg-white border-[#E5E7EB] text-[#2B3D5F] hover:border-[#4E6793] hover:text-[#4E6793]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            className="flex-1 bg-[#4E6793] text-white py-4 rounded-xl text-base font-semibold hover:bg-[#4E6793]/90 transition-colors shadow-lg shadow-[#4E6793]/20 flex items-center justify-center gap-2"
            onClick={() => addToCart(product.id)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add to Cart
          </button>
          <button 
            className="w-14 h-14 bg-[#F8FAFC] rounded-xl flex items-center justify-center shrink-0 border border-[#E5E7EB] hover:border-[#4E6793] hover:bg-[#F1F5F9] transition-colors"
            onClick={() => addToCart(product.id)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#2B3D5F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;