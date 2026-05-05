'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeCustomiser() {
  const { theme, setTheme, isLoading } = useTheme();
  const [localTheme, setLocalTheme] = useState(theme);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocalTheme(theme);
  }, [theme]);

  const handleChange = (key: keyof typeof localTheme, value: string) => {
    setLocalTheme(prev => ({ ...prev, [key]: value }));
  };

  const saveTheme = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localTheme),
      });
      const updated = await res.json();
      if (updated.primary) setTheme(updated);
      alert('Theme saved!');
    } catch (error) {
      alert('Failed to save theme');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 text-gray-900">Loading theme settings...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Theme Customiser</h1>
      <p className="text-gray-700 mb-6">Change colours of the entire website – changes apply instantly to all pages.</p>

      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 border border-gray-200">
        {/* Primary Colour */}
        <div className="border-b border-gray-100 pb-5">
          <label className="block font-bold text-gray-800 mb-1">Primary Colour</label>
          <p className="text-sm text-gray-500 mb-3">Used for: buttons, active category pills, cart badge, "Proceed to Checkout" button, primary links.</p>
          <div className="flex gap-3 items-center">
            <input
              type="color"
              value={localTheme.primary}
              onChange={(e) => handleChange('primary', e.target.value)}
              className="w-12 h-12 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={localTheme.primary}
              onChange={(e) => handleChange('primary', e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 font-mono text-gray-900"
            />
          </div>
        </div>

        {/* Secondary Colour */}
        <div className="border-b border-gray-100 pb-5">
          <label className="block font-bold text-gray-800 mb-1">Secondary Colour</label>
          <p className="text-sm text-gray-500 mb-3">Used for: navbar background gradient (with primary), footer background, dropdown menus.</p>
          <div className="flex gap-3 items-center">
            <input type="color" value={localTheme.secondary} onChange={(e) => handleChange('secondary', e.target.value)} className="w-12 h-12 rounded border" />
            <input type="text" value={localTheme.secondary} onChange={(e) => handleChange('secondary', e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 font-mono text-gray-900" />
          </div>
        </div>

        {/* Accent Colour */}
        <div className="border-b border-gray-100 pb-5">
          <label className="block font-bold text-gray-800 mb-1">Accent Colour</label>
          <p className="text-sm text-gray-500 mb-3">Used for: "NEW" badges, low stock badges, cart badge background, secondary buttons.</p>
          <div className="flex gap-3 items-center">
            <input type="color" value={localTheme.accent} onChange={(e) => handleChange('accent', e.target.value)} className="w-12 h-12 rounded border" />
            <input type="text" value={localTheme.accent} onChange={(e) => handleChange('accent', e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 font-mono text-gray-900" />
          </div>
        </div>

        {/* Page Background */}
        <div className="border-b border-gray-100 pb-5">
          <label className="block font-bold text-gray-800 mb-1">Page Background</label>
          <p className="text-sm text-gray-500 mb-3">The main background colour of every page (outside cards and containers).</p>
          <div className="flex gap-3 items-center">
            <input type="color" value={localTheme.background} onChange={(e) => handleChange('background', e.target.value)} className="w-12 h-12 rounded border" />
            <input type="text" value={localTheme.background} onChange={(e) => handleChange('background', e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 font-mono text-gray-900" />
          </div>
        </div>

        {/* Text Colour */}
        <div className="border-b border-gray-100 pb-5">
          <label className="block font-bold text-gray-800 mb-1">Text Colour</label>
          <p className="text-sm text-gray-500 mb-3">Main text colour for product names, prices, headings, and general content.</p>
          <div className="flex gap-3 items-center">
            <input type="color" value={localTheme.text} onChange={(e) => handleChange('text', e.target.value)} className="w-12 h-12 rounded border" />
            <input type="text" value={localTheme.text} onChange={(e) => handleChange('text', e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 font-mono text-gray-900" />
          </div>
        </div>

        {/* Card Background */}
        <div className="pb-2">
          <label className="block font-bold text-gray-800 mb-1">Card Background</label>
          <p className="text-sm text-gray-500 mb-3">Background of product cards, cart items, order summary, checkout forms.</p>
          <div className="flex gap-3 items-center">
            <input type="color" value={localTheme.cardBg} onChange={(e) => handleChange('cardBg', e.target.value)} className="w-12 h-12 rounded border" />
            <input type="text" value={localTheme.cardBg} onChange={(e) => handleChange('cardBg', e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 font-mono text-gray-900" />
          </div>
        </div>

        <button
          onClick={saveTheme}
          disabled={saving}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 mt-4"
        >
          {saving ? 'Saving...' : 'Save Theme'}
        </button>
      </div>

      {/* Live Preview */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Live Preview</h2>
        <div
          className="p-4 rounded-xl border transition-colors"
          style={{
            backgroundColor: localTheme.cardBg,
            color: localTheme.text,
            borderColor: `${localTheme.text}20`,
          }}
        >
          <p>This card shows how your background and text colours will look.</p>
          <div className="mt-3 flex gap-2">
            <button
              className="px-4 py-2 rounded-lg text-white transition"
              style={{ backgroundColor: localTheme.primary }}
            >
              Primary Button
            </button>
            <button
              className="px-4 py-2 rounded-lg transition"
              style={{ backgroundColor: localTheme.accent, color: '#000' }}
            >
              Accent Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}