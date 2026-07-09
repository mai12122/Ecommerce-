import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetails";
import NavBar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import CartPage from "./pages/CartPage";
import ShopPage from "./pages/ShopPage";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import OrderHistory from "./pages/orderhistory";
import AddressPage from "./pages/addressPage";
import BillPage from "./pages/billPage";
import LanguagePage from "./pages/languagePage";
import ExchangeRatePage from "./pages/exchangeRatePage";
import FeedbackPage from "./pages/feedbackPage";
import ConversionPage from "./pages/conversionPage";
import WalletPage from "./pages/walletPage";
import CouponsPage from "./pages/couponsPage";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/signin" replace />;
}

function AppContent() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [showSigninMessage, setShowSigninMessage] = useState(() => Boolean(location.state?.showSigninSuccess));
  const authPages = ["/signin", "/signup"];
  const isAuthPage = authPages.includes(location.pathname);
  const hideNavbar = isAuthPage || 
    location.pathname === "/" || 
    location.pathname.startsWith("/products/") || 
    location.pathname === "/wishlist" || 
    location.pathname === "/profile" || 
    location.pathname === "/cart" || 
    location.pathname === "/checkout" || 
    location.pathname === "/shop" || 
    location.pathname === "/orders" ||
    location.pathname === "/address" ||
    location.pathname === "/bill" ||
    location.pathname === "/language" ||
    location.pathname === "/exchange-rate" ||
    location.pathname === "/feedback" ||
    location.pathname === "/conversion" ||
    location.pathname === "/wallet" ||
    location.pathname === "/coupons";

  useEffect(() => {
    if (!location.state?.showSigninSuccess) {
      return undefined;
    }

    globalThis.history.replaceState({}, document.title, globalThis.location.pathname + globalThis.location.search);
    const timer = window.setTimeout(() => setShowSigninMessage(false), 4500);
    return () => window.clearTimeout(timer);
  }, [location.state?.showSigninSuccess]);

  return (
    <>
      {showSigninMessage && (
        <div className="fixed left-1/2 top-5 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-2xl bg-emerald-500/95 px-5 py-3 text-center text-sm font-semibold text-white shadow-xl shadow-emerald-900/20">
          Signed in successfully. Welcome back!
        </div>
      )}
      {!hideNavbar && <NavBar />}
      <Routes>
        <Route path="/signin" element={isAuthenticated ? <Navigate to="/" replace /> : <SignInPage />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <SignUpPage />} />
        <Route path="/" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
        <Route path="/shop" element={<ProtectedRoute><ShopPage /></ProtectedRoute>} />
        <Route path="/products/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
        <Route path="/address" element={<ProtectedRoute><AddressPage /></ProtectedRoute>} />
        <Route path="/bill" element={<ProtectedRoute><BillPage /></ProtectedRoute>} />
        <Route path="/language" element={<ProtectedRoute><LanguagePage /></ProtectedRoute>} />
        <Route path="/exchange-rate" element={<ProtectedRoute><ExchangeRatePage /></ProtectedRoute>} />
        <Route path="/feedback" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
        <Route path="/conversion" element={<ProtectedRoute><ConversionPage /></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
        <Route path="/coupons" element={<ProtectedRoute><CouponsPage /></ProtectedRoute>} />
      </Routes>
      {!isAuthPage && <BottomNav />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App;