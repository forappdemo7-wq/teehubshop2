// components/DeleteButton.tsx
'use client';

import { deleteProduct } from '@/actions/product-actions';
import { useState } from 'react';

export default function DeleteButton({ productId, productName }: { productId: string; productName: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) return;
    setLoading(true);
    const result = await deleteProduct(productId);
    if (!result.success) {
      alert(result.error);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-800 disabled:opacity-50"
    >
      {loading ? '...' : 'Delete'}
    </button>
  );
}