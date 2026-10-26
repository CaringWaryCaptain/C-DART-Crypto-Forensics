import React from 'react';
import { ArrowDown, Hash, DollarSign, Clock, Tag, ChevronRight } from 'lucide-react';
import type { EvidenceStep } from '../../data/syntheticCase';

interface Props {
  steps: EvidenceStep[];
  primaryVasp: string;
}

const stepColors = ['#ef4444', '#f97316', '#eab308', '#06b6d4', '#a855f7', '#3b82f6', '#22c55e'];

export default function Explainability({ steps, primaryVasp }: Props) {
  return (
    <div className="p-5 h-full overflow-auto space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white mb-1">
          Why did we identify <span className="text-blue-400">{primaryVasp}</span>?
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Full blockchain evidence chain — every conclusion is backed by verifiable transaction data.
          We never say "AI identified it." Here is the evidence:
        </p>
      </div>

      {/* Evidence chain */}
      <div className="space-y-0">
        {steps.map((step, i) => {
          const color = stepColors[i % stepColors.length];
          const isLast = i === steps.length - 1;

          return (
            <div key={step.order} className="relative flex gap-4">
              {/* Timeline line */}
              <div className="flex flex-col items-center" style={{ width: 32 }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 z-10"
                  style={{ background: `${color}18`, border: `2px solid ${color}`, color }}>
                  {step.order}
                </div>
                {!isLast && (
                  <div className="w-px flex-1 mt-1" style={{ background: `linear-gradient(${color}66, ${stepColors[(i+1)%stepColors.length]}66)`, minHeight: 24 }} />
                )}
              </div>

              {/* Content card */}
              <div className={`flex-1 card p-4 mb-3 animate-fade-in-up ${isLast ? 'glow-blue' : ''}`}
                style={{ border: `1px solid ${color}33`, animationDelay: `${i * 0.08}s` }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-xs font-semibold mb-0.5" style={{ color }}>STEP {step.order}</div>
                    <div className="text-sm font-bold text-white">{step.label}</div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                    {step.classification}
                  </span>
                </div>

                {/* Address & TX */}
                <div className="grid grid-cols-1 gap-1.5 mb-3">
                  <div className="flex items-center gap-2 text-xs">
                    <Tag size={11} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ color: 'var(--text-muted)' }}>Address:</span>
                    <span className="font-mono text-white">{step.address.slice(0, 12)}...{step.address.slice(-6)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Hash size={11} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ color: 'var(--text-muted)' }}>TX Hash:</span>
                    <span className="font-mono" style={{ color: '#60a5fa' }}>{step.txHash.slice(0, 18)}...</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <DollarSign size={11} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ color: 'var(--text-muted)' }}>Amount:</span>
                    <span className="font-semibold text-white">${step.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Clock size={11} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ color: 'var(--text-muted)' }}>Time:</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{new Date(step.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                {/* Reason */}
                <div className="rounded-lg p-3 text-xs leading-relaxed"
                  style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                  <span className="font-semibold text-white mr-1">Reason:</span>{step.reason}
                </div>

                {/* Arrow */}
                {!isLast && (
                  <div className="flex justify-center mt-3">
                    <ArrowDown size={14} style={{ color: 'var(--text-muted)' }} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary box */}
      <div className="card p-4" style={{ border: '1px solid rgba(59,130,246,0.35)' }}>
        <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
          <ChevronRight size={15} className="text-blue-400" />
          Attribution Summary
        </h3>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          The 7-hop fund trail from the victim-reported wallet (0x742d...f44e) to <strong className="text-blue-400">{primaryVasp}</strong> was
          reconstructed using on-chain transaction data. The attribution is supported by: (1) deposit address cluster matching,
          (2) multi-path convergence on the same VASP cluster, (3) behavioral pattern analysis consistent with exchange deposits,
          and (4) 82% of all traced funds reaching {primaryVasp}'s verified hot wallet.
        </p>
        <div className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          All evidence hashes, addresses, and amounts above are from the synthetic demonstration dataset.
        </div>
      </div>
    </div>
  );
}
