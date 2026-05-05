import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
          <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
          <nav className="space-y-2">
            <Link href="/admin" className="block px-4 py-2 rounded hover:bg-gray-800 transition">
              Dashboard
            </Link>
            <Link href="/admin/products" className="block px-4 py-2 rounded hover:bg-gray-800 transition">
              Products
            </Link>
            <Link href="/admin/orders" className="block px-4 py-2 rounded hover:bg-gray-800 transition">
              Orders
            </Link>
            <Link href="/admin/logos" className="block px-4 py-2 rounded hover:bg-gray-800 transition">
              Team Logos
            </Link>
            {/* ✅ New Theme Customiser Link */}
            <Link href="/admin/theme" className="block px-4 py-2 rounded hover:bg-gray-800 transition">
              Theme Customiser
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}