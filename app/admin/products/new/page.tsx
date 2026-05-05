'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Link from 'next/link';

// Dynamically import ProductForm (client‑only)
const ProductForm = dynamic(() => import('@/components/ProductForm'), { 
  ssr: false,
  loading: () => <FormSkeleton /> 
});

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link 
            href="/admin/products" 
            className="text-sm font-medium text-zinc-600 hover:text-blue-600 transition-colors flex items-center gap-2"
          >
            ← Back to Products
          </Link>
        </nav>

        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">
            Add New Product
          </h1>
          <p className="text-zinc-600 mt-2 text-lg">
            Configure the details, images, and specifications for your new inventory item.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-zinc-200 p-8 md:p-12">
          <Suspense fallback={<FormSkeleton />}>
            <ProductForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton loader – prevents layout shift while the form loads.
 */
function FormSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="grid grid-cols-2 gap-6">
        <div className="h-12 bg-zinc-100 rounded-xl" />
        <div className="h-12 bg-zinc-100 rounded-xl" />
      </div>
      <div className="h-32 bg-zinc-100 rounded-xl" />
      <div className="grid grid-cols-2 gap-8">
        <div className="h-48 bg-zinc-100 rounded-2xl" />
        <div className="h-48 bg-zinc-100 rounded-2xl" />
      </div>
      <div className="h-14 bg-zinc-200 rounded-xl" />
    </div>
  );
}