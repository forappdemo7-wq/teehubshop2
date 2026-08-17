'use client';

import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Lock,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const { theme } = useTheme();

  const totalItemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  // ─── EMPTY STATE ───
  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 selection:bg-blue-100 selection:text-blue-900" style={{ backgroundColor: 'var(--color-background)' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="text-center w-full max-w-lg mx-auto p-8 sm:p-12 rounded-[2rem] border border-slate-200/60 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] bg-white/80 backdrop-blur-xl"
        >
          <div className="w-24 h-24 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-8 shadow-sm text-slate-300">
            <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 text-slate-900">
            Your Bag is Empty
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mb-10 leading-relaxed font-medium">
            Looks like you haven't added any match gear or custom jerseys yet. Explore our latest drops!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link 
              href="/" 
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
              style={{ backgroundColor: theme.primary, boxShadow: `0 10px 25px -8px ${theme.primary}80` }}
            >
              <span>Shop Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/custom-jersey" 
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2 border border-slate-200/50"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Design Jersey</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── CART WITH ITEMS ───
  return (
    <div className="min-h-screen py-8 md:py-16 selection:bg-blue-100 selection:text-blue-900" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-all"
          >
            <span className="p-1.5 rounded-full bg-white shadow-sm border border-slate-200 group-hover:border-slate-300 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </span>
            Continue Shopping
          </Link>
          <span className="text-xs font-bold px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 shadow-sm">
            {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} in bag
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-8 sm:mb-12 text-slate-900">
          Shopping Bag
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">
          
          {/* ─── ITEM LIST COLUMN (7 Cols on LG) ─── */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -20 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="rounded-[1.5rem] shadow-sm border border-slate-200/60 hover:shadow-md hover:border-slate-300/60 transition-all overflow-hidden bg-white/80 backdrop-blur-md p-4 sm:p-6"
                >
                  <div className="flex gap-4 sm:gap-6">
                    {/* Item Thumbnail */}
                    <div className="relative h-24 w-24 sm:h-32 sm:w-32 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 96px, 128px"
                        className="object-cover transition-transform hover:scale-105 duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/fallback-image.svg';
                        }}
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="pr-2">
                          <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-tight line-clamp-2">
                            {item.name}
                          </h3>
                          <span className="text-sm font-semibold text-slate-500 mt-1.5 block">
                            ${item.price.toFixed(2)} each
                          </span>
                        </div>
                        
                        {/* Larger touch target for mobile delete button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 sm:p-2.5 text-slate-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50 active:scale-95 flex-shrink-0"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>

                      {/* Quantity & Subtotal Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 mt-auto">
                        <div className="flex items-center gap-1 sm:gap-2 bg-slate-50 p-1 sm:p-1.5 rounded-2xl border border-slate-100">
                          {/* Larger quantity buttons for mobile */}
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white shadow-sm hover:bg-slate-100 text-slate-700 flex items-center justify-center transition active:scale-95 border border-slate-200/50"
                          >
                            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <span className="w-8 sm:w-10 text-center font-bold text-sm sm:text-base text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white shadow-sm hover:bg-slate-100 text-slate-700 flex items-center justify-center transition active:scale-95 disabled:opacity-40 disabled:active:scale-100 border border-slate-200/50"
                          >
                            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>

                        <span className="font-black text-lg sm:text-xl text-slate-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ─── ORDER SUMMARY COLUMN (5 Cols on LG) ─── */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 mt-4 lg:mt-0">
            <div 
              className="rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-slate-200/60 p-6 sm:p-8 space-y-6 bg-white/90 backdrop-blur-xl"
            >
              <h2 className="text-lg font-extrabold uppercase tracking-widest text-slate-900 pb-4 border-b border-slate-100">
                Order Summary
              </h2>

              <div className="space-y-4 text-sm font-semibold">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Standard Shipping</span>
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md">FREE</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Estimated Tax</span>
                  <span className="font-bold text-slate-900">Calculated at checkout</span>
                </div>

                <div className="border-t border-slate-100 pt-5 mt-5 flex justify-between items-end">
                  <div>
                    <span className="block text-base font-black uppercase tracking-wider text-slate-900">Total</span>
                    <span className="text-xs text-slate-400 font-medium mt-1">Including shipping</span>
                  </div>
                  <span className="text-3xl sm:text-4xl font-black" style={{ color: theme.primary }}>
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <div className="pt-2">
                <Link
                  href="/checkout"
                  className="w-full py-4 sm:py-5 rounded-[1rem] font-black text-sm uppercase tracking-widest text-white flex items-center justify-center gap-3 transition-all duration-300 active:scale-95 group relative overflow-hidden"
                  style={{ 
                    backgroundColor: theme.primary,
                    boxShadow: `0 12px 24px -8px ${theme.primary}80` 
                  }}
                >
                  <motion.div 
                    className="absolute inset-0 z-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-white to-transparent skew-x-12"
                    initial={{ x: '-150%' }}
                    whileHover={{ x: '150%' }}
                    transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity }}
                  />
                  <div className="relative z-10 flex items-center gap-2.5">
                    <Lock className="w-4 h-4" />
                    <span>Secure Checkout</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 flex items-start sm:items-center gap-3 text-slate-600">
                <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                <p className="text-xs leading-relaxed font-medium text-slate-500">
                  Guaranteed safe & secure checkout. Your data is protected with 256-bit SSL encryption.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}