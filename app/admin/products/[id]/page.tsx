import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import EditProductForm from '@/components/EditProductForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Dynamic SEO for the Admin Panel
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({ 
    where: { id },
    select: { name: true } 
  });

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `Edit ${product.name} | Admin Dashboard`,
  };
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;

  if (!id) notFound();

  // ✅ Fetch product with category relation
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true, // Include the category relation
    },
  });

  if (!product) notFound();

  // ✅ Get category name safely
  const categoryName = product.category?.name || '';

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-20">
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        
        {/* Navigation Breadcrumb */}
        <nav className="mb-8">
          <Link 
            href="/admin/products" 
            className="text-sm font-medium text-zinc-500 hover:text-blue-600 transition-colors flex items-center gap-2 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> 
            Back to Inventory
          </Link>
        </nav>

        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-white border border-zinc-200 text-zinc-900 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
              ✏️
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">
                Edit Product
              </h1>
              <p className="text-zinc-500 mt-1 text-lg">
                Modifying: <span className="font-semibold text-zinc-700">{product.name}</span>
              </p>
              {categoryName && (
                <p className="text-xs text-zinc-400 mt-0.5">
                  Category: {categoryName}
                </p>
              )}
            </div>
          </div>
          
          {/* Quick View Link */}
          <Link 
            href={`/products/${product.id}`}
            target="_blank"
            className="text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest bg-zinc-100 px-3 py-1 rounded-md"
          >
            View Live Product ↗
          </Link>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-zinc-200/60 p-8 md:p-12">
          <EditProductForm product={product} />
        </div>
      </div>
    </div>
  );
}