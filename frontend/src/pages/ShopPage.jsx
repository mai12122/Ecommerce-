import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import GenZLogo from "../assets/GenZlogo.png";
import womanClothes from "../assets/womanclothes.jpg";
import manClothes from "../assets/manclothes.jpg";
import kidsClothes from "../assets/kidsclothes.jpg";
import accessories from "../assets/ascessories.jpg";

const CATEGORY_IMAGES = {
  Women: womanClothes,
  Man: manClothes,
  Kids: kidsClothes,
  Accessories: accessories,
};

function ShopPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    Promise.all([
      fetch(`${BASEURL}/api/categories/`).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      }),
      fetch(`${BASEURL}/api/products/`).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      }),
    ])
      .then(([categoriesData, productsData]) => {
        setCategories(categoriesData);
        setProducts(productsData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getCategoryImage = (categoryName) => {
    return CATEGORY_IMAGES[categoryName] || null;
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-white`}>
        <div className="animate-pulse flex flex-col items-center">
          <div className={`h-4 w-32 mb-4 rounded bg-gray-200`}></div>
          <div className={`h-2 w-48 rounded bg-gray-200`}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-white`}>
        <div className="text-center p-6 rounded-lg border border-red-200 bg-red-50">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white pb-20`}>
      {/* Header */}
      <header className="bg-black sticky top-0 z-40 border-b border-gray-800">
        <div className="px-4 md:px-5 py-2.5 md:py-3 flex justify-between items-center gap-3">
          <h1 className="text-lg md:text-xl font-bold text-white tracking-tight">GENZ</h1>
          <Link to="/cart" className="relative text-white hover:text-gray-400 transition-colors flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Category Grid */}
      <div className="px-3 md:px-4 py-4 md:py-6">
        <h2 className="text-xl md:text-2xl font-bold text-black mb-4 md:mb-6">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
          {categories.map((cat) => {
            const image = getCategoryImage(cat.name);
            return (
              <Link
                key={cat.id}
                to={`/?category=${encodeURIComponent(cat.name)}`}
                className="group relative overflow-hidden rounded-lg transition-all hover:shadow-md"
              >
                <div className="h-40 md:h-48 w-full bg-gray-200 overflow-hidden relative">
                  {image ? (
                    <>
                      <img
                        src={image}
                        alt={cat.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                    </>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center opacity-30">
                      <span className="text-4xl md:text-5xl">👕</span>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 flex items-end p-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-wide uppercase">
                      {cat.name}
                    </h3>
                    <p className="text-gray-200 text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Shop Now
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ShopPage;