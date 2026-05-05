// app/admin/orders/page.tsx
import { prisma } from '@/lib/prisma';
import OrderStatusSelect from '@/components/OrderStatusSelect';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">Orders</h1>
          <p className="text-zinc-600 mt-2">Manage and track all customer orders</p>
        </div>

        <div className="text-sm text-zinc-500 bg-white px-5 py-2.5 rounded-2xl border border-zinc-200 shadow-sm">
          Total Orders: <span className="font-semibold text-zinc-900">{orders.length}</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
          <p className="text-sm text-zinc-500">Total Revenue</p>
          <p className="text-3xl font-bold text-emerald-600 mt-3">
            ${orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
          <p className="text-sm text-zinc-500">Pending Orders</p>
          <p className="text-3xl font-bold text-amber-600 mt-3">
            {orders.filter(o => o.status === 'PENDING').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
          <p className="text-sm text-zinc-500">Shipped</p>
          <p className="text-3xl font-bold text-blue-600 mt-3">
            {orders.filter(o => o.status === 'SHIPPED').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
          <p className="text-sm text-zinc-500">Delivered</p>
          <p className="text-3xl font-bold text-emerald-600 mt-3">
            {orders.filter(o => o.status === 'DELIVERED').length}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-zinc-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="px-8 py-6 text-left text-sm font-semibold text-zinc-600">Order #</th>
                <th className="px-8 py-6 text-left text-sm font-semibold text-zinc-600">Customer</th>
                <th className="px-8 py-6 text-left text-sm font-semibold text-zinc-600">Items</th>
                <th className="px-8 py-6 text-left text-sm font-semibold text-zinc-600">Total</th>
                <th className="px-8 py-6 text-left text-sm font-semibold text-zinc-600">Status</th>
                <th className="px-8 py-6 text-left text-sm font-semibold text-zinc-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-8 py-7 font-mono text-sm font-medium text-zinc-900">
                    #{order.orderNumber}
                  </td>
                  
                  <td className="px-8 py-7">
                    <div className="font-semibold text-zinc-900">{order.customerName}</div>
                    <div className="text-sm text-zinc-500 mt-0.5">{order.customerEmail}</div>
                  </td>

                  <td className="px-8 py-7">
                    <div className="text-sm space-y-1">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="text-zinc-600">
                          {item.productName} ×{item.quantity}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="text-xs text-zinc-400">
                          +{order.items.length - 3} more
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-8 py-7 font-semibold text-lg text-zinc-900">
                    ${order.total.toFixed(2)}
                  </td>

                  <td className="px-8 py-7">
                    <OrderStatusSelect 
                      orderId={order.id} 
                      currentStatus={order.status} 
                    />
                  </td>

                  <td className="px-8 py-7 text-sm text-zinc-500">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-20 text-zinc-400">
            No orders found yet.
          </div>
        )}
      </div>
    </div>
  );
}