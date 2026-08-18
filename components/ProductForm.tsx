'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ArrowUpIcon, ArrowDownIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface ProductFormProps {
  initialData?: any;
  onSubmit?: (formData: FormData) => Promise<void>;
}

export default function ProductForm({ initialData, onSubmit }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>(['']);
  const [specs, setSpecs] = useState<string[]>(['']);
  const [uploading, setUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const newImageUrlRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setImageUrl(initialData.imageUrl || '');
      setGalleryImages(initialData.images ? JSON.parse(initialData.images || '[]') : []);
      setFeatures(initialData.features ? JSON.parse(initialData.features || '[]') : ['']);
      setSpecs(initialData.specs ? JSON.parse(initialData.specs || '[]') : ['']);
      setIsFeatured(initialData.isFeatured || false);
    } else {
      setImageUrl('');
      setGalleryImages([]);
      setFeatures(['']);
      setSpecs(['']);
      setIsFeatured(false);
    }
    setError('');
  }, [initialData]);

  const uploadFile = useCallback(async (file: File, onSuccess: (url: string) => void, setUploadingState: (loading: boolean) => void) => {
    setUploadingState(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) onSuccess(data.url);
      else alert(data.error || 'Upload failed');
    } catch {
      alert('Upload failed');
    } finally {
      setUploadingState(false);
    }
  }, []);

  const handlePrimaryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file, setImageUrl, setUploading);
  };

  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file, (url) => setGalleryImages(prev => [...prev, url]), setGalleryUploading);
  };

  const addGalleryUrl = () => {
    const url = newImageUrlRef.current?.value.trim();
    if (url) {
      setGalleryImages(prev => [...prev, url]);
      if (newImageUrlRef.current) newImageUrlRef.current.value = '';
    }
  };

  const moveGalleryImage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      setGalleryImages(prev => {
        const updated = [...prev];
        [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
        return updated;
      });
    } else if (direction === 'down' && index < galleryImages.length - 1) {
      setGalleryImages(prev => {
        const updated = [...prev];
        [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
        return updated;
      });
    }
  };

  const removeGalleryImage = (index: number) => setGalleryImages(prev => prev.filter((_, i) => i !== index));

  const addFeature = () => setFeatures(prev => [...prev, '']);
  const removeFeature = (idx: number) => setFeatures(prev => prev.filter((_, i) => i !== idx));
  const updateFeature = (idx: number, val: string) => setFeatures(prev => prev.map((f, i) => i === idx ? val : f));

  const addSpec = () => setSpecs(prev => [...prev, '']);
  const removeSpec = (idx: number) => setSpecs(prev => prev.filter((_, i) => i !== idx));
  const updateSpec = (idx: number, val: string) => setSpecs(prev => prev.map((s, i) => i === idx ? val : s));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      alert('Primary image is required');
      return;
    }
    setLoading(true);
    setError('');
    const formData = new FormData(e.currentTarget);
    formData.set('imageUrl', imageUrl);
    formData.set('images', JSON.stringify(galleryImages));
    formData.append('features', JSON.stringify(features.filter(f => f.trim())));
    formData.append('specs', JSON.stringify(specs.filter(s => s.trim())));
    formData.append('isFeatured', isFeatured ? 'true' : 'false');
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        const res = await fetch('/api/products', { method: 'POST', body: formData });
        const result = await res.json();
        if (result.success) {
          alert('Product created!');
          window.location.href = '/admin/products';
        } else {
          setError(result.error || 'Creation failed');
        }
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl">{error}</div>}

      {/* Basic info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Product Name *</label>
          <input type="text" name="name" required defaultValue={initialData?.name} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 text-gray-900" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Category *</label>
          <select name="category" required defaultValue={initialData?.category} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 text-gray-900">
            <option value="">Select Category</option>
            <option value="Jersey">Jersey</option>
            <option value="Pants">Pants</option>
            <option value="Shorts">Shorts</option>
            <option value="Set">Set</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-1">Description *</label>
        <textarea name="description" required rows={5} defaultValue={initialData?.description} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 text-gray-900" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Price ($) *</label>
          <input type="number" step="0.01" name="price" required defaultValue={initialData?.price} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Stock *</label>
          <input type="number" name="stock" required defaultValue={initialData?.stock} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900" />
        </div>
      </div>

      {/* Primary Image */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Primary Image *</label>
        <div className="flex items-center gap-3">
          <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl transition flex items-center gap-2">
            <PhotoIcon className="w-5 h-5" /> Upload
            <input type="file" accept="image/*" onChange={handlePrimaryFileChange} className="hidden" disabled={uploading} />
          </label>
          {uploading && <span className="text-blue-600 font-medium">Uploading...</span>}
        </div>
        <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Or paste image URL" className="w-full mt-3 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400" />
        {imageUrl && (
          <div className="mt-4 relative h-56 w-56 rounded-2xl overflow-hidden shadow-sm border">
            <Image src={imageUrl} alt="Primary Preview" fill className="object-cover" />
          </div>
        )}
      </div>

      {/* Gallery */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Gallery Images</label>
        <div className="flex flex-wrap gap-3 mb-4">
          <input ref={newImageUrlRef} type="text" placeholder="Add image URL" className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500" />
          <button type="button" onClick={addGalleryUrl} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl transition">Add URL</button>
          <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl transition flex items-center gap-2">
            <PhotoIcon className="w-5 h-5" /> Upload
            <input type="file" accept="image/*" onChange={handleGalleryFileChange} className="hidden" disabled={galleryUploading} />
          </label>
        </div>
        {galleryUploading && <p className="text-blue-600 text-sm mb-3">Uploading gallery image...</p>}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {galleryImages.map((img, idx) => (
            <div key={idx} className="relative group border border-gray-200 rounded-xl overflow-hidden h-32 bg-gray-100">
              <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                <button type="button" onClick={() => moveGalleryImage(idx, 'up')} disabled={idx === 0} className="bg-white text-gray-800 p-1.5 rounded-lg disabled:opacity-40 hover:bg-gray-100">
                  <ArrowUpIcon className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => moveGalleryImage(idx, 'down')} disabled={idx === galleryImages.length - 1} className="bg-white text-gray-800 p-1.5 rounded-lg disabled:opacity-40 hover:bg-gray-100">
                  <ArrowDownIcon className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => removeGalleryImage(idx)} className="bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-gray-600 text-sm mt-3">First gallery image will appear right after the primary image.</p>
      </div>

      {/* Key Features */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Key Features</label>
        {features.map((f, idx) => (
          <div key={idx} className="flex gap-3 mb-3">
            <input type="text" value={f} onChange={(e) => updateFeature(idx, e.target.value)} placeholder="e.g., Breathable fabric, Quick-dry" className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400" />
            <button type="button" onClick={() => removeFeature(idx)} className="text-red-600 hover:text-red-800 px-4 text-xl">✕</button>
          </div>
        ))}
        <button type="button" onClick={addFeature} className="text-blue-700 text-sm font-medium hover:underline">+ Add Feature</button>
      </div>

      {/* What's Included */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">What's Included</label>
        {specs.map((s, idx) => (
          <div key={idx} className="flex gap-3 mb-3">
            <input type="text" value={s} onChange={(e) => updateSpec(idx, e.target.value)} placeholder="e.g., Jersey, Shorts, Socks" className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400" />
            <button type="button" onClick={() => removeSpec(idx)} className="text-red-600 hover:text-red-800 px-4 text-xl">✕</button>
          </div>
        ))}
        <button type="button" onClick={addSpec} className="text-blue-700 text-sm font-medium hover:underline">+ Add Item</button>
      </div>

      {/* ─── Featured Toggle ─── */}
      <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
        <input
          type="checkbox"
          id="isFeatured"
          checked={isFeatured}
          onChange={(e) => setIsFeatured(e.target.checked)}
          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="isFeatured" className="text-sm font-semibold text-gray-900 cursor-pointer">
          Feature this product on the homepage
        </label>
      </div>

      <button type="submit" disabled={loading || uploading || galleryUploading} className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold py-4 rounded-2xl transition text-lg">
        {loading ? 'Saving...' : initialData ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  );
}