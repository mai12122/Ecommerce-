import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import CategoryModal from "../components/CategoryModal";
import GenZLogo from "../assets/GenZlogo.png";

const COLORS = {
  bgDarkest: "#0F1420",    
  bgPrimary: "#19233C",    
  bgSecondary: "#2B3D5F", 
  bgAccent: "#4E6793",    
  textLight: "#E5E7EB",  
};

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSigninMessage, setShowSigninMessage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const { cartItems } = useCart();
  const { user } = useAuth();
  const prevUserRef = useRef(undefined);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    if (location.state?.showSigninSuccess) {
      setShowSigninMessage(true);
      globalThis.history.replaceState({}, document.title, globalThis.location.pathname + globalThis.location.search);
      const timer = setTimeout(() => setShowSigninMessage(false), 4500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [location.state]);

  // If the user was just redirected after signing in, open the promo modal.
  useEffect(() => {
    if (showSigninMessage && categories.length > 0) {
      setIsModalOpen(true);
    }
  }, [showSigninMessage, categories.length]);

  // Fallback: if sign-in redirect state was lost (page reload), use a persistent flag
  useEffect(() => {
    try {
      const flag = localStorage.getItem('show_modal_after_signin');
      if (flag === '1' && categories.length > 0) {
        setIsModalOpen(true);
        localStorage.removeItem('show_modal_after_signin');
        setShowSigninMessage(true);
      }
    } catch {
      // ignore storage errors
    }
  }, [categories.length]);

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setSelectedCategory(decodeURIComponent(categoryFromUrl));
    }
  }, [searchParams]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${BASEURL}/api/products/`),
          fetch(`${BASEURL}/api/categories/`),
        ]);

        if (!productsRes.ok) throw new Error("Failed to fetch products");
        if (!categoriesRes.ok) throw new Error("Failed to fetch categories");

        const [productsData, categoriesData] = await Promise.all([
          productsRes.json(),
          categoriesRes.json(),
        ]);

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [BASEURL]);

  // Open the modal only when the user transitions from logged out to logged in.
  useEffect(() => {
    if (prevUserRef.current === undefined) {
      prevUserRef.current = user;
      return;
    }

    const wasAuthenticated = !!prevUserRef.current;
    const isAuthenticated = !!user;

    if (!wasAuthenticated && isAuthenticated && categories.length > 0) {
      setIsModalOpen(true);
    } else if (wasAuthenticated && !isAuthenticated) {
      setIsModalOpen(false);
    }

    prevUserRef.current = user;
  }, [user, categories.length]);

  const isProductVisible = (product) => {
    const matchesCategory = selectedCategory === "All" || product.category?.name === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  };

  const filteredProducts = products.filter(isProductVisible);

  if (loading) {
    return <div className="text-center mt-10 text-[#E5E7EB]">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-400">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      {showSigninMessage && (
        <div className="fixed left-1/2 top-5 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-lg bg-emerald-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-lg">
          Signed in successfully. Welcome back!
        </div>
      )}
      
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

        {/* Search Bar */}
        <div className="px-4 md:px-5 pb-2.5 md:pb-3">
          <div className="flex items-center bg-gray-100 rounded-full px-3 md:px-4 py-2 md:py-2.5 gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 md:h-5 w-4 md:w-5 text-gray-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-sm bg-transparent placeholder-gray-500 text-gray-900"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-4 md:px-5 pb-2.5 md:pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {["All", ...categories.map(cat => cat.name)].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                if (cat === "All") {
                  globalThis.history.replaceState({}, '', globalThis.location.pathname);
                } else {
                  const newParams = new URLSearchParams(globalThis.location.search);
                  newParams.set("category", cat);
                  globalThis.history.replaceState({}, "", `?${newParams.toString()}`);
                }
              }}
              className={`whitespace-nowrap px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors flex-shrink-0 ${
                selectedCategory === cat
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Category Modal - Auto-opens on signin */}
      <CategoryModal
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(categoryName) => {
          setSelectedCategory(categoryName);
          if (categoryName === "All") {
            globalThis.history.replaceState({}, "", globalThis.location.pathname);
          } else {
            const newParams = new URLSearchParams(globalThis.location.search);
            newParams.set("category", categoryName);
            globalThis.history.replaceState({}, "", `?${newParams.toString()}`);
          }
        }}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Products Grid */}
      <main className="px-3 md:px-4 py-4 md:py-6">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 md:py-16">
            <p className="text-gray-500 text-sm md:text-base">
              No products found{selectedCategory !== "All" ? ` in "${selectedCategory}"` : ""}.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProductList;