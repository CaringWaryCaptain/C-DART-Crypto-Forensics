import React, { useState } from 'react';
import { AlertTriangle, Zap, GitBranch, ArrowDown, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import type { FraudPattern } from '../../data/syntheticCase';

interface Props {
  patterns: FraudPattern[];
}

const patternIcons: Record<string, React.ElementType> = {
  rapid_hopping: Zap,
  fund_splitting: GitBranch,
  fund_consolidation: ArrowDown,
  exchange_convergence: AlertTriangle,
  cross_chain: Globe,
};

const severityStyles: Record<string, { badge: string; glow: string; borderColor: string }> = {
  HIGH: { badge: 'badge-high', glow: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.25)' },
  MEDIUM: { badge: 'badge-medium', glow: 'rgba(249,115,22,0.08)', borderColor: 'rgba(249,115,22,0.25)' },
  LOW: { badge: 'badge-low', glow: 'rgba(234,179,8,0.08)', borderColor: 'rgba(234,179,8,0.25)' },
};

function PatternCard({ pattern }: { pattern: FraudPattern }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = patternIcons[pattern.type] || AlertTriangle;
  const styles = severityStyles[pattern.severity];
  const sevColor = pattern.severity === 'HIGH' ? '#ef4444' : pattern.severity === 'MEDIUM' ? '#f97316' : '#eab308';

  return (
    <div className="rounded-xl overflow-hidden transition-all" style={{ background: styles.glow, border: `1px solid ${styles.borderColor}` }}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: `${sevColor}18`, border: `1px solid ${sevColor}33` }}>
            <Icon size={16} style={{ color: sevColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${styles.badge}`}>
                🔴 {pattern.severity}
              </span>
              {pattern.txCount && (
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{pattern.txCount} txns</span>
              )}
              {pattern.timeWindowMinutes && (
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>in {pattern.timeWindowMinutes} min</span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">{pattern.title}</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {pattern.description}
            </p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-shrink-0 p-1 rounded transition-colors hover:bg-white/5"
            style={{ color: 'var(--text-muted)' }}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Affected wallets */}
        <div className="mt-3 flex flex-wrap gap-1.5 ml-12">
          {pattern.affectedWallets.map(wId => (
            <span key={wId} className="font-mono text-xs px-2 py-0.5 rounded"
              style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>
              {wId}
            </span>
          ))}
        </div>
      </div>

      {/* Expanded evidence */}
      {expanded && (
        <div className="px-4 pb-4 pt-0 ml-12 animate-fade-in-up">
          <div className="rounded-lg p-3 text-xs leading-relaxed" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>📋 EVIDENCE</div>
            <p style={{ color: 'var(--text-secondary)' }}>{pattern.evidence}</p>
            <div className="mt-2 flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span>Detected:</span>
              <span className="font-mono">{new Date(pattern.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FraudPatterns({ patterns }: Props) {
  const high = patterns.filter(p => p.severity === 'HIGH');
  const med = patterns.filter(p => p.severity === 'MEDIUM');

  return (
    <div className="p-5 h-full overflow-auto">
      <div className="flex items-center gap-3 mb-5">
        <AlertTriangle size={18} className="text-red-400" />
        <h2 className="font-semibold text-white">Fraud Pattern Detection</h2>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full badge-high font-bold">{high.length} HIGH</span>
          {med.length > 0 && <span className="text-xs px-2 py-1 rounded-full badge-medium font-bold">{med.length} MEDIUM</span>}
        </div>
      </div>

      {/* Visual summary */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { type: 'rapid_hopping', label: 'Rapid Hopping', icon: Zap, detected: true, severity: 'HIGH' },
          { type: 'fund_splitting', label: 'Fund Splitting', icon: GitBranch, detected: true, severity: 'HIGH' },
          { type: 'fund_consolidation', label: 'Consolidation', icon: ArrowDown, detected: true, severity: 'HIGH' },
          { type: 'exchange_convergence', label: 'Exchange Convergence', icon: AlertTriangle, detected: true, severity: 'HIGH' },
        ].map(p => {
          const Icon = p.icon;
          return (
            <div key={p.type} className="card p-3 text-center">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
                style={{ background: p.detected ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.08)' }}>
                <Icon size={15} style={{ color: p.detected ? '#ef4444' : '#22c55e' }} />
              </div>
              <div className="text-xs font-medium text-white mb-0.5">{p.label}</div>
              <div className={`text-xs font-bold ${p.detected ? 'text-red-400' : 'text-green-400'}`}>
                {p.detected ? '⚠ DETECTED' : '✓ CLEAR'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        {patterns.map(p => <PatternCard key={p.id} pattern={p} />)}
      </div>

      <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', color: 'var(--text-secondary)' }}>
        <strong className="text-blue-400">Pattern Detection Note:</strong> All patterns detected using heuristic rules on simulated blockchain transaction data.
        This is an analytical prototype — detected patterns require investigator verification before legal action.
      </div>
    </div>
  );
}
