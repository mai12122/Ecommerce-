import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import GenZLogo from "../assets/GenZlogo.png";

const COLORS = {
  bgDarkest: "#0F1420",    // Main page background
  bgPrimary: "#19233C",    // Header background
  bgSecondary: "#2B3D5F",  // Inactive buttons/cards
  bgAccent: "#4E6793",     // Hover/active states
  textLight: "#E5E7EB",    // Primary text on dark backgrounds
};

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const { cartItems } = useCart();
  const { user } = useAuth();
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Fetch products and categories on mount
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

  // Filter logic extracted for clarity
  const isProductVisible = (product) => {
    const matchesCategory = selectedCategory === "All" || product.category?.name === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  };

  const filteredProducts = products.filter(isProductVisible);

  // Loading state
  if (loading) {
    return <div className="text-center mt-10 text-[#E5E7EB]">Loading products...</div>;
  }

  // Error state
  if (error) {
    return <div className="text-center mt-10 text-red-400">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#0F1420] pb-20 md:pb-0">
      {/* Header: Logo, Cart & Search */}
      <header className="bg-[#19233C] pt-6 pb-4 px-5">
        <div className="flex justify-between items-center mb-4">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md">
            <img src={GenZLogo} alt="GenZ" className="h-10 w-auto" />
          </div>
          <Link to="/cart" className="relative">
            {/* Cart Icon */}
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

        <h2 className="text-[#E5E7EB] text-lg font-medium mb-3">
          {user ? `Welcome, ${user.name.split(" ")[0]}!` : "Discover"}
        </h2>

        {/* Search Bar */}
        <div className="flex items-center bg-[#E5E7EB] rounded-full px-4 py-2.5 gap-3">
          {/* Search Icon */}
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
            className="flex-1 outline-none text-sm text-[#0F1420] bg-transparent placeholder-gray-500"
          />
          {/* Filter Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </div>
      </header>

      {/* Category Filter Buttons */}
      <nav className="flex gap-3 px-5 py-4 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedCategory === "All"
              ? `bg-[#E5E7EB] text-[#19233C] border-2 border-[#19233C]`
              : `bg-[#2B3D5F] text-[#E5E7EB] hover:bg-[#4E6793]`
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.name)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category.name
                ? `bg-[#E5E7EB] text-[#19233C] border-2 border-[#19233C]`
                : `bg-[#2B3D5F] text-[#E5E7EB] hover:bg-[#4E6793]`
            }`}
          >
            {category.name}
          </button>
        ))}
      </nav>

      {/* Product Grid */}
      <main className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-[#E5E7EB] py-10">
            No products found.
          </p>
        )}
      </main>
    </div>
  );
}

export default ProductList;