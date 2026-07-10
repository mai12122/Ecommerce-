import { useState, useEffect } from "react"; // Make sure to import useEffect
import { useNavigate } from "react-router-dom";
import GenZLogo from "../assets/GenZlogo.png";

function AddressPage() {
  const navigate = useNavigate();
  
  // 1. Load addresses from localStorage on initial render
  const [addresses, setAddresses] = useState(() => {
    const savedAddresses = localStorage.getItem("userAddresses");
    return savedAddresses ? JSON.parse(savedAddresses) : [];
  });

  // 2. Save addresses to localStorage whenever the 'addresses' array changes
  useEffect(() => {
    localStorage.setItem("userAddresses", JSON.stringify(addresses));
  }, [addresses]);

  const [showForm, setShowForm] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            if (data && data.address) {
              const addr = data.address;
              setFormData({
                ...formData,
                addressLine1: `${addr.house_number || ""} ${addr.road || addr.street || ""}`.trim(),
                city: addr.city || addr.town || addr.village || addr.county || "",
                state: addr.state || addr.region || "",
                zipCode: addr.postcode || "",
                country: addr.country || "",
              });
            }
          } catch (error) {
            console.error("Error fetching address:", error);
            alert("Unable to fetch address details. Please enter manually.");
          } finally {
            setIsLocating(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve your location. Please enter your address manually.");
          setIsLocating(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add new address to the state (which will trigger the useEffect to save it)
    setAddresses([...addresses, { id: Date.now(), ...formData }]);
    
    // Reset form
    setFormData({
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0F1420] pb-24 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 bg-[#19233C] z-10 pt-6 pb-4 px-5">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-[#4E6793] hover:text-[#E5E7EB] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back</span>
          </button>
          <p className="text-sm font-semibold text-[#E5E7EB] tracking-wide">MY ADDRESSES</p>
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md">
            <img src={GenZLogo} alt="GenZ" className="h-10 w-auto" />
          </div>
        </div>
      </header>

      <div className="px-5 pt-6 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[#E5E7EB] text-base font-semibold">
            Saved Addresses
          </h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-xs text-[#E5E7EB] bg-[#4E6793] px-3 py-1.5 rounded-full hover:bg-[#4E6793]/90 transition-colors"
          >
            {showForm ? "Cancel" : "+ Add New"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-[#19233C] rounded-2xl border border-[#4E6793]/30 p-4 mb-6 space-y-4">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="w-full bg-[#0F1420] border border-[#4E6793]/30 text-[#E5E7EB] py-3 rounded-xl text-sm font-medium hover:bg-[#2B3D5F]/30 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLocating ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#4E6793] border-t-transparent rounded-full animate-spin" />
                  <span>Locating...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#4E6793]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Use My Current Location</span>
                </>
              )}
            </button>

            <div className="border-t border-[#4E6793]/20 pt-4">
              <p className="text-[#4E6793] text-xs font-medium mb-3 text-center">OR ENTER MANUALLY</p>
            </div>

            <div>
              <label className="text-[#4E6793] text-xs font-medium mb-1 block">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full bg-[#0F1420] border border-[#4E6793]/30 text-[#E5E7EB] rounded-xl p-3 text-sm focus:outline-none focus:border-[#4E6793] transition-colors placeholder-[#4E6793]/50"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="text-[#4E6793] text-xs font-medium mb-1 block">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full bg-[#0F1420] border border-[#4E6793]/30 text-[#E5E7EB] rounded-xl p-3 text-sm focus:outline-none focus:border-[#4E6793] transition-colors placeholder-[#4E6793]/50"
                placeholder="+1 234 567 8900"
              />
            </div>
            <div>
              <label className="text-[#4E6793] text-xs font-medium mb-1 block">Address Line 1</label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                required
                className="w-full bg-[#0F1420] border border-[#4E6793]/30 text-[#E5E7EB] rounded-xl p-3 text-sm focus:outline-none focus:border-[#4E6793] transition-colors placeholder-[#4E6793]/50"
                placeholder="123 Main St"
              />
            </div>
            <div>
              <label className="text-[#4E6793] text-xs font-medium mb-1 block">Address Line 2 (Optional)</label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                className="w-full bg-[#0F1420] border border-[#4E6793]/30 text-[#E5E7EB] rounded-xl p-3 text-sm focus:outline-none focus:border-[#4E6793] transition-colors placeholder-[#4E6793]/50"
                placeholder="Apt, Suite, etc."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#4E6793] text-xs font-medium mb-1 block">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0F1420] border border-[#4E6793]/30 text-[#E5E7EB] rounded-xl p-3 text-sm focus:outline-none focus:border-[#4E6793] transition-colors placeholder-[#4E6793]/50"
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="text-[#4E6793] text-xs font-medium mb-1 block">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0F1420] border border-[#4E6793]/30 text-[#E5E7EB] rounded-xl p-3 text-sm focus:outline-none focus:border-[#4E6793] transition-colors placeholder-[#4E6793]/50"
                  placeholder="NY"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#4E6793] text-xs font-medium mb-1 block">Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0F1420] border border-[#4E6793]/30 text-[#E5E7EB] rounded-xl p-3 text-sm focus:outline-none focus:border-[#4E6793] transition-colors placeholder-[#4E6793]/50"
                  placeholder="10001"
                />
              </div>
              <div>
                <label className="text-[#4E6793] text-xs font-medium mb-1 block">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0F1420] border border-[#4E6793]/30 text-[#E5E7EB] rounded-xl p-3 text-sm focus:outline-none focus:border-[#4E6793] transition-colors placeholder-[#4E6793]/50"
                  placeholder="USA"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#4E6793] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#4E6793]/90 transition-colors shadow-lg shadow-[#4E6793]/25 mt-2"
            >
              Save Address
            </button>
          </form>
        )}

        {addresses.length === 0 && !showForm ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-[#19233C] rounded-full flex items-center justify-center mb-5 border border-[#4E6793]/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#4E6793]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-[#E5E7EB] text-lg font-semibold mb-2">No Addresses Saved</h3>
            <p className="text-[#4E6793] text-sm text-center mb-6 max-w-xs">
              You haven't added any addresses yet. Add your current address to proceed with checkout!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#4E6793] text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-[#4E6793]/90 transition-colors shadow-lg shadow-[#4E6793]/25"
            >
              Add Address
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="bg-[#19233C] rounded-2xl border border-[#4E6793]/30 p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#4E6793]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#4E6793]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[#E5E7EB] font-semibold text-sm">{address.fullName}</p>
                      <p className="text-[#4E6793] text-xs">{address.phone}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="text-red-400 hover:text-red-300 text-xs font-medium"
                  >
                    Delete
                  </button>
                </div>
                <div className="mt-3 pl-[52px]">
                  <p className="text-[#E5E7EB] text-sm">
                    {address.addressLine1}
                    {address.addressLine2 && `, ${address.addressLine2}`}
                  </p>
                  <p className="text-[#4E6793] text-xs mt-1">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-[#4E6793] text-xs mt-0.5">
                    {address.country}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddressPage;