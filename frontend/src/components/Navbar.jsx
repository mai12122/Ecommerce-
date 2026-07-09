import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import NotificationBell from "./NotificationBell";

function Navbar() {
    const { cartItems } = useCart();
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    return (
        <nav className="bg-black shadow-sm px-4 md:px-5 py-2.5 md:py-3 flex justify-between items-center fixed w-full top-0 z-50">
            <Link to="/" className='text-lg md:text-xl font-bold text-white tracking-tight'> 
                GENZ
            </Link>
            <div className="flex items-center gap-2">
                <NotificationBell />
                <Link to="/cart" className="relative text-white hover:text-gray-300 transition-colors flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold text-[10px]">
                            {cartCount}
                        </span>
                    )}
                </Link>
            </div>
        </nav>
    );
}
export default Navbar;