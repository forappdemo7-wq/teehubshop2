'use client';

import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/actions/order-actions';
import { 
  Lock, 
  ShieldCheck, 
  ChevronLeft, 
  CheckCircle2, 
  CreditCard,
  Truck,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { theme } = useTheme();
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
      <div className="min-h-[65vh] flex items-center justify-center p-8" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700 mx-auto mb-4" />
          <p className="text-xs font-bold text-slate-500">Redirecting to shopping bag...</p>
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
    if (!formData.addressLine.trim()) newErrors.addressLine = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State / Province is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Postal / Zip code is required';
    else if (!/^\d{5,6}$/.test(formData.pincode)) newErrors.pincode = 'Pincode must be 5 or 6 digits';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        setError(result.error || 'Failed to place order. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Order error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Bag</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted Checkout</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-8" style={{ color: 'var(--color-text)' }}>
          Secure Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left: Customer & Shipping Details Form (7 Cols on LG) */}
          <div className="lg:col-span-7">
            <div
              className="rounded-3xl shadow-xl border border-black/5 p-6 sm:p-8 space-y-6"
              style={{ backgroundColor: 'var(--color-card-bg)' }}
            >
              <div>
                <h2 className="text-base font-black uppercase tracking-wider text-slate-900">
                  1. Shipping Information
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your delivery address for instant matchday kit fulfillment.
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                
                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="e.g. Alex Morgan"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                    />
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  </div>
                  {errors.customerName && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.customerName}</p>}
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="customerEmail"
                        value={formData.customerEmail}
                        onChange={handleChange}
                        placeholder="alex@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                      />
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    </div>
                    {errors.customerEmail && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.customerEmail}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleChange}
                        placeholder="+1 (555) 019-2834"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                      />
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    </div>
                    {errors.customerPhone && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.customerPhone}</p>}
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Street Address & Apartment *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="addressLine"
                      value={formData.addressLine}
                      onChange={handleChange}
                      placeholder="123 Athletic Way, Apt 4B"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                    />
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  </div>
                  {errors.addressLine && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.addressLine}</p>}
                </div>

                {/* Landmark */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Landmark / Delivery Instructions (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleChange}
                      placeholder="Near Stadium Gate 3"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                    />
                    <Building className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* City, State, Pincode */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Los Angeles"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                    />
                    {errors.city && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="California"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                    />
                    {errors.state && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="90001"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                    />
                    {errors.pincode && <p className="text-red-500 text-[11px] font-semibold mt-1">{errors.pincode}</p>}
                  </div>
                </div>

                {/* Payment Method Badge */}
                <div className="pt-4 border-t border-black/5">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-slate-700" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Direct Matchday Order / Cash on Delivery</p>
                        <p className="text-[11px] text-slate-500">Pay safely upon receipt or card at doorstep</p>
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-white shadow-xl flex items-center justify-center gap-2.5 transition-all duration-300 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95"
                    style={{ backgroundColor: theme.primary }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Placing Match Order...</span>
                      </span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Place Order • ${totalPrice.toFixed(2)}</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>
          </div>

          {/* Right: Order Summary Sidebar (5 Cols on LG) */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            <div 
              className="rounded-3xl shadow-xl border border-black/5 p-6 sm:p-8 space-y-6"
              style={{ backgroundColor: 'var(--color-card-bg)' }}
            >
              <div className="flex items-center justify-between pb-3 border-b border-black/5">
                <h2 className="text-base font-black uppercase tracking-wider text-slate-900">
                  Your Order ({items.reduce((s, i) => s + i.quantity, 0)})
                </h2>
                <Link href="/cart" className="text-xs font-bold text-blue-600 hover:underline">
                  Edit Bag
                </Link>
              </div>

              {/* Items List */}
              <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-black/5">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/fallback-image.svg';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                    </div>
                    <span className="text-xs font-black text-slate-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-black/5 pt-4 space-y-2.5 text-xs font-semibold">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-black text-slate-900">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tracked Express Shipping</span>
                  <span className="font-black text-emerald-600 uppercase">FREE</span>
                </div>
                <div className="border-t border-black/5 pt-3 flex justify-between items-baseline">
                  <span className="text-sm font-black uppercase text-slate-900">Final Total</span>
                  <span className="text-2xl font-black" style={{ color: theme.primary }}>
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Security Pill */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-[11px] font-medium leading-tight">
                  Zero risk. Full replacement guarantee if sizing doesn't match.
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
