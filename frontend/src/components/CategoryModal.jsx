function CategoryModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close promo modal"
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Promotional Modal - Centered */}
      <div 
        className="fixed z-50 p-4"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '28rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div className="rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 bg-linear-to-br from-blue-600 to-purple-600 overflow-hidden w-full">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 md:top-6 right-4 md:right-6 text-white/80 hover:text-white p-2 rounded-lg transition-colors z-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="p-6 md:p-8 text-center text-white flex flex-col items-center justify-center">
            {/* Discount Badge */}
            <div className="mb-4 md:mb-6">
              <span className="inline-block bg-yellow-300 text-black font-black text-3xl md:text-4xl px-6 md:px-8 py-2 md:py-3 rounded-lg transform -rotate-2">
                40% OFF
              </span>
            </div>

            {/* Main Text */}
            <h2 className="text-2xl md:text-4xl font-black mb-3 md:mb-4 leading-tight">
              MEGA SALE!
            </h2>
            
            <p className="text-base md:text-lg text-white/90 mb-2 md:mb-3">
              Limited Time Offer
            </p>

            <p className="text-sm md:text-base text-white/80 mb-6 md:mb-8 max-w-xs">
              Get up to <span className="font-bold text-yellow-300">40% discount</span> on your favorite items!
            </p>

            {/* Offer Details */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6 mb-6 md:mb-8 w-full max-w-xs">
              <div className="space-y-2 md:space-y-3 text-sm md:text-base">
                <div className="flex items-center justify-between">
                  <span className="text-white/90">✓ Free Shipping</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/90">✓ Easy Returns</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/90">✓ Best Prices</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={onClose}
              className="w-full max-w-xs px-6 py-3 md:py-4 bg-yellow-300 text-black font-bold rounded-lg hover:bg-yellow-400 transition-all transform hover:scale-105 text-base md:text-lg mb-4"
            >
              SHOP NOW
            </button>

            {/* Countdown Timer (Optional) */}
            <p className="text-xs md:text-sm text-white/70">
              ⏱ Limited offer - Shop now!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default CategoryModal;
