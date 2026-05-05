// components/OrderStatusSelect.tsx
'use client';

import { updateOrderStatus } from '@/actions/admin-actions';
import { useState } from 'react';

const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function OrderStatusSelect({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setLoading(true);
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      setStatus(newStatus);
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className={`px-2 py-1 rounded text-sm font-medium border ${
        status === 'PENDING' && 'bg-yellow-100 text-yellow-800 border-yellow-300'
      } ${status === 'PROCESSING' && 'bg-blue-100 text-blue-800 border-blue-300'}
         ${status === 'SHIPPED' && 'bg-purple-100 text-purple-800 border-purple-300'}
         ${status === 'DELIVERED' && 'bg-green-100 text-green-800 border-green-300'}
         ${status === 'CANCELLED' && 'bg-red-100 text-red-800 border-red-300'}
      `}
    >
      {statuses.map(s => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}