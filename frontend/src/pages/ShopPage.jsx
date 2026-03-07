import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ShopPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  const bgColors = [
    'bg-gray-100', 'bg-amber-50', 'bg-emerald-50', 'bg-rose-50',
    'bg-sky-50', 'bg-violet-50', 'bg-orange-50', 'bg-teal-50'
  ];

  useEffect(() => {
    Promise.all([
      fetch(`${BASEURL}/api/categories/`).then(res => {
        if (!res.ok) throw new Error('Failed to fetch categories');
        return res.json();
      }),
      fetch(`${BASEURL}/api/products/`).then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
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
    const product = products.find(p => p.category?.name === categoryName && p.image);
    return product ? `${BASEURL}${product.image}` : null;
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }
  if (error) {
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-white pt-16 pb-20 md:pb-0">
      {/* Category Cards */}
      <div className="flex flex-col gap-3 px-4 pt-4">
        {categories.map((cat, index) => {
          const image = getCategoryImage(cat.name);
          return (
            <Link
              key={cat.id}
              to={`/?category=${encodeURIComponent(cat.name)}`}
              className={`${bgColors[index % bgColors.length]} rounded-2xl overflow-hidden flex items-center justify-between h-40 relative`}
            >
              <h2 className="text-2xl font-extrabold text-gray-900 uppercase pl-6 z-10">
                {cat.name}
              </h2>
              {image && (
                <img
                  src={image}
                  alt={cat.name}
                  className="h-full w-1/2 object-cover object-center"
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default ShopPage;
