/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext.jsx";
const CartContext = createContext();
export const CartProvider = ({ children }) => {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL || "http://127.0.0.1:8000";
    const { token } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [wishlistItems, setWishlistItems] = useState([]);

    const addToWishlist = (product) => {
        setWishlistItems(prev => {
            if (prev.some(item => item.id === product.id)) return prev;
            return [...prev, product];
        });
    };

    const removeFromWishlist = (productId) => {
        setWishlistItems(prev => prev.filter(item => item.id !== productId));
    };

    const isWishlisted = (productId) => {
        return wishlistItems.some(item => item.id === productId);
    };

    // Fetch Cart from backend 
     const getAuthHeaders = useCallback(() => {
        return token ? { Authorization: `Token ${token}` } : {};
    }, [token]);

    const fetchCart = useCallback(async () => {
        if (!token) {
            setCartItems([]);
            setTotal(0);
            return;
        }

        try {
            const res = await fetch(`${BASEURL}/api/cart/`, {
                headers: getAuthHeaders(),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to fetch cart: ${res.status} ${errorText}`);
            }

            const data = await res.json();
            setCartItems(data.items || []);
            setTotal(data.total || 0);

        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    }, [token, BASEURL]);
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);
    const addToCart = async (product) => {
        if (!token) {
            console.warn('Unable to add to cart: user is not authenticated.');
            return;
        }

        try {
            const res = await fetch(`${BASEURL}/api/cart/add/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders(),
                },
                body: JSON.stringify({ product_id: product }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Add to cart failed: ${res.status} ${errorText}`);
            }

            fetchCart();
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };
    // Add Product to Cart
    // const addToCart = (product) => {
    //     const existingItem = cartItems.find(item => item.product.id === product.id);
    //     if (existingItem) {
    //         setCartItems(cartItems.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    //     } else {
    //         setCartItems([...cartItems, { product, quantity: 1 }]);
    //     }
    // };

    // Remove Product from Cart
    const removeFromCart = async (itemId) => {
        if (!token) {
            console.warn('Unable to remove from cart: user is not authenticated.');
            return;
        }

        try {
            const res = await fetch(`${BASEURL}/api/cart/remove/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders(),
                },
                body: JSON.stringify({ item_id: itemId }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Remove from cart failed: ${res.status} ${errorText}`);
            }

            fetchCart();
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };
    // update quantity of a product in the cart
        const updateQuantity = async (itemId, quantity) => {
            if (quantity < 1) {
                await removeFromCart(itemId);
                return;
            }

            try {
            if (!token) {
                console.warn('Unable to update cart quantity: user is not authenticated.');
                return;
            }

            const res = await fetch(`${BASEURL}/api/cart/update/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                body: JSON.stringify({ item_id: itemId, quantity }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Update cart quantity failed: ${res.status} ${errorText}`);
            }

            fetchCart();
        } catch (error) { 
            console.error('Error updating cart quantity:', error);
        }
        };
    const clearCart = () => {
        setCartItems([]);
        setTotal(0);
    };

    const value = {
        cartItems,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
export const useCart = () => useContext(CartContext);