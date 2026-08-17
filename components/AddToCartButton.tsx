'use client';

import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ShoppingBag, Check } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddToCartButton({ product }: { product: any }) {
  const { addItem } = useCart();
  const { theme } = useTheme();
  const [isAdded, setIsAdded] = useState(false);

  const isOutOfStock = product.stock === 0;

  const handleAdd = () => {
    if (isOutOfStock) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      stock: product.stock,
      quantity: 1,
    });

    setIsAdded(true);
    toast.success(`Added "${product.name}" to cart!`);
    
    // Slightly longer timeout to let the user enjoy the animation
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <motion.button
      onClick={handleAdd}
      disabled={isOutOfStock}
      whileHover={!isOutOfStock && !isAdded ? { scale: 1.02 } : {}}
      whileTap={!isOutOfStock ? { scale: 0.96 } : {}}
      className="relative w-full py-4 px-6 rounded-[1rem] font-black text-sm uppercase tracking-widest text-white overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed group transition-colors duration-300"
      style={{
        backgroundColor: isOutOfStock ? '#94a3b8' : isAdded ? '#10b981' : theme.primary,
        // Dynamic, glowing drop-shadow that matches the active button color
        boxShadow: !isOutOfStock && !isAdded ? `0 12px 24px -8px ${theme.primary}80` : 
                   isAdded ? '0 12px 24px -8px rgba(16, 185, 129, 0.6)' : 'none',
      }}
    >
      {/* Subtle background shimmer effect on hover for a high-tech glass feel */}
      {!isOutOfStock && !isAdded && (
        <motion.div 
          className="absolute inset-0 z-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-white to-transparent skew-x-12"
          initial={{ x: '-150%' }}
          whileHover={{ x: '150%' }}
          transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity }}
        />
      )}

      {/* AnimatePresence handles the smooth entrance/exit of the different button states */}
      <AnimatePresence mode="wait">
        {isOutOfStock ? (
          <motion.div
            key="out-of-stock"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="relative z-10 flex items-center justify-center gap-2.5 w-full"
          >
            <span>Out of Stock</span>
          </motion.div>
        ) : isAdded ? (
          <motion.div
            key="added"
            initial={{ opacity: 0, y: 15, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative z-10 flex items-center justify-center gap-2.5 w-full"
          >
            <motion.div
              initial={{ rotate: -90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", delay: 0.1, stiffness: 300 }}
            >
              <Check className="w-5 h-5 text-white" strokeWidth={3} />
            </motion.div>
            <span>Added to Bag</span>
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative z-10 flex items-center justify-center gap-2.5 w-full"
          >
            <ShoppingBag className="w-5 h-5 text-white" strokeWidth={2.5} />
            <span>Add to Bag &mdash; ${product.price.toFixed(2)}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}