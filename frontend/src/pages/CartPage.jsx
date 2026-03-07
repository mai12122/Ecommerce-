import { useCart } from '../context/CartContext';

function CartPage() {
    const { cartItems, total, removeFromCart, updateQuantity } = useCart();
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const shipping = cartItems.length > 0 ? 15.00 : 0;

    return (
        <div className='pt-20 pb-24 md:pb-8 min-h-screen bg-gray-50 px-4'>
            <h1 className='text-2xl font-bold mb-5 text-center'>Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <p className='text-center text-gray-500'>Your cart is empty.</p>
            ) : (
                <div className='max-w-lg mx-auto'>
                    {/* Cart Items */}
                    <div className='flex flex-col gap-4 mb-6'>
                        {cartItems.map((item) => (
                            <div key={item.id} className='bg-white rounded-2xl p-4 shadow-sm'>
                                <div className='flex items-center gap-4'>
                                    <img
                                        src={item.product_image}
                                        alt={item.product_name}
                                        className='w-20 h-20 object-cover rounded-xl'
                                    />
                                    <div className='flex-1'>
                                        <h2 className='text-sm font-bold text-gray-800'>{item.product_name}</h2>
                                        <p className='text-base font-bold text-gray-900 mt-1'>${item.product_price}</p>
                                    </div>
                                </div>
                                <div className='flex items-center justify-between mt-3'>
                                    <div className='flex items-center bg-gray-100 rounded-full'>
                                        <button
                                            className='w-9 h-9 flex items-center justify-center text-gray-600 text-lg'
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        >
                                            −
                                        </button>
                                        <span className='w-9 h-9 flex items-center justify-center text-sm font-semibold bg-[#1e2a3a] text-white rounded-full'>
                                            {item.quantity}
                                        </span>
                                        <button
                                            className='w-9 h-9 flex items-center justify-center text-gray-600 text-lg'
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        className='text-red-400 hover:text-red-600'
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className='bg-white rounded-2xl p-5 shadow-sm'>
                        <div className='flex justify-between items-center mb-3'>
                            <span className='text-blue-600 font-medium'>Subtotal</span>
                            <span className='text-gray-800 font-medium'>${total.toFixed(2)}</span>
                        </div>
                        <div className='flex justify-between items-center mb-3'>
                            <span className='text-blue-600 font-medium'>Shipping</span>
                            <span className='text-gray-800 font-medium'>${shipping.toFixed(2)}</span>
                        </div>
                        <div className='border-t pt-3 flex justify-between items-center'>
                            <span className='text-gray-900 font-bold text-lg'>Total</span>
                            <span className='text-gray-900 font-bold text-xl'>${(total + shipping).toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Checkout Button */}
                    <button className='w-full mt-5 bg-[#1e2a3a] text-white py-4 rounded-full text-base font-semibold flex items-center justify-center gap-2 hover:bg-[#2a3a4e] transition-colors'>
                        Proceed to Checkout
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}

export default CartPage;