import { NavLink } from "react-router-dom";

function BottomNav() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 shadow-lg z-50 md:hidden">
            <div className="flex justify-around items-center h-14 md:h-16">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center gap-0.5 text-[10px] md:text-xs transition-colors flex-1 h-full ${isActive ? 'text-white' : 'text-gray-400 hover:text-gray-300'}`
                    }
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
                    </svg>
                    <span>Home</span>
                </NavLink>

                <NavLink
                    to="/shop"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center gap-0.5 text-[10px] md:text-xs transition-colors flex-1 h-full ${isActive ? 'text-white' : 'text-gray-400 hover:text-gray-300'}`
                    }
                >
                    {/* 3 Horizontal Lines (Hamburger Menu) Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span>Menu</span>
                </NavLink>

                <NavLink
                    to="/wishlist"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center gap-0.5 text-[10px] md:text-xs relative transition-colors flex-1 h-full ${isActive ? 'text-white' : 'text-gray-400 hover:text-gray-300'}`
                    }
                >
                    <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <span>Wishlist</span>
                </NavLink>

                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center gap-0.5 text-[10px] md:text-xs transition-colors flex-1 h-full ${isActive ? 'text-white' : 'text-gray-400 hover:text-gray-300'}`
                    }
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Me</span>
                </NavLink>
            </div>
        </nav>
    );
}

export default BottomNav;