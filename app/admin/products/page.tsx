// app/admin/products/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-zinc-900 tracking-tight">Products</h1>
          <p className="text-zinc-600 mt-2">Manage your entire product catalog</p>
        </div>
        
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/30 active:scale-95"
        >
          <span className="text-xl">+</span>
          Add New Product
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
          <p className="text-sm text-zinc-500">Total Products</p>
          <p className="text-4xl font-semibold text-zinc-900 mt-2">{products.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
          <p className="text-sm text-zinc-500">Low Stock</p>
          <p className="text-4xl font-semibold text-orange-600 mt-2">
            {products.filter(p => p.stock < 10).length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
          <p className="text-sm text-zinc-500">Categories</p>
          <p className="text-4xl font-semibold text-zinc-900 mt-2">
            {new Set(products.map(p => p.category)).size}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
          <p className="text-sm text-zinc-500">Total Value</p>
          <p className="text-4xl font-semibold text-emerald-600 mt-2">
            ${products.reduce((sum, p) => sum + p.price * p.stock, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-zinc-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="px-8 py-5 text-left text-sm font-semibold text-zinc-600">Image</th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-zinc-600">Product Name</th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-zinc-600">Category</th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-zinc-600">Price</th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-zinc-600">Stock</th>
                <th className="px-8 py-5 text-right text-sm font-semibold text-zinc-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="w-14 h-14 bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-200">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-semibold text-zinc-900">{product.name}</div>
                    <div className="text-sm text-zinc-500 mt-1 line-clamp-1">{product.description?.slice(0, 80)}...</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-semibold text-zinc-900">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-8 py-6">
                    <span 
                      className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium ${
                        product.stock < 10 
                          ? 'bg-red-100 text-red-700' 
                          : product.stock < 30 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-4 opacity-80 group-hover:opacity-100 transition-all">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium transition"
                      >
                        Edit
                      </Link>
                      <DeleteButton 
                        productId={product.id} 
                        productName={product.name} 
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-20 text-zinc-400">
            No products yet. Add your first product!
          </div>
        )}
      </div>
    </div>
  );
}