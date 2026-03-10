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

  // Color Palette Definition
  const colors = {
    bgMain: "bg-[#0F1420]",
    cardBase: "bg-[#19233C]",
    cardHover: "hover:bg-[#2B3D5F]",
    accent: "border-[#4E6793]",
    textMain: "text-[#E5E7EB]",
    textMuted: "text-[#4E6793]",
  };

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
      <div className={`min-h-screen flex items-center justify-center ${colors.bgMain}`}>
        <div className="animate-pulse flex flex-col items-center">
          <div className={`h-4 w-32 mb-4 rounded ${colors.cardBase}`}></div>
          <div className={`h-2 w-48 rounded ${colors.cardBase}`}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${colors.bgMain}`}>
        <div className="text-center p-6 rounded-lg border border-red-900/50 bg-red-900/10">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${colors.bgMain} ${colors.textMain} pb-20`}>
      <header className="bg-[#19233C] pt-6 pb-4 px-5">
        <div className="flex justify-between items-center mb-2">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md">
            <img src={GenZLogo} alt="GenZ" className="h-10 w-auto" />
          </div>
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
        <h2 className="text-[#E5E7EB] text-lg font-medium text-center">Shop Categories</h2>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const image = getCategoryImage(cat.name);
            return (
              <Link
                key={cat.id}
                to={`/?category=${encodeURIComponent(cat.name)}`}
                className={`
                  group relative overflow-hidden rounded-2xl 
                  ${colors.cardBase} ${colors.cardHover} 
                  ${colors.accent} border
                  transition-all duration-300 ease-in-out
                  hover:shadow-lg hover:shadow-[#0F1420]/50
                  hover:-translate-y-1
                `}
              >
                <div className="flex flex-col h-full">
                  <div className="h-48 w-full overflow-hidden relative bg-[#0F1420]">
                    {image ? (
                      <>
                        <img
                          src={image}
                          alt={cat.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient from-[#0F1420]/80 to-transparent" />
                      </>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center opacity-20">
                        <span className="text-4xl">📦</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-wide uppercase">
                      {cat.name}
                    </h2>
                    <p className={`text-sm ${colors.textMuted} flex items-center gap-1 group-hover:translate-x-1 transition-transform`}>
                      View Products
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
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