/**
 * RELIC - Main Application Shell
 * Connects 3D Canvas, Royal UI overlays, and global keyboard shortcuts.
 * ENHANCED: Loading screen, echo legend, number key chapter navigation.
 */

import React, { useEffect, useState } from 'react';
import { RelicScene } from './components/canvas/RelicScene';
import { TopBar } from './components/ui/TopBar';
import { FilterPills } from './components/ui/FilterPills';
import { DetailPanel } from './components/ui/DetailPanel';
import { JourneyStrip } from './components/ui/JourneyStrip';
import { EchoModal } from './components/ui/EchoModal';
import { StatsModal } from './components/ui/StatsModal';
import { AccessibilityBar } from './components/ui/AccessibilityBar';
import { EchoLegend } from './components/ui/EchoLegend';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { ChapterBanner } from './components/ui/ChapterBanner';
import { OnboardingHint } from './components/ui/OnboardingHint';
import { ReceiptLedgerModal } from './components/ui/ReceiptLedgerModal';
import { ExcavateModal } from './components/ui/ExcavateModal';
import { useRelicStore } from './lib/store';

export function App() {
  const [isReady, setIsReady] = useState(false);

  const selectRelic = useRelicStore((s) => s.selectRelic);
  const selectedRelicId = useRelicStore((s) => s.selectedRelicId);
  const setDetailPanelOpen = useRelicStore((s) => s.setDetailPanelOpen);
  const isEchoModalOpen = useRelicStore((s) => s.isEchoModalOpen);
  const setEchoModalOpen = useRelicStore((s) => s.setEchoModalOpen);
  const isStatsModalOpen = useRelicStore((s) => s.isStatsModalOpen);
  const setStatsModalOpen = useRelicStore((s) => s.setStatsModalOpen);
  const isReceiptLedgerOpen = useRelicStore((s) => s.isReceiptLedgerOpen);
  const setReceiptLedgerOpen = useRelicStore((s) => s.setReceiptLedgerOpen);
  const isExcavateModalOpen = useRelicStore((s) => s.isExcavateModalOpen);
  const setExcavateModalOpen = useRelicStore((s) => s.setExcavateModalOpen);
  const toggleEchoMode = useRelicStore((s) => s.toggleEchoMode);
  const chapters = useRelicStore((s) => s.chapters);
  const activeChapterId = useRelicStore((s) => s.activeChapterId);
  const selectChapter = useRelicStore((s) => s.selectChapter);

  // Global Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      // Escape: Close modals or deselect relic
      if (e.key === 'Escape') {
        if (isEchoModalOpen) setEchoModalOpen(false);
        else if (isStatsModalOpen) setStatsModalOpen(false);
        else if (isReceiptLedgerOpen) setReceiptLedgerOpen(false);
        else if (isExcavateModalOpen) setExcavateModalOpen(false);
        else if (selectedRelicId) {
          selectRelic(null);
          setDetailPanelOpen(false);
        }
      }

      // E: Toggle Echo Mode
      if (e.key === 'e' || e.key === 'E') {
        toggleEchoMode();
      }

      // Number keys 1-5: Jump directly to chapter
      if (e.key >= '1' && e.key <= '5') {
        const chapterIdx = parseInt(e.key) - 1;
        if (chapters[chapterIdx]) {
          selectChapter(chapters[chapterIdx].id);
        }
        return;
      }

      // Left / Right Arrows: Cycle Chapters
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const currentIdx = chapters.findIndex((c) => c.id === activeChapterId);
        const nextIdx = (currentIdx + 1) % chapters.length;
        selectChapter(chapters[nextIdx].id);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const currentIdx = chapters.findIndex((c) => c.id === activeChapterId);
        const prevIdx = (currentIdx - 1 + chapters.length) % chapters.length;
        selectChapter(chapters[prevIdx].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isEchoModalOpen,
    isStatsModalOpen,
    selectedRelicId,
    activeChapterId,
    chapters,
    selectRelic,
    setDetailPanelOpen,
    setEchoModalOpen,
    setStatsModalOpen,
    toggleEchoMode,
    selectChapter,
  ]);

  if (!isReady) {
    return <LoadingScreen onComplete={() => setIsReady(true)} />;
  }

  return (
    <main
      className="relative w-screen h-screen overflow-hidden bg-[#070B14] font-sans antialiased text-slate-100"
      style={{ animation: 'fadeIn 0.5s ease' }}
    >
      {/* 3D Reliquary Canvas */}
      <RelicScene />

      {/* Top Bar Navigation & Controls */}
      <TopBar />

      {/* 9-Category Filter Navigation */}
      <FilterPills />

      {/* Chapter Insight HUD Banner */}
      <ChapterBanner />

      {/* First-Time User Onboarding Guide */}
      <OnboardingHint />

      {/* Slide-out Relic Detail Sheet */}
      <DetailPanel />

      {/* Echo Connection Legend (visible when echo mode active) */}
      <EchoLegend />

      {/* Bottom Chapter Journey Navigation Strip */}
      <JourneyStrip />

      {/* Echo Intelligence Inspector Modal */}
      <EchoModal />

      {/* Analytics & Persona Synthesis Modal */}
      <StatsModal />

      {/* Master Life Receipt Ledger Modal */}
      <ReceiptLedgerModal />

      {/* Live Custom Artifact Excavation Modal */}
      <ExcavateModal />

      {/* Accessibility Helper & Keyboard Hints */}
      <AccessibilityBar />
    </main>
  );
}

export default App;
