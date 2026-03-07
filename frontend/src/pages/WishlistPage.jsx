import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';

function WishlistPage() {
    const { wishlistItems, removeFromWishlist, addToCart, cartItems } = useCart();
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const navigate = useNavigate();
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const handleAddToBag = (product) => {
        addToCart(product.id);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-white sticky top-0 z-40 flex items-center justify-between px-4 py-4 border-b border-gray-100">
                <button onClick={() => navigate(-1)} className="p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-lg font-semibold text-gray-900">Wishlist</h1>
                <Link to="/cart" className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                </Link>
            </div>

            {wishlistItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-8 pt-24">
                    {/* Empty box illustration */}
                    <svg className="w-52 h-52 mb-6" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Box body */}
                        <path d="M40 90 L100 120 L160 90 L160 150 L100 180 L40 150 Z" fill="#f5f5f5" stroke="#222" strokeWidth="2.5"/>
                        {/* Box lid left */}
                        <path d="M40 90 L100 60 L100 120 L40 90Z" fill="#e8e8e8" stroke="#222" strokeWidth="2.5"/>
                        {/* Box lid right */}
                        <path d="M160 90 L100 60 L100 120 L160 90Z" fill="#fff" stroke="#222" strokeWidth="2.5"/>
                        {/* Flap left */}
                        <path d="M40 90 L25 75 L85 45 L100 60Z" fill="#f0f0f0" stroke="#222" strokeWidth="2.5"/>
                        {/* Flap right */}
                        <path d="M160 90 L175 75 L115 45 L100 60Z" fill="#fafafa" stroke="#222" strokeWidth="2.5"/>
                        <ellipse cx="90" cy="95" rx="12" ry="8" fill="#222"/>
                        <circle cx="85" cy="72" r="10" fill="#222"/>
                        <path d="M75 100 L55 130" stroke="#222" strokeWidth="4" strokeLinecap="round"/>
                        {/* Leg right */}
                        <path d="M95 102 L105 130" stroke="#222" strokeWidth="4" strokeLinecap="round"/>
                        {/* Shoe left */}
                        <path d="M55 130 L45 132 L48 126" fill="#222"/>
                        {/* Shoe right */}
                        <path d="M105 130 L115 132 L112 126" fill="#222"/>
                        {/* Arm */}
                        <path d="M78 88 L50 100" stroke="#222" strokeWidth="3.5" strokeLinecap="round"/>
                        {/* Small crumpled papers */}
                        <circle cx="145" cy="162" r="4" fill="#ddd" stroke="#bbb" strokeWidth="1"/>
                        <circle cx="155" cy="168" r="3" fill="#e5e5e5" stroke="#ccc" strokeWidth="1"/>
                        <circle cx="138" cy="170" r="3.5" fill="#ddd" stroke="#bbb" strokeWidth="1"/>
                    </svg>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">My Wishlist is Empty!</h2>
                    <p className="text-gray-400 text-sm text-center mb-6">
                        Tap heart button to start saving<br/>your favorite items.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gray-900 text-white px-10 py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
                    >
                        Explore
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-3 px-4 pt-4">
                    {wishlistItems.map((product) => (
                        <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm flex items-stretch">
                            {/* Product Image */}
                            <div className="w-28 h-28 shrink-0 bg-gray-100 rounded-2xl m-3 flex items-center justify-center overflow-hidden">
                                <img
                                    src={`${BASEURL}${product.image}`}
                                    alt={product.name}
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 py-3 pr-4 flex flex-col justify-center">
                                <h3 className="text-base font-semibold text-gray-900 leading-tight">{product.name}</h3>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="text-xs text-gray-500">Review (</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-500 fill-yellow-500" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                    <span className="text-xs text-gray-500">4.8 )</span>
                                </div>
                                <p className="text-lg font-bold text-gray-900 mt-1">${product.price}</p>
                                <button
                                    onClick={() => handleAddToBag(product)}
                                    className="mt-2 bg-gray-900 text-white text-xs font-medium px-4 py-1.5 rounded-full self-start hover:bg-gray-800 transition-colors"
                                >
                                    Add to Bag
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default WishlistPage;
