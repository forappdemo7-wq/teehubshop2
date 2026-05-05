'use client';

import { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  CubeIcon, 
  CalendarIcon, 
  CurrencyDollarIcon, 
  UserIcon, 
  EnvelopeIcon 
} from '@heroicons/react/24/outline';

interface OrderInfo {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  createdAt: string;
  items: { productName: string; quantity: number; price: number }[];
}

export default function TrackOrderPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<OrderInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError('');
    setOrders([]);

    try {
      const res = await fetch(`/api/track-order?q=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        if (data.orders.length === 0) setError('No orders found matching your search.');
      } else {
        setError(data.error || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusDetails = (status: string) => {
    const map: Record<string, { label: string; color: string; bg: string; border: string }> = {
      PENDING: {
        label: 'Pending',
        color: 'text-yellow-800',
        bg: 'bg-yellow-100',
        border: 'border-yellow-200'
      },
      PROCESSING: {
        label: 'Processing',
        color: 'text-blue-800',
        bg: 'bg-blue-100',
        border: 'border-blue-200'
      },
      SHIPPED: {
        label: 'Shipped',
        color: 'text-purple-800',
        bg: 'bg-purple-100',
        border: 'border-purple-200'
      },
      DELIVERED: {
        label: 'Delivered',
        color: 'text-green-800',
        bg: 'bg-green-100',
        border: 'border-green-200'
      },
      CANCELLED: {
        label: 'Cancelled',
        color: 'text-red-800',
        bg: 'bg-red-100',
        border: 'border-red-200'
      },
    };
    return map[status] || {
      label: status,
      color: 'text-gray-800',
      bg: 'bg-gray-100',
      border: 'border-gray-200'
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600 text-lg">Enter your order number or email to get real‑time updates</p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-10 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Order number (e.g., ORD-...) or email"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-gray-900 placeholder-gray-500"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <MagnifyingGlassIcon className="h-5 w-5" /> Search
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center mb-6 shadow-sm">
            {error}
          </div>
        )}

        {/* Orders List */}
        {orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = getStatusDetails(order.status);
              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                  {/* Header */}
                  <div className="bg-gray-800 px-6 py-4">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-300">Order Number</p>
                        <p className="font-mono font-bold text-xl text-white tracking-wider">{order.orderNumber}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`${status.bg} ${status.border} border rounded-full px-4 py-1.5`}>
                          <span className={`text-sm font-bold ${status.color}`}>{status.label}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-6">
                    {/* Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                      <div className="flex items-center gap-3">
                        <CalendarIcon className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Placed On</p>
                          <p className="font-semibold text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CurrencyDollarIcon className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Amount</p>
                          <p className="font-bold text-2xl text-gray-900">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <UserIcon className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Customer</p>
                          <p className="font-semibold text-gray-900">{order.customerName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                          <p className="font-medium text-gray-800 truncate">{order.customerEmail}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <CubeIcon className="h-5 w-5 text-gray-600" />
                        <h3 className="font-bold text-gray-800 text-lg">Order Items</h3>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-200">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                            <div>
                              <span className="font-semibold text-gray-800">{item.productName}</span>
                              <span className="text-gray-600 text-sm ml-2">x{item.quantity}</span>
                            </div>
                            <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}