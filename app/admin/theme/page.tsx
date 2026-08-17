'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Palette, 
  Sparkles, 
  Check, 
  RotateCcw, 
  Save, 
  Eye,
  Sliders,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

// Curated 1-click theme presets
const PRESET_THEMES = [
  {
    name: 'Electric Blue (Default)',
    description: 'Clean modern athletic blue with golden highlights',
    theme: {
      primary: '#2563eb',
      secondary: '#0f172a',
      accent: '#f59e0b',
      background: '#f8fafc',
      text: '#0f172a',
      cardBg: '#ffffff',
    },
  },
  {
    name: 'Obsidian Stealth',
    description: 'Deep sleek dark athletic palette with vibrant cyan',
    theme: {
      primary: '#06b6d4',
      secondary: '#090d16',
      accent: '#38bdf8',
      background: '#0b0f19',
      text: '#f1f5f9',
      cardBg: '#131b2e',
    },
  },
  {
    name: 'Crimson Velocity',
    description: 'High adrenaline red with warm amber and deep navy',
    theme: {
      primary: '#dc2626',
      secondary: '#18181b',
      accent: '#f97316',
      background: '#fafafa',
      text: '#18181b',
      cardBg: '#ffffff',
    },
  },
  {
    name: 'Emerald Elite',
    description: 'Prestigious pitch green with champagne gold trim',
    theme: {
      primary: '#059669',
      secondary: '#064e3b',
      accent: '#fbbf24',
      background: '#f0fdf4',
      text: '#064e3b',
      cardBg: '#ffffff',
    },
  },
  {
    name: 'Cyberpunk Gold',
    description: 'Bold contrast black & yellow streetwear sports style',
    theme: {
      primary: '#eab308',
      secondary: '#18181b',
      accent: '#fbbf24',
      background: '#09090b',
      text: '#fafafa',
      cardBg: '#18181b',
    },
  },
  {
    name: 'Royal Purple',
    description: 'Majestic violet with neon magenta accent',
    theme: {
      primary: '#7c3aed',
      secondary: '#2e1065',
      accent: '#f43f5e',
      background: '#faf5ff',
      text: '#2e1065',
      cardBg: '#ffffff',
    },
  },
];

export default function ThemeCustomiser() {
  const { theme, setTheme, isLoading } = useTheme();
  const [localTheme, setLocalTheme] = useState(theme);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocalTheme(theme);
  }, [theme]);

  const handleChange = (key: keyof typeof localTheme, value: string) => {
    setLocalTheme((prev) => ({ ...prev, [key]: value }));
  };

  const applyPreset = (presetTheme: typeof localTheme) => {
    setLocalTheme(presetTheme);
    toast.success('Preset applied! Click "Save Theme" to persist.');
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
      if (updated.primary) {
        setTheme(updated);
        toast.success('Theme saved and applied across the entire website!');
      }
    } catch (error) {
      toast.error('Failed to save theme');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const colorFields: Array<{
    key: keyof typeof localTheme;
    label: string;
    description: string;
  }> = [
    {
      key: 'primary',
      label: 'Primary Color',
      description: 'Used for primary buttons, active category pills, quick action indicators, and links.',
    },
    {
      key: 'secondary',
      label: 'Secondary Color',
      description: 'Used for the top navbar header, mobile drawer menu, and main footer background.',
    },
    {
      key: 'accent',
      label: 'Accent Highlight',
      description: 'Used for "NEW" badges, discount banners, cart badge counters, and special CTA buttons.',
    },
    {
      key: 'background',
      label: 'Page Background',
      description: 'The global backdrop color of all pages (catalog, product detail, customizer).',
    },
    {
      key: 'text',
      label: 'Main Typography',
      description: 'Primary text color for product titles, pricing, descriptions, and headings.',
    },
    {
      key: 'cardBg',
      label: 'Card & Container Background',
      description: 'Surface background for product cards, shopping bag items, and form panels.',
    },
  ];

  return (
    <div className="min-h-screen py-10" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight" style={{ color: 'var(--color-text)' }}>
                Theme Customizer
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize global palette, typography, and contrast tokens in real-time.
              </p>
            </div>
          </div>

          <button
            onClick={saveTheme}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider text-white shadow-xl hover:opacity-95 active:scale-95 transition disabled:opacity-50"
            style={{ backgroundColor: localTheme.primary }}
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Theme'}</span>
          </button>
        </div>

        {/* 1-Click Curated Presets Grid */}
        <div className="mb-10 bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">
              1-Click Designer Themes
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRESET_THEMES.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset.theme)}
                className="text-left p-4 rounded-2xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                      {preset.name}
                    </span>
                    {/* Swatch Preview Bar */}
                    <div className="flex gap-1">
                      <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: preset.theme.primary }} />
                      <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: preset.theme.secondary }} />
                      <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: preset.theme.accent }} />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {preset.description}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  <span>Apply Preset</span>
                  <span>→</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main 2-Column Section: Color Pickers + Live Interactive Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Custom Color Pickers (7 Cols on LG) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-xl space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <Sliders className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">
                Custom Palette Tokens
              </h2>
            </div>

            <div className="space-y-5">
              {colorFields.map((field) => (
                <div key={field.key} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wide text-slate-800">
                      {field.label}
                    </label>
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                      {localTheme[field.key]}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {field.description}
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="color"
                      value={localTheme[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="w-10 h-10 rounded-xl border border-slate-300 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={localTheme[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={saveTheme}
              disabled={saving}
              className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-white shadow-xl hover:opacity-95 active:scale-95 transition disabled:opacity-50 mt-4"
              style={{ backgroundColor: localTheme.primary }}
            >
              {saving ? 'Saving Changes...' : 'Save & Publish Theme'}
            </button>
          </div>

          {/* Live Interactive Preview Box (5 Cols on LG) */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Live Component Preview
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  Active Realtime
                </span>
              </div>

              {/* Mock Canvas Container */}
              <div 
                className="p-5 rounded-2xl border transition-colors duration-200 space-y-4"
                style={{
                  backgroundColor: localTheme.background,
                  color: localTheme.text,
                  borderColor: 'rgba(0,0,0,0.1)',
                }}
              >
                {/* Mock Mini Header */}
                <div 
                  className="p-3 rounded-xl flex items-center justify-between text-white shadow-sm"
                  style={{ backgroundColor: localTheme.secondary }}
                >
                  <span className="font-black italic text-xs uppercase">
                    TEE<span style={{ color: localTheme.accent }}>HUB</span>
                  </span>
                  <div className="flex gap-2">
                    <span className="text-[10px] opacity-80">Jerseys</span>
                    <span className="text-[10px] opacity-80">Pants</span>
                    <span 
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded text-black"
                      style={{ backgroundColor: localTheme.accent }}
                    >
                      Bag (3)
                    </span>
                  </div>
                </div>

                {/* Mock Product Card */}
                <div 
                  className="p-4 rounded-xl border shadow-sm space-y-3"
                  style={{
                    backgroundColor: localTheme.cardBg,
                    borderColor: 'rgba(0,0,0,0.08)',
                  }}
                >
                  <div className="relative h-28 w-full rounded-lg bg-slate-200 flex items-center justify-center overflow-hidden">
                    <span className="text-xs font-bold text-slate-400">Product Image</span>
                    <span 
                      className="absolute top-2 left-2 text-[9px] font-black uppercase px-2 py-0.5 rounded text-black"
                      style={{ backgroundColor: localTheme.accent }}
                    >
                      NEW
                    </span>
                  </div>

                  <div>
                    <span 
                      className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: `${localTheme.primary}15`,
                        color: localTheme.primary,
                      }}
                    >
                      Official Jersey
                    </span>
                    <h4 className="font-bold text-sm mt-1" style={{ color: localTheme.text }}>
                      2026 Home Match Kit
                    </h4>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-black/5">
                    <span className="text-base font-black" style={{ color: localTheme.text }}>
                      $59.99
                    </span>
                    <button 
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm"
                      style={{ backgroundColor: localTheme.primary }}
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>

                {/* Pill & Button test row */}
                <div className="flex gap-2 pt-1">
                  <button
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-white text-center shadow-sm"
                    style={{ backgroundColor: localTheme.primary }}
                  >
                    Primary Action
                  </button>
                  <button
                    className="px-4 py-2 rounded-xl text-xs font-bold text-black text-center shadow-sm"
                    style={{ backgroundColor: localTheme.accent }}
                  >
                    Accent
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
