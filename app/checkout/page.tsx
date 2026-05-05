'use client';

import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/actions/order-actions';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { theme } = useTheme();   // ← get theme colours
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" style={{ backgroundColor: theme.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to cart...</p>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.customerName.trim()) newErrors.customerName = 'Full name is required';
    if (!formData.customerEmail.trim()) newErrors.customerEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) newErrors.customerEmail = 'Email is invalid';
    if (!formData.customerPhone.trim()) newErrors.customerPhone = 'Phone number is required';
    if (!formData.addressLine.trim()) newErrors.addressLine = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Pincode must be 6 digits';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    const fullAddress = `${formData.addressLine}, ${formData.landmark ? formData.landmark + ', ' : ''}${formData.city}, ${formData.state} - ${formData.pincode}`;

    try {
      const result = await createOrder({
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        customerAddress: fullAddress,
        items: items.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: totalPrice,
      });

      if (result.success) {
        clearCart();
        window.location.replace(`/checkout/success?orderId=${result.orderId}`);
      } else {
        setError(result.error || 'Failed to place order');
        setLoading(false);
      }
    } catch (err) {
      console.error('Order error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.background }}>
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-2/3">
            <div
              className="rounded-2xl shadow-lg border p-6 md:p-8"
              style={{ backgroundColor: theme.cardBg, borderColor: `${theme.text}20` }}
            >
              <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: theme.text }}>Checkout</h1>
              <p className="mb-6" style={{ color: `${theme.text}99` }}>Complete your order by filling the details below.</p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>Full Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl border ${errors.customerName ? 'border-red-500' : ''} focus:outline-none focus:ring-2`}
                    style={{
                      borderColor: errors.customerName ? '#ef4444' : `${theme.text}30`,
                      backgroundColor: theme.background,
                      color: theme.text,
                    }}
                    placeholder="John Doe"
                  />
                  {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>Email Address *</label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2`}
                    style={{
                      borderColor: errors.customerEmail ? '#ef4444' : `${theme.text}30`,
                      backgroundColor: theme.background,
                      color: theme.text,
                    }}
                    placeholder="john@example.com"
                  />
                  {errors.customerEmail && <p className="text-red-500 text-xs mt-1">{errors.customerEmail}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>Phone Number *</label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2`}
                    style={{
                      borderColor: errors.customerPhone ? '#ef4444' : `${theme.text}30`,
                      backgroundColor: theme.background,
                      color: theme.text,
                    }}
                    placeholder="+1 234 567 8900"
                  />
                  {errors.customerPhone && <p className="text-red-500 text-xs mt-1">{errors.customerPhone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>Address (Street, Building) *</label>
                  <textarea
                    name="addressLine"
                    rows={2}
                    value={formData.addressLine}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2`}
                    style={{
                      borderColor: errors.addressLine ? '#ef4444' : `${theme.text}30`,
                      backgroundColor: theme.background,
                      color: theme.text,
                    }}
                    placeholder="123 Main St, Apt 4B"
                  />
                  {errors.addressLine && <p className="text-red-500 text-xs mt-1">{errors.addressLine}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>Landmark (Optional)</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2"
                    style={{
                      borderColor: `${theme.text}30`,
                      backgroundColor: theme.background,
                      color: theme.text,
                    }}
                    placeholder="Near Central Park"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2`}
                      style={{
                        borderColor: errors.city ? '#ef4444' : `${theme.text}30`,
                        backgroundColor: theme.background,
                        color: theme.text,
                      }}
                      placeholder="New York"
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2`}
                      style={{
                        borderColor: errors.state ? '#ef4444' : `${theme.text}30`,
                        backgroundColor: theme.background,
                        color: theme.text,
                      }}
                      placeholder="NY"
                    />
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2`}
                    style={{
                      borderColor: errors.pincode ? '#ef4444' : `${theme.text}30`,
                      backgroundColor: theme.background,
                      color: theme.text,
                    }}
                    placeholder="10001"
                  />
                  {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                  style={{ backgroundColor: theme.primary }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Processing Order...
                    </span>
                  ) : (
                    `Place Order • $${totalPrice.toFixed(2)}`
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="rounded-2xl shadow-lg border p-6 sticky top-24" style={{ backgroundColor: theme.cardBg, borderColor: `${theme.text}20` }}>
              <h2 className="text-xl font-bold pb-3 border-b" style={{ color: theme.text, borderColor: `${theme.text}20` }}>Your Order</h2>
              <div className="space-y-3 mt-4 max-h-80 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <span className="font-medium" style={{ color: theme.text }}>{item.name}</span>
                      <span className="ml-1" style={{ color: `${theme.text}80` }}>x{item.quantity}</span>
                    </div>
                    <span className="font-semibold" style={{ color: theme.text }}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 mt-4" style={{ borderColor: `${theme.text}20` }}>
                <div className="flex justify-between text-lg font-bold">
                  <span style={{ color: theme.text }}>Total</span>
                  <span style={{ color: theme.text }}>${totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-xs mt-2" style={{ color: `${theme.text}80` }}>Tax included where applicable</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}