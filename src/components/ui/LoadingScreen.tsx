/**
 * RELIC - Loading Screen
 * Dark cinematic loading screen with pulsing gold relic and excavation copy.
 * Shows briefly on first load while the intelligence layer initializes.
 */

import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'scanning' | 'clustering' | 'mapping' | 'done'>('scanning');

  useEffect(() => {
    const phases: { label: typeof phase; duration: number; target: number }[] = [
      { label: 'scanning', duration: 500, target: 35 },
      { label: 'clustering', duration: 500, target: 70 },
      { label: 'mapping', duration: 400, target: 95 },
    ];

    let totalElapsed = 0;
    let currentPhaseIdx = 0;

    const tick = setInterval(() => {
      totalElapsed += 50;
      const p = phases[currentPhaseIdx];
      const elapsed = totalElapsed - phases.slice(0, currentPhaseIdx).reduce((a, b) => a + b.duration, 0);
      const frac = Math.min(elapsed / p.duration, 1);
      const prevTarget = currentPhaseIdx > 0 ? phases[currentPhaseIdx - 1].target : 0;
      setProgress(Math.round(prevTarget + (p.target - prevTarget) * frac));
      setPhase(p.label);

      if (elapsed >= p.duration) {
        currentPhaseIdx++;
        if (currentPhaseIdx >= phases.length) {
          clearInterval(tick);
          setProgress(100);
          setTimeout(onComplete, 300);
        }
      }
    }, 50);

    return () => clearInterval(tick);
  }, [onComplete]);

  const phaseLabels: Record<typeof phase, string> = {
    scanning: 'Scanning digital residues...',
    clustering: 'Clustering moments in time...',
    mapping: 'Mapping the reliquary...',
    done: 'Excavation complete.',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070B14]"
      style={{ animation: progress === 100 ? 'fadeOut 0.4s ease forwards' : undefined }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading RELIC"
    >
      {/* Pulsing gold relic orb */}
      <div className="relative mb-10">
        <div
          className="w-16 h-16 rounded-full border-2 border-[#C9A227]"
          style={{
            background: 'radial-gradient(circle at 40% 35%, #F59E0B, #78350F 70%, #451A03)',
            boxShadow: '0 0 40px #C9A22760, 0 0 80px #C9A22730',
            animation: 'relicPulse 1.6s ease-in-out infinite',
          }}
        />
        {/* Orbiting ring */}
        <div
          className="absolute inset-0 rounded-full border border-[#C9A227]/30"
          style={{
            transform: 'scale(1.5)',
            animation: 'relicOrbit 3s linear infinite',
          }}
        />
        <div
          className="absolute inset-0 rounded-full border border-[#38BDF8]/20"
          style={{
            transform: 'scale(2.0)',
            animation: 'relicOrbit 5s linear infinite reverse',
          }}
        />
      </div>

      {/* Title */}
      <h1
        className="font-serif text-3xl font-bold tracking-widest mb-2"
        style={{ color: '#C9A227', textShadow: '0 0 20px #C9A22760' }}
      >
        RELIC
      </h1>
      <p className="text-[11px] font-mono text-slate-500 tracking-[0.3em] uppercase mb-10">
        Digital Life Excavation
      </p>

      {/* Phase label */}
      <p className="text-xs text-[#E8D5A3] font-mono mb-4 h-4 transition-all duration-300">
        {phaseLabels[phase]}
      </p>

      {/* Progress bar */}
      <div className="w-48 h-0.5 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-200"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #78350F, #C9A227)',
            boxShadow: '0 0 8px #C9A227',
          }}
        />
      </div>
      <p className="text-[10px] font-mono text-slate-600 mt-2">{progress}%</p>
    </div>
  );
}
