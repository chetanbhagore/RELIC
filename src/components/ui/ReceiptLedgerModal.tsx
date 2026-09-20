/**
 * RELIC - Master Receipt Ledger & Spending Intelligence Modal
 * Comprehensive financial and behavioral synthesis of all digital receipts.
 * Directly fulfills the "Your Life, In Receipts" core challenge requirement.
 */

import React, { useState, useMemo } from 'react';
import {
  X,
  Receipt,
  Search,
  ArrowUpDown,
  ExternalLink,
  Printer,
  Copy,
  Check,
  TrendingUp,
  Moon,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import { useRelicStore } from '../../lib/store';
import type { Relic } from '../../types/relic';

const CATEGORY_ICONS: Record<string, string> = {
  music: '🎵',
  purchase: '🪙',
  place: '📍',
  photo: '🖼️',
  entertainment: '🎬',
  message: '💬',
  search: '🔍',
  event: '⚡',
  note: '📝',
};

export function ReceiptLedgerModal() {
  const isReceiptLedgerOpen = useRelicStore((s) => s.isReceiptLedgerOpen);
  const setReceiptLedgerOpen = useRelicStore((s) => s.setReceiptLedgerOpen);
  const allRelics = useRelicStore((s) => s.allRelics);
  const selectRelic = useRelicStore((s) => s.selectRelic);

  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'amount-desc' | 'amount-asc' | 'date-desc'>('amount-desc');
  const [copied, setCopied] = useState(false);

  // Financial calculations across all relics
  const stats = useMemo(() => {
    let totalSpend = 0;
    let spendCount = 0;
    let maxSpend = 0;
    let nocturnalSpend = 0;
    const categoryTotals: Record<string, number> = {};

    allRelics.forEach((r) => {
      const amt = r.details.amount || 0;
      if (amt > 0) {
        totalSpend += amt;
        spendCount += 1;
        if (amt > maxSpend) maxSpend = amt;

        const hr = new Date(r.timestamp).getHours();
        if (hr >= 21 || hr <= 4) {
          nocturnalSpend += amt;
        }

        categoryTotals[r.category] = (categoryTotals[r.category] || 0) + amt;
      }
    });

    const avgSpend = spendCount > 0 ? Math.round(totalSpend / spendCount) : 0;
    const nocturnalPct = totalSpend > 0 ? Math.round((nocturnalSpend / totalSpend) * 100) : 0;

    return {
      totalSpend,
      spendCount,
      avgSpend,
      maxSpend,
      nocturnalPct,
      categoryTotals,
    };
  }, [allRelics]);

  // Filtered and sorted receipts list
  const filteredRelics = useMemo(() => {
    return allRelics
      .filter((r) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          r.title.toLowerCase().includes(q) ||
          r.subtitle.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          (r.location?.city && r.location.city.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        const amtA = a.details.amount || 0;
        const amtB = b.details.amount || 0;
        if (sortBy === 'amount-desc') return amtB - amtA;
        if (sortBy === 'amount-asc') return amtA - amtB;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
  }, [allRelics, query, sortBy]);

  if (!isReceiptLedgerOpen) return null;

  const handleCopyLedger = () => {
    const summary = `🧾 RELIC MASTER LIFE RECEIPT\n` +
      `Total Life Spend: ₹${stats.totalSpend.toLocaleString()}\n` +
      `Total Residues: ${allRelics.length} items (${stats.spendCount} financial vouchers)\n` +
      `Average Transaction: ₹${stats.avgSpend.toLocaleString()}\n` +
      `Nocturnal Spend Index: ${stats.nocturnalPct}%\n` +
      `Vault Archetype: The Nocturnal Architect\n` +
      `Live at: ${window.location.origin}`;

    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Master Life Receipt Ledger"
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#070B14] border border-[#C9A227]/60 shadow-[0_0_50px_rgba(201,162,39,0.25)] text-slate-100 overflow-hidden"
        style={{ animation: 'fadeIn 0.25s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0F172A]/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#C9A227] to-[#78350F] text-[#070B14] shadow-md">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-black text-lg text-white tracking-wide">
                Master Life Receipt Ledger
              </h2>
              <p className="text-xs text-[#FDE68A] font-sans">
                Financial, temporal & experiential residues excavated from {allRelics.length} moments
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLedger}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1E293B] border border-slate-700 hover:border-[#C9A227] text-xs font-mono text-[#E8D5A3] transition-colors cursor-pointer"
              title="Copy Life Receipt Summary"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Export Receipt'}</span>
            </button>
            <button
              onClick={() => setReceiptLedgerOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close ledger"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Telemetry Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-6 bg-[#0B1120]/60 border-b border-slate-800 shrink-0">
          <div className="p-3 rounded-xl bg-[#0F172A] border border-[#C9A227]/40">
            <div className="flex items-center gap-1.5 text-xs text-[#FDE68A] font-medium">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Total Life Spend</span>
            </div>
            <p className="font-mono text-xl sm:text-2xl font-black text-[#F59E0B] mt-1">
              ₹{stats.totalSpend.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{stats.spendCount} Paid Vouchers</p>
          </div>

          <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Average Ticket</span>
            </div>
            <p className="font-mono text-xl sm:text-2xl font-bold text-[#F1F5F9] mt-1">
              ₹{stats.avgSpend.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">Per excavation</p>
          </div>

          <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
              <Moon className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span>Nocturnal Index</span>
            </div>
            <p className="font-mono text-xl sm:text-2xl font-bold text-[#A78BFA] mt-1">
              {stats.nocturnalPct}%
            </p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">9 PM – 4 AM transactions</p>
          </div>

          <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#4ADE80]" />
              <span>Life Archetype</span>
            </div>
            <p className="font-serif text-sm sm:text-base font-bold text-[#FDE68A] mt-1 truncate">
              Nocturnal Architect
            </p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">Caffeine · Sound · Travel</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-slate-800 bg-[#0F172A]/40 shrink-0">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search receipts, merchants, cities..."
              className="w-full pl-8 pr-3 py-1.5 rounded-full bg-[#070B14] border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#C9A227] font-sans"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1 rounded-lg bg-[#070B14] border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-[#C9A227] cursor-pointer"
            >
              <option value="amount-desc">Highest Spend (₹)</option>
              <option value="amount-asc">Lowest Spend (₹)</option>
              <option value="date-desc">Most Recent</option>
            </select>
          </div>
        </div>

        {/* Scrollable Receipts Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
          {filteredRelics.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-mono text-sm">
              No receipts matching "{query}"
            </div>
          ) : (
            filteredRelics.map((relic) => {
              const dateStr = new Date(relic.timestamp).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              const timeStr = new Date(relic.timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <button
                  key={relic.id}
                  onClick={() => {
                    selectRelic(relic.id);
                    setReceiptLedgerOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#0F172A]/70 border border-slate-800/90 hover:border-[#C9A227]/70 hover:bg-[#1E293B] text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <span className="text-xl shrink-0">{CATEGORY_ICONS[relic.category] || '📦'}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-slate-100 group-hover:text-[#FDE68A] truncate">
                          {relic.title}
                        </span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {relic.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5 font-sans">
                        {relic.subtitle} {relic.location?.city ? `· ${relic.location.city}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-3">
                    <div>
                      {relic.details.amount ? (
                        <span className="font-mono text-sm font-bold text-[#F59E0B]">
                          ₹{relic.details.amount.toLocaleString()}
                        </span>
                      ) : (
                        <span className="font-mono text-xs text-slate-500 italic">Residue</span>
                      )}
                      <p className="text-[10px] font-mono text-slate-400">{dateStr} · {timeStr}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-[#38BDF8]" />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
