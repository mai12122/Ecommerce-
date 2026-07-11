import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import CategoryModal from "../components/CategoryModal";
import NotificationBell from "../components/NotificationBell";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSigninMessage, setShowSigninMessage] = useState(false);
  const [toast, setToast] = useState(null);
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

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) return;

      try {
        const authToken = user?.token || localStorage.getItem("auth_token");
        const res = await fetch(`${BASEURL}/api/notifications/`, {
          headers: {
            Authorization: authToken ? `Bearer ${authToken}` : undefined,
          },
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const latest = data[0];
          setToast({ title: latest.title, message: latest.message });
          const timer = window.setTimeout(() => setToast(null), 5000);
          return () => window.clearTimeout(timer);
        }
      } catch {
        // Ignore notification fetch errors.
      }
    };

    loadNotifications();
  }, [BASEURL, user]);

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
    return (
      <div className="min-h-screen bg-[#0F1420] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-400 text-sm font-medium">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0F1420] flex flex-col items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 max-w-sm text-center backdrop-blur-xl">
          <p className="text-red-400 text-sm font-medium">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1420] pb-20 md:pb-0 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {toast && (
        <div className="fixed right-4 top-20 z-50 max-w-sm rounded-2xl bg-[#19233C]/90 backdrop-blur-xl border border-white/10 px-4 py-3 shadow-2xl animate-fade-in-down">
          <p className="text-sm font-semibold text-white">{toast.title}</p>
          <p className="mt-1 text-sm text-gray-300">{toast.message}</p>
        </div>
      )}

      {showSigninMessage && (
        <div className="fixed left-1/2 top-5 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-purple-500/30 border border-white/10 animate-fade-in-down">
          Signed in successfully. Welcome back!
        </div>
      )}
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0F1420]/80 backdrop-blur-xl border-b border-white/5 relative">
        <div className="px-4 md:px-6 py-3 md:py-4 flex justify-between items-center gap-3">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tight">GENZ</h1>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <Link to="/cart" className="relative text-gray-300 hover:text-white transition-all duration-300 hover:scale-110 flex-shrink-0 group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform border border-white/20">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 md:px-6 pb-3 md:pb-4">
          <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2.5 gap-3 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 shrink-0"
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
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-sm bg-transparent placeholder-gray-500 text-white"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-4 md:px-6 pb-3 md:pb-4 flex gap-2 overflow-x-auto scrollbar-hide">
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
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 flex-shrink-0 border ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20 border-white/10 scale-105"
                  : "bg-white/5 text-gray-300 hover:bg-white/10 border-white/10 hover:scale-105"
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
      <main className="px-3 md:px-6 py-4 md:py-6 relative z-10">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 md:py-16 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm md:text-base font-medium">
              No products found{selectedCategory !== "All" ? ` in "${selectedCategory}"` : ""}.
            </p>
          </div>
        )}
      </main>

      {/* Custom Styles for Animations */}
      <style>{`
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.5s ease-out;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
}

export default ProductList;