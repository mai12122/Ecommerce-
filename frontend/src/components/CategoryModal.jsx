import { useState } from "react";

const COLORS = {
  bgDarkest: "#0F1420",
  bgPrimary: "#19233C",
  bgSecondary: "#2B3D5F",
  bgAccent: "#4E6793",
  textLight: "#E5E7EB",
};

function CategoryModal({ categories, selectedCategory, onSelectCategory, isOpen, onClose }) {
  if (!isOpen) return null;

  const handleCategoryClick = (categoryName) => {
    onSelectCategory(categoryName);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 z-40 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Centered Modal Card */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-sm rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 border border-[#4E6793]/30"
          style={{ backgroundColor: COLORS.bgPrimary }}
        >
          {/* Header with gradient background */}
          <div className="relative overflow-hidden p-6 border-b border-[#4E6793]/30">
            <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED]/10 to-[#A855F7]/10"></div>
            <div className="relative flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#A855F7]">
                  Shop by
                </h3>
                <p className="text-sm text-[#4E6793] mt-1">Select your category</p>
              </div>
              <button
                onClick={onClose}
                className="text-[#4E6793] hover:text-[#A855F7] transition-all p-2 hover:bg-[#2B3D5F] rounded-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
            {/* All Products Button - Featured */}
            <button
              onClick={() => handleCategoryClick("All")}
              className={`w-full px-6 py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 ${
                selectedCategory === "All"
                  ? `bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white shadow-lg shadow-purple-500/30`
                  : `bg-[#2B3D5F] text-[#E5E7EB] hover:bg-[#4E6793] hover:shadow-lg`
              }`}
            >
              ✨ All Products
            </button>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-[#2B3D5F] via-[#4E6793] to-[#2B3D5F] my-4"></div>

            {/* Category Buttons Grid */}
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`relative group px-4 py-4 rounded-2xl font-semibold text-base transition-all transform hover:scale-105 overflow-hidden ${
                    selectedCategory === category.name
                      ? `bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white shadow-lg shadow-purple-500/30`
                      : `bg-[#2B3D5F] text-[#E5E7EB] hover:bg-[#4E6793]`
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-[#A855F7]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                  <span className="relative">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[#4E6793]/30 bg-gradient-to-r from-[#2B3D5F]/20 to-transparent">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 rounded-xl bg-[#4E6793] text-[#E5E7EB] font-semibold hover:bg-[#5A7BA8] transition-all hover:shadow-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CategoryModal;
