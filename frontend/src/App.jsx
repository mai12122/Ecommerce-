import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetails";
import NavBar from "./components/NavBar";
import BottomNav from "./components/BottomNav";
import CartPage from "./pages/CartPage";
import ShopPage from "./pages/ShopPage";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/signin" replace />;
}

function AppContent() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const authPages = ["/signin", "/signup"];
  const isAuthPage = authPages.includes(location.pathname);
  const hideNavbar = isAuthPage || location.pathname === "/" || location.pathname.startsWith("/products/") || location.pathname === "/wishlist" || location.pathname === "/profile";
  return (
    <>
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