'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { PhotoIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

interface Logo {
  id: string;
  name: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
}

export default function LogosAdminPage() {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Logo | null>(null);
  const [form, setForm] = useState({ name: '', imageUrl: '', order: 0 });
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  // ✅ Add a ref to always have the latest image URL
  const imageUrlRef = useRef<string>('');

  const fetchLogos = async () => {
    const res = await fetch('/api/logos');
    const data = await res.json();
    setLogos(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogos();
  }, []);

  const uploadFile = async (file: File) => {
    setUploading(true);
    setFormError('');
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        // Update both state and the ref
        setForm(prev => ({ ...prev, imageUrl: data.url }));
        imageUrlRef.current = data.url;
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch {
      alert('Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // ✅ Validate using the ref (latest value) or the state
    const currentImageUrl = imageUrlRef.current || form.imageUrl.trim();
    if (!currentImageUrl) {
      setFormError('Please provide an image URL or upload an image.');
      return;
    }
    setFormError('');

    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/logos/${editing.id}` : '/api/logos';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, imageUrl: currentImageUrl }),
    });
    if (res.ok) {
      fetchLogos();
      setEditing(null);
      setForm({ name: '', imageUrl: '', order: 0 });
      imageUrlRef.current = ''; // reset ref
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to save logo');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this logo?')) return;
    await fetch(`/api/logos/${id}`, { method: 'DELETE' });
    fetchLogos();
  };

  const handleEdit = (logo: Logo) => {
    setEditing(logo);
    setForm({ name: logo.name, imageUrl: logo.imageUrl, order: logo.order });
    imageUrlRef.current = logo.imageUrl;
    setFormError('');
  };

  if (loading) return <div className="p-8 text-gray-900">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Team Logos</h1>
      <p className="text-gray-700 mb-8">Add, edit, or remove partner logos displayed on the homepage.</p>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{editing ? 'Edit Logo' : 'Add New Logo'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Team Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Image URL * (or upload below)</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={form.imageUrl}
                onChange={(e) => {
                  setForm({ ...form, imageUrl: e.target.value });
                  imageUrlRef.current = e.target.value;
                  if (formError) setFormError('');
                }}
                required
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
                placeholder="https://... or /uploads/..."
              />
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition">
                <PhotoIcon className="w-5 h-5" /> Upload Image
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
              </label>
            </div>
            {uploading && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
            {formError && <p className="text-sm text-red-600 mt-1">{formError}</p>}
            {(form.imageUrl || imageUrlRef.current) && (
              <div className="mt-3 flex items-center gap-3">
                <div className="relative h-12 w-12 border rounded overflow-hidden bg-gray-50">
                  <Image
                    src={imageUrlRef.current || form.imageUrl}
                    alt="Preview"
                    fill
                    className="object-contain"
                    sizes="48px"
                  />
                </div>
                <span className="text-xs text-gray-600 break-all">{imageUrlRef.current || form.imageUrl}</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Display Order</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
              className="w-32 border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
            />
            <p className="text-xs text-gray-600 mt-1">Lower numbers appear first.</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={uploading} className="bg-blue-700 hover:bg-blue-800 text-white font-medium px-6 py-2 rounded-lg transition">
              {editing ? 'Update Logo' : 'Create Logo'}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setForm({ name: '', imageUrl: '', order: 0 });
                  imageUrlRef.current = '';
                  setFormError('');
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Current Logos</h3>
        {logos.length === 0 ? (
          <p className="text-gray-600">No logos yet. Add your first logo above.</p>
        ) : (
          <div className="space-y-3">
            {logos.map((logo) => (
              <div key={logo.id} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative h-12 w-12 flex-shrink-0 bg-gray-50 rounded overflow-hidden">
                  <Image src={logo.imageUrl} alt={logo.name} fill className="object-contain" sizes="48px" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{logo.name}</p>
                  <p className="text-xs text-gray-500">Order: {logo.order}</p>
                </div>
                <button onClick={() => handleEdit(logo)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition">
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button onClick={() => handleDelete(logo.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full transition">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}