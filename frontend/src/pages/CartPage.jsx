import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import GenZLogo from '../assets/GenZlogo.png';

function CartPage() {
  const navigate = useNavigate();
  const { cartItems, total, removeFromCart, updateQuantity } = useCart();
  const shipping = cartItems.length > 0 ? 15.00 : 0;

  return (
    <div className="pt-0 pb-24 md:pb-8 min-h-screen bg-[#0a0a0f] px-4">
      <CartHeader itemCount={cartItems.length} onBack={() => navigate(-1)} />

      {cartItems.length === 0 ? (
        <EmptyCart onContinueShopping={() => navigate('/')} />
      ) : (
        <div className="max-w-lg mx-auto">
          <CartItemsList
            items={cartItems}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
          />
          <OrderSummary total={total} shipping={shipping} itemCount={cartItems.length} />
          <PromoCodeInput />
          <CheckoutButton onClick={() => navigate('/checkout')} />
          <TrustBadges />
        </div>
      )}
    </div>
  );
}

const CartHeader = ({ itemCount, onBack }) => (
  <header className="bg-[#19233C] pt-6 pb-4 px-5 -mx-4 mb-6">
    <div className="flex justify-between items-center">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-[#4E6793] hover:text-[#E5E7EB] transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-medium">Back</span>
      </button>
      <p className="text-sm text-[#4E6793]">
        {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
      </p>
      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md">
        <img src={GenZLogo} alt="GenZ" className="h-10 w-auto" />
      </div>
    </div>
  </header>
);

const EmptyCart = ({ onContinueShopping }) => (
  <div className="max-w-sm mx-auto text-center py-16">
    <div className="w-20 h-20 bg-[#1e293b] rounded-full flex items-center justify-center mx-auto mb-4">
      <IconCartEmpty />
    </div>
    <h2 className="text-lg font-semibold text-white mb-2">Your cart is empty</h2>
    <p className="text-sm text-[#94a3b8] mb-6">Looks like you haven't added anything yet.</p>
    <button
      onClick={onContinueShopping}
      className="bg-[#4E6793] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#4E6793]/90 transition-colors shadow-lg shadow-[#4E6793]/30"
    >
      Start Shopping
    </button>
  </div>
);

const CartItemsList = ({ items, onUpdateQuantity, onRemove }) => (
  <div className="flex flex-col gap-3 mb-6">
    {items.map((item) => (
      <CartItem
        key={item.id}
        item={item}
        onUpdateQuantity={onUpdateQuantity}
        onRemove={onRemove}
      />
    ))}
  </div>
);

const CartItem = ({ item, onUpdateQuantity, onRemove }) => (
  <div className="bg-[#1e293b] rounded-2xl p-4 border border-[#334155]">
    <div className="flex items-center gap-4">
      <img
        src={item.product_image}
        alt={item.product_name}
        className="w-20 h-20 object-cover rounded-xl border border-[#334155]"
      />
      <div className="flex-1 min-w-0">
        <h2 className="text-sm font-semibold text-white truncate">{item.product_name}</h2>
        <p className="text-base font-bold text-[#7dd3fc] mt-1">${item.product_price}</p>
        {item.size && <p className="text-xs text-[#94a3b8] mt-1">Size: {item.size}</p>}
      </div>
    </div>

    <div className="flex items-center justify-between mt-4">
      <QuantityControl
        quantity={item.quantity}
        onDecrease={() => onUpdateQuantity(item.id, item.quantity - 1)}
        onIncrease={() => onUpdateQuantity(item.id, item.quantity + 1)}
      />
      <RemoveButton onClick={() => onRemove(item.id)} />
    </div>
  </div>
);

const QuantityControl = ({ quantity, onDecrease, onIncrease }) => (
  <div className="flex items-center bg-[#0f172a] rounded-xl border border-[#334155]">
    <button
      className="w-9 h-9 flex items-center justify-center text-[#7dd3fc] hover:text-[#bae6fd] transition-colors"
      onClick={onDecrease}
      aria-label="Decrease quantity"
    >
      <IconMinus />
    </button>
    <span className="w-10 h-9 flex items-center justify-center text-sm font-semibold text-white">
      {quantity}
    </span>
    <button
      className="w-9 h-9 flex items-center justify-center text-[#7dd3fc] hover:text-[#bae6fd] transition-colors"
      onClick={onIncrease}
      aria-label="Increase quantity"
    >
      <IconPlus />
    </button>
  </div>
);

const RemoveButton = ({ onClick }) => (
  <button
    className="flex items-center gap-1.5 text-[#7dd3fc] hover:text-red-400 transition-colors"
    onClick={onClick}
  >
    <IconTrash />
    <span className="text-xs font-medium">Remove</span>
  </button>
);

const OrderSummary = ({ total, shipping, itemCount }) => (
  <div className="bg-[#1e293b] rounded-2xl p-5 border border-[#334155] mb-5">
    <h3 className="text-sm font-semibold text-white mb-4">Order Summary</h3>
    <div className="space-y-3">
      <SummaryRow label="Subtotal" value={`$${total.toFixed(2)}`} />
      <SummaryRow label="Shipping" value={`$${shipping.toFixed(2)}`} />
      {itemCount > 0 && (
        <SummaryRow label="Discount" value="-$0.00" valueClassName="text-green-400" />
      )}
      <div className="border-t border-[#334155] pt-3 flex justify-between items-center">
        <span className="text-base font-bold text-white">Total</span>
        <span className="text-xl font-bold text-[#7dd3fc]">
          ${(total + shipping).toFixed(2)}
        </span>
      </div>
    </div>
  </div>
);

const SummaryRow = ({ label, value, valueClassName = '' }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-[#94a3b8]">{label}</span>
    <span className={`text-sm font-medium text-[#cbd5e1] ${valueClassName}`}>{value}</span>
  </div>
);

const PromoCodeInput = () => (
  <div className="mb-5">
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Promo code"
        className="flex-1 bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#64748b] outline-none focus:border-[#4E6793] focus:ring-1 focus:ring-[#4E6793] transition-all"
      />
      <button className="bg-[#2B3D5F] text-white px-5 py-3.5 rounded-xl text-sm font-semibold hover:bg-[#2B3D5F]/90 transition-colors">
        Apply
      </button>
    </div>
  </div>
);

const CheckoutButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-full bg-[#4E6793] text-white py-4 rounded-xl text-base font-semibold flex items-center justify-center gap-2 hover:bg-[#4E6793]/90 transition-colors shadow-lg shadow-[#4E6793]/30"
  >
    Proceed to Checkout
    <IconArrowRight />
  </button>
);

const TrustBadges = () => (
  <div className="flex items-center justify-center gap-6 mt-6">
    <Badge icon={<IconShield />} label="Secure Checkout" />
    <Badge icon={<IconRefresh />} label="Free Returns" />
  </div>
);

const Badge = ({ icon, label }) => (
  <div className="flex items-center gap-2">
    {icon}
    <span className="text-xs text-[#94a3b8]">{label}</span>
  </div>
);

const BackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 text-[#7dd3fc] hover:text-[#bae6fd] transition-colors mb-4"
  >
    <IconChevronLeft />
    <span className="text-sm font-medium">Back</span>
  </button>
);

const IconChevronLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const IconMinus = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
  </svg>
);

const IconPlus = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const IconTrash = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const IconCartEmpty = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10 text-[#7dd3fc]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
);

const IconArrowRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const IconShield = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-[#7dd3fc]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

const IconRefresh = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-[#7dd3fc]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

export default CartPage;