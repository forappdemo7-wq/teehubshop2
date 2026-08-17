'use client';

import { useState } from 'react';
import { 
  Search, 
  Package, 
  Calendar, 
  DollarSign, 
  User, 
  Mail,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

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
      setError('An error occurred while fetching orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusDetails = (status: string) => {
    const map: Record<string, { label: string; icon: any; color: string; bg: string; border: string }> = {
      PENDING: {
        label: 'Order Placed',
        icon: Clock,
        color: 'text-amber-800',
        bg: 'bg-amber-50',
        border: 'border-amber-200'
      },
      PROCESSING: {
        label: 'In Production',
        icon: Sparkles,
        color: 'text-blue-800',
        bg: 'bg-blue-50',
        border: 'border-blue-200'
      },
      SHIPPED: {
        label: 'Dispatched & On the Way',
        icon: Truck,
        color: 'text-purple-800',
        bg: 'bg-purple-50',
        border: 'border-purple-200'
      },
      DELIVERED: {
        label: 'Delivered',
        icon: CheckCircle2,
        color: 'text-emerald-800',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200'
      },
      CANCELLED: {
        label: 'Cancelled',
        icon: AlertCircle,
        color: 'text-red-800',
        bg: 'bg-red-50',
        border: 'border-red-200'
      },
    };
    return map[status] || {
      label: status,
      icon: Package,
      color: 'text-slate-800',
      bg: 'bg-slate-50',
      border: 'border-slate-200'
    };
  };

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header section */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <Truck className="w-3.5 h-3.5" />
            <span>Real-Time Dispatch Tracker</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight" style={{ color: 'var(--color-text)' }}>
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Enter your order number (e.g. ORD-...) or the email address used during checkout.
          </p>
        </div>

        {/* Search Bar Card */}
        <div 
          className="rounded-3xl shadow-xl border border-black/5 p-4 sm:p-6"
          style={{ backgroundColor: 'var(--color-card-bg)' }}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Order reference (ORD-...) or customer email"
                className="w-full pl-11 pr-4 py-3.5 text-xs font-bold rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider text-white shadow-xl hover:opacity-95 active:scale-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track Order</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center">
            {error}
          </div>
        )}

        {/* Orders Results */}
        {orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = getStatusDetails(order.status);
              const StatusIcon = status.icon;
              return (
                <div 
                  key={order.id} 
                  className="rounded-3xl shadow-xl border border-black/5 overflow-hidden"
                  style={{ backgroundColor: 'var(--color-card-bg)' }}
                >
                  {/* Card Header Bar */}
                  <div className="p-6 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                        Order Reference
                      </span>
                      <p className="font-mono font-black text-lg text-white">
                        {order.orderNumber}
                      </p>
                    </div>

                    <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border ${status.bg} ${status.border} ${status.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-wider">{status.label}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-6">
                    {/* Metadata 4-col */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-black/5">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Placed Date</span>
                        <span className="text-xs font-bold text-slate-800">
                          {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Customer</span>
                        <span className="text-xs font-bold text-slate-800 truncate block">
                          {order.customerName}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Email</span>
                        <span className="text-xs font-bold text-slate-800 truncate block">
                          {order.customerEmail}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Amount</span>
                        <span className="text-sm font-black text-slate-900">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                        <Package className="w-4 h-4 text-slate-500" />
                        <span>Included Gear & Kits</span>
                      </h3>
                      <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 divide-y divide-slate-200">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0">
                            <div>
                              <span className="text-xs font-bold text-slate-900">{item.productName}</span>
                              <span className="text-xs text-slate-500 font-medium ml-2">Qty: {item.quantity}</span>
                            </div>
                            <span className="text-xs font-black text-slate-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
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
