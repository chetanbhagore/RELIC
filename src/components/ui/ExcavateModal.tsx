/**
 * RELIC - Real-Time Artifact Excavation Modal
 * Allows judges and users to ingest custom receipts and digital relics
 * into the 3D Vault on the fly with automatic clustering and celebration.
 */

import React, { useState } from 'react';
import { X, Sparkles, Plus, MapPin, IndianRupee, Tag, FileText } from 'lucide-react';
import { useRelicStore } from '../../lib/store';
import type { RelicCategory, MoodSignature } from '../../types/relic';

const CATEGORIES: { key: RelicCategory; label: string; icon: string }[] = [
  { key: 'purchase', label: 'Purchase Receipt', icon: '🪙' },
  { key: 'music', label: 'Music Scrobble', icon: '🎵' },
  { key: 'place', label: 'Location Check-in', icon: '📍' },
  { key: 'photo', label: 'Photo Memory', icon: '🖼️' },
  { key: 'entertainment', label: 'Entertainment/Cinema', icon: '🎬' },
  { key: 'message', label: 'Saved Message', icon: '💬' },
  { key: 'note', label: 'Personal Note', icon: '📝' },
];

const MOODS: MoodSignature[] = ['euphoric', 'focused', 'nostalgic', 'serene', 'restless', 'melancholic'];

export function ExcavateModal() {
  const isExcavateModalOpen = useRelicStore((s) => s.isExcavateModalOpen);
  const setExcavateModalOpen = useRelicStore((s) => s.setExcavateModalOpen);
  const addRelic = useRelicStore((s) => s.addRelic);

  const [category, setCategory] = useState<RelicCategory>('purchase');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [amount, setAmount] = useState('');
  const [city, setCity] = useState('Bangalore');
  const [mood, setMood] = useState<MoodSignature>('focused');
  const [snippet, setSnippet] = useState('');

  if (!isExcavateModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addRelic({
      title: title.trim(),
      subtitle: subtitle.trim() || `${category.toUpperCase()} Excavation`,
      category,
      details: {
        amount: amount ? parseFloat(amount) : undefined,
        sentiment: mood,
        contextSnippet: snippet.trim() || `Excavated during live interactive vault session in ${city}.`,
        tags: ['live-excavated', category, mood],
      },
      location: {
        city: city.trim() || 'Unknown City',
        name: city.trim() || 'Excavation Site',
        coordinates: [19.076, 72.8777],
      },
    });

    setTitle('');
    setSubtitle('');
    setAmount('');
    setSnippet('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Excavate New Relic"
    >
      <div
        className="relative w-full max-w-lg p-5 sm:p-6 rounded-2xl bg-[#070B14] border border-[#C9A227]/60 shadow-[0_0_50px_rgba(201,162,39,0.3)] text-slate-100 overflow-hidden"
        style={{ animation: 'slideInUp 0.25s cubic-bezier(0.16,1,0.3,1)' }}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#C9A227] to-[#78350F] text-[#070B14]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-black text-lg text-white tracking-wide">
                Excavate New Digital Relic
              </h2>
              <p className="text-xs text-[#FDE68A]">
                Inject your live receipt into the 3D royal memory vault
              </p>
            </div>
          </div>

          <button
            onClick={() => setExcavateModalOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-4 text-xs">
          {/* Category Selector */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1.5">RELIC CATEGORY</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setCategory(cat.key)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                    category === cat.key
                      ? 'bg-[#1E293B] border-[#C9A227] text-white shadow-sm ring-1 ring-[#C9A227]'
                      : 'bg-[#0F172A] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title & Merchant */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">RELIC / ITEM NAME *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Midnight Filter Coffee"
                className="w-full px-3 py-2 rounded-lg bg-[#0F172A] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#C9A227]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">MERCHANT / SOURCE</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Blue Tokai Roasters"
                className="w-full px-3 py-2 rounded-lg bg-[#0F172A] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#C9A227]"
              />
            </div>
          </div>

          {/* Amount & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">AMOUNT IN INR (₹)</label>
              <div className="relative">
                <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 340"
                  className="w-full pl-8 pr-3 py-2 rounded-lg bg-[#0F172A] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">CITY / GEOLOCATION</label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bangalore, Mumbai"
                  className="w-full pl-8 pr-3 py-2 rounded-lg bg-[#0F172A] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>
          </div>

          {/* Emotional Resonance */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">EMOTIONAL RESONANCE</label>
            <div className="flex flex-wrap gap-1.5">
              {MOODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono capitalize transition-all cursor-pointer ${
                    mood === m
                      ? 'bg-[#C9A227] text-[#070B14] font-bold shadow-sm'
                      : 'bg-[#0F172A] border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Context Snippet */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">RESIDUE MEMO / CONTEXT</label>
            <textarea
              rows={2}
              value={snippet}
              onChange={(e) => setSnippet(e.target.value)}
              placeholder="e.g. 'Celebration dinner after shipping the v1 beta release'"
              className="w-full px-3 py-2 rounded-lg bg-[#0F172A] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#C9A227] resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setExcavateModalOpen(false)}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-gradient-to-r from-[#C9A227] to-[#F59E0B] text-[#070B14] font-bold shadow-lg shadow-[#C9A227]/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Excavate into 3D Vault</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
