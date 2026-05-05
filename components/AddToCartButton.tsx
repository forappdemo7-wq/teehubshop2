'use client';

import { useCart } from '@/contexts/CartContext';

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart(product)}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg"
    >
      Add to Cart
    </button>
  );
}