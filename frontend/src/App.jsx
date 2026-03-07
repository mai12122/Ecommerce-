import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetails";
import NavBar from "./components/NavBar";
import BottomNav from "./components/BottomNav";
import CartPage from "./pages/CartPage";
import ShopPage from "./pages/ShopPage";
import WishlistPage from "./pages/WishlistPage";

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/" || location.pathname.startsWith("/products/") || location.pathname === "/wishlist";
  return (
    <>
      {!hideNavbar && <NavBar />}
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>
      <BottomNav />
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