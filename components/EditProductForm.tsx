'use client';

import { useRouter } from 'next/navigation';
import { updateProduct } from '@/actions/product-actions';
import ProductForm from './ProductForm';

export default function EditProductForm({ product }: { product: any }) {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    formData.append('id', product.id);
    const result = await updateProduct(formData);
    if (result.success) {
      router.push('/admin/products');
      router.refresh();
    } else {
      alert(result.error || 'Failed to update product');
    }
  };

  // Prepare initialData with all fields
  const initialData = {
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    category: product.category?.name || product.category || '', // ✅ Handle both relation and string
    imageUrl: product.imageUrl,
    images: product.images,      // JSON string
    features: product.features,  // JSON string
    specs: product.specs,        // JSON string
    isFeatured: product.isFeatured || false, // ✅ Added featured toggle
  };

  return <ProductForm initialData={initialData} onSubmit={handleSubmit} />;
}