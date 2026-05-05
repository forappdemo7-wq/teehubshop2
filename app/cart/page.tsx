'use client';

import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import Image from 'next/image';
import Link from 'next/link';
import { TrashIcon, PlusIcon, MinusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const { theme } = useTheme();   // ← get theme colours

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4" style={{ backgroundColor: theme.background }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-28 h-28 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <ShoppingBagIcon className="w-12 h-12 text-gray-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4" style={{ color: theme.text }}>Your cart is waiting</h1>
          <p className="mb-8" style={{ color: `${theme.text}99` }}>Looks like you haven't added any items yet. Explore our collection and gear up!</p>
          <Link href="/" className="bg-blue-600 text-white px-8 py-3 rounded-xl inline-block hover:bg-blue-700 transition shadow-md hover:shadow-lg">
            Start Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.background }}>
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: theme.text }}>Shopping Cart</h1>
          <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: `${theme.primary}20`, color: theme.primary }}>
            {items.reduce((sum, i) => sum + i.quantity, 0)} items
          </span>
        </div>
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-2/3 space-y-4">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden"
                  style={{ backgroundColor: theme.cardBg, borderColor: `${theme.text}20` }}
                >
                  <div className="p-5 flex flex-col sm:flex-row gap-5">
                    <div className="relative h-32 w-32 sm:h-28 sm:w-28 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg" style={{ color: theme.text }}>{item.name}</h3>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 text-sm flex items-center gap-1 mt-2 hover:text-red-700"
                        >
                          <TrashIcon className="h-4 w-4" /> Remove
                        </button>
                      </div>
                      <div className="flex flex-row sm:flex-col items-center justify-between gap-4 sm:items-end">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200"
                            style={{ backgroundColor: `${theme.text}10` }}
                          >
                            <MinusIcon className="h-4 w-4" style={{ color: theme.text }} />
                          </button>
                          <span className="w-10 text-center font-medium" style={{ color: theme.text }}>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 disabled:opacity-50"
                            style={{ backgroundColor: `${theme.text}10` }}
                          >
                            <PlusIcon className="h-4 w-4" style={{ color: theme.text }} />
                          </button>
                        </div>
                        <p className="font-bold text-xl" style={{ color: theme.text }}>${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="lg:w-1/3">
            <div className="rounded-2xl shadow-lg border p-6 sticky top-24" style={{ backgroundColor: theme.cardBg, borderColor: `${theme.text}20` }}>
              <h2 className="text-xl font-bold pb-3 border-b" style={{ color: theme.text, borderColor: `${theme.text}20` }}>Order Summary</h2>
              <div className="space-y-4 mt-4">
                <div className="flex justify-between">
                  <span style={{ color: `${theme.text}99` }}>Subtotal</span>
                  <span className="font-medium" style={{ color: theme.text }}>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: `${theme.text}99` }}>Shipping</span>
                  <span className="font-medium" style={{ color: theme.primary }}>FREE</span>
                </div>
                <div className="border-t pt-4 mt-2" style={{ borderColor: `${theme.text}20` }}>
                  <div className="flex justify-between text-xl font-bold">
                    <span style={{ color: theme.text }}>Total</span>
                    <span style={{ color: theme.text }}>${totalPrice.toFixed(2)}</span>
                  </div>
                  <p className="text-xs mt-2" style={{ color: `${theme.text}80` }}>Tax included. Shipping calculated at next step.</p>
                </div>
              </div>
              <Link
                href="/checkout"
                className="block w-full text-white text-center py-3 rounded-xl font-semibold transition-all duration-200 shadow-md mt-6"
                style={{ backgroundColor: theme.primary }}
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}