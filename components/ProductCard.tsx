'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const { theme } = useTheme();   // ← get current theme colours

  const isNew = (() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return new Date(product.createdAt) > sevenDaysAgo;
  })();

  const isLowStock = product.stock > 0 && product.stock < 10;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      stock: product.stock,
      quantity: 1,
    });
  };

  return (
    <div
      className="group relative rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 w-full max-w-full"
      style={{
        backgroundColor: theme.cardBg,
        animationDelay: `${index * 50}ms`,
      }}
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative h-48 sm:h-64 w-full bg-gray-100 overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/fallback-image.jpg';
            }}
          />
          {isNew && !isOutOfStock && (
            <span
              className="absolute top-2 left-2 sm:top-3 sm:left-3 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full z-10 shadow-md animate-pulse"
              style={{ backgroundColor: theme.accent }}
            >
              NEW
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <div
              className="absolute top-2 left-2 sm:top-3 sm:left-3 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md"
              style={{ backgroundColor: theme.accent }}
            >
              Low Stock
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold px-3 py-1 bg-red-600 rounded-full text-sm shadow-lg">
                Sold Out
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-3 sm:p-4">
        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider" style={{ color: theme.primary }}>
          {product.category}
        </span>
        <Link href={`/products/${product.id}`}>
          <h3
            className="text-sm sm:text-lg font-bold mt-1 mb-1 sm:mb-2 line-clamp-1 transition"
            style={{ color: theme.text }}
          >
            {product.name}
          </h3>
        </Link>
        <p
          className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2"
          style={{ color: `${theme.text}cc` }} // slight transparency for description
        >
          {product.description}
        </p>

        <div className="flex justify-between items-center mb-1">
          <span className="text-lg sm:text-2xl font-bold" style={{ color: theme.text }}>
            ${product.price.toFixed(2)}
          </span>
          {!isOutOfStock && (
            <span
              className={`text-[10px] sm:text-xs font-semibold ${isLowStock ? 'text-orange-600' : 'text-green-600'}`}
            >
              {isLowStock ? `Only ${product.stock} left!` : 'In Stock'}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="mt-2 sm:mt-3 w-full py-1.5 sm:py-2.5 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: !isOutOfStock ? theme.primary : '#e5e7eb',
            color: !isOutOfStock ? 'white' : '#6b7280',
          }}
        >
          {!isOutOfStock ? 'Add to Cart' : 'Sold Out'}
        </button>
      </div>
    </div>
  );
}