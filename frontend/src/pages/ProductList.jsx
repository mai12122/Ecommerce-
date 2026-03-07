import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    useEffect(() => {
    Promise.all([
      fetch(`${BASEURL}/api/products/`).then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      }),
      fetch(`${BASEURL}/api/categories/`).then(res => {
        if (!res.ok) throw new Error('Failed to fetch categories');
        return res.json();
      })
    ])
    .then(([productsData, categoriesData]) => {
      setProducts(productsData);
      setCategories(categoriesData);
      setLoading(false);
    })
    .catch((error) => {
      setError(error.message);
      setLoading(false);
    });
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category?.name === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <div className="text-center mt-10">Loading products...</div>;
  } 
  if (error) {
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  }
  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
        {/* Dark Header */}
        <div className="bg-[#1e2a3a] pt-6 pb-4 px-5">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-white text-2xl font-bold">GenZ</h1>
                <Link to="/cart" className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                </Link>
            </div>
            <h2 className="text-white text-lg font-medium mb-3">Discover</h2>
            {/* Search Bar */}
            <div className="flex items-center bg-white rounded-full px-4 py-2.5 gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
            </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-3 px-5 py-4 overflow-x-auto no-scrollbar">
            <button
                onClick={() => setSelectedCategory("All")}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === "All"
                        ? "bg-white text-[#1e2a3a] border-2 border-[#1e2a3a]"
                        : "bg-[#1e2a3a] text-white"
                }`}
            >
                All
            </button>
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === cat.name
                            ? "bg-white text-[#1e2a3a] border-2 border-[#1e2a3a]"
                            : "bg-[#1e2a3a] text-white"
                    }`}
                >
                    {cat.name}
                </button>
            ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4 gap-4">
            {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))
            ) : (
                <p className="col-span-full text-center text-gray-500 py-10">No products found.</p>
            )}
        </div>
    </div>
  )
} 
export default ProductList;