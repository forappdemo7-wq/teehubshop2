'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Product } from '@/types';
import { ShoppingBag, Eye, Check, Flame } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const { theme } = useTheme();
  const [isAdded, setIsAdded] = useState(false);

  // Check if new (created within past 7 days)
  const isNew = (() => {
    if (!product.createdAt) return false;
    const date = new Date(product.createdAt);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return date > sevenDaysAgo;
  })();

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    setTimeout(() => setIsAdded(false), 1400);
  };

  return (
    <div
      className="group relative flex flex-col rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden border border-black/5 bg-white"
      style={{
        backgroundColor: theme.cardBg,
      }}
    >
      {/* ─── Product Image ─── */}
      <Link href={`/products/${product.id}`} className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100 block">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/fallback-image.svg';
          }}
        />

        {/* ─── Badges ─── */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {isNew && !isOutOfStock && (
            <span
              className="px-2 py-0.5 text-[8px] sm:text-[10px] font-black tracking-wider uppercase rounded-md text-black shadow-md flex items-center gap-0.5"
              style={{ backgroundColor: theme.accent }}
            >
              <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-black" />
              NEW
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="px-2 py-0.5 text-[8px] sm:text-[10px] font-bold tracking-wider uppercase rounded-md bg-amber-500 text-white shadow-md">
              {product.stock} left
            </span>
          )}
        </div>

        {/* ─── Sold Out Overlay ─── */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="text-white font-black px-3 py-1.5 bg-red-600 rounded-lg text-[10px] sm:text-xs uppercase tracking-wider shadow-lg">
              Sold Out
            </span>
          </div>
        )}

        {/* ─── Quick View (Desktop Only) ─── */}
        {!isOutOfStock && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none hidden sm:flex">
            <span className="bg-white/95 text-slate-900 text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <Eye className="w-3.5 h-3.5" />
              View Details
            </span>
          </div>
        )}
      </Link>

      {/* ─── Card Info ─── */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-2">
        {/* Category & Availability */}
        <div className="flex items-center justify-between mb-0.5">
          <span 
            className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded"
            style={{
              backgroundColor: `${theme.primary}15`,
              color: theme.primary,
            }}
          >
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${isOutOfStock ? 'bg-red-400' : 'bg-emerald-500'}`} />
            <span className="text-[9px] sm:text-[11px] text-slate-500 font-medium">
              {isOutOfStock ? 'Sold Out' : 'Available'}
            </span>
          </div>
        </div>

        {/* Product Name */}
        <Link href={`/products/${product.id}`} className="block -mt-0.5">
          <h3 
            className="font-bold text-sm sm:text-base leading-snug line-clamp-2 group-hover:underline transition-colors"
            style={{ color: theme.text }}
          >
            {product.name}
          </h3>
        </Link>

        {/* ─── Price & Add Button ─── */}
        <div className="flex items-center justify-between pt-2 border-t border-black/5 mt-1">
          <div className="flex flex-col">
            <span className="text-[8px] sm:text-[10px] text-slate-400 font-medium uppercase tracking-wider">Price</span>
            <span 
              className="text-base sm:text-lg font-extrabold tracking-tight"
              style={{ color: theme.text }}
            >
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-3.5 sm:py-2 rounded-xl font-bold text-xs text-white transition-all duration-200 active:scale-95 shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0"
            style={{
              backgroundColor: isAdded ? '#10b981' : theme.primary,
            }}
            title={isOutOfStock ? 'Out of stock' : 'Add to cart'}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-white sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}