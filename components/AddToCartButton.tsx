'use client';

import { useCart } from '@/contexts/CartContext';

export default function AddToCartButton({ product }: { product: any }) {
  const { addItem } = useCart();   // ✅ use addItem, not addToCart

  return (
    <button
      onClick={() => {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          stock: product.stock,
          quantity: 1,
        });
      }}
      disabled={product.stock === 0}
      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
    >
      {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
    </button>
  );
}