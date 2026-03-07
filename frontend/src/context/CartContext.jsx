import { createContext, useContext, useState, useEffect} from "react";
const CartContext = createContext();
export const CartProvider = ({ children }) => {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [wishlistItems, setWishlistItems] = useState([]);

    const addToWishlist = (product) => {
        setWishlistItems(prev => {
            if (prev.find(item => item.id === product.id)) return prev;
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
     const fetchCart = async () => {
    try {
        const res = await fetch(`${BASEURL}/api/cart/`);

        if (!res.ok) {
            throw new Error('Failed to fetch cart');
        }

        const data = await res.json();
        setCartItems(data.items || []);
        setTotal(data.total || 0);

    } catch (error) {
        console.error('Error fetching cart:', error);
    }
    };
    useEffect(() => {
        fetchCart();
    }, []);
    const addToCart = async (product) => {
        try {
            await fetch(`${BASEURL}/api/cart/add/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },                
                body: JSON.stringify({ product_id: product }),
            });
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
        try {
            await fetch(`${BASEURL}/api/cart/remove/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ item_id: itemId }),
            });
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
                await fetch(`${BASEURL}/api/cart/update/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ item_id: itemId, quantity }),
                });

                fetchCart();
            } catch (error) { 
                console.error('Error updating cart quantity:', error);
            }
        };
    const clearCart = () => {
        setCartItems([]);
        setTotal(0);
    };

    return (
        <CartContext.Provider value={{ cartItems, total, addToCart, removeFromCart, updateQuantity, clearCart, wishlistItems, addToWishlist, removeFromWishlist, isWishlisted }}>
            {children}
        </CartContext.Provider>
    );
};
export const useCart = () => useContext(CartContext);