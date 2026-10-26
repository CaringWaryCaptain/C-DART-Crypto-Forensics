import { useState } from 'react';
import type { InvestigationCase } from '../../data/syntheticCase';
import { GitBranch, Layers } from 'lucide-react';

interface Props { caseData: InvestigationCase; }

export default function ClusterView({ caseData }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const clusters = [
    {
      id: 'suspect',
      label: 'SUSPECT CLUSTER',
      sublabel: 'Victim-reported origin',
      color: '#ef4444',
      bg: 'rgba(239,68,68,0.06)',
      border: '#ef4444',
      wallets: [`Suspect Wallet (${caseData.suspectWallet.slice(0, 6)}...${caseData.suspectWallet.slice(-4)})`, 'First Relay Node'],
      totalFlow: `$${caseData.reportedAmount.toLocaleString()}`,
      txCount: 2,
      description: `Funds originated at reported address ${caseData.suspectWallet}. First outbound transfer initiated immediate movement across network.`,
    },
    {
      id: 'layering',
      label: 'LAYERING CLUSTER',
      sublabel: 'Smurfing & obfuscation',
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.06)',
      border: '#f59e0b',
      wallets: ['Intermediary Splitting Nodes ×4', 'Peel Tranche Accounts ×8'],
      totalFlow: `$${Math.round(caseData.reportedAmount * 0.96).toLocaleString()}`,
      txCount: Math.round(caseData.transactionsAnalysed * 0.45),
      description: 'Funds were distributed across intermediate addresses to evade high-value threshold surveillance.',
    },
    {
      id: 'consolidation',
      label: 'CONSOLIDATION CLUSTER',
      sublabel: 'Re-aggregation hub',
      color: '#8b5cf6',
      bg: 'rgba(139,92,246,0.06)',
      border: '#8b5cf6',
      wallets: ['Consolidation Proxy Hub', 'Secondary Escrow Relay'],
      totalFlow: `$${Math.round(caseData.reportedAmount * 0.88).toLocaleString()}`,
      txCount: Math.round(caseData.transactionsAnalysed * 0.3),
      description: 'Split funds were gathered and re-routed prior to deposit sweeps into centralized cryptocurrency exchanges.',
    },
    {
      id: 'vasp',
      label: 'VASP INTEGRATION CLUSTER',
      sublabel: `${caseData.likelyVasp} (${caseData.attributionConfidence}% match)`,
      color: '#10b981',
      bg: 'rgba(16,185,129,0.06)',
      border: '#10b981',
      wallets: [`${caseData.likelyVasp} Deposit Cluster`, `${caseData.likelyVasp} Omnibus Hot Wallet`],
      totalFlow: `$${caseData.amountTraced.toLocaleString()}`,
      txCount: Math.round(caseData.transactionsAnalysed * 0.15) || 3,
      description: `${Math.round((caseData.amountTraced / caseData.reportedAmount) * 100)}% of traced funds reached ${caseData.likelyVasp}. Section 91 CrPC notice ready for submission.`,
    },
  ];

  const flows = [
    { from: 'suspect', to: 'layering', amount: `$${Math.round(caseData.reportedAmount * 0.96).toLocaleString()}`, label: 'SPLIT (Smurfing)' },
    { from: 'layering', to: 'consolidation', amount: `$${Math.round(caseData.reportedAmount * 0.88).toLocaleString()}`, label: 'CONSOLIDATE' },
    { from: 'consolidation', to: 'vasp', amount: `$${caseData.amountTraced.toLocaleString()}`, label: 'DEPOSIT' },
  ];

  const sel = clusters.find(c => c.id === selected);

  return (
    <div className="p-5 h-full overflow-auto space-y-5" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <Layers size={18} className="text-slate-800" />
          <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
            Wallet Cluster Architecture · FATF Laundering Stages
          </h2>
        </div>
        <div className="text-xs font-mono text-slate-500 font-semibold">
          CASE: {caseData.caseId} · {caseData.likelyVasp} ({caseData.attributionConfidence}%)
        </div>
      </div>

      {/* Laundering stage timeline summary */}
      <div className="grid grid-cols-4 gap-3">
        {clusters.map((c, i) => (
          <div
            key={c.id}
            onClick={() => setSelected(c.id === selected ? null : c.id)}
            className="card p-4 cursor-pointer transition-all hover:border-slate-800"
            style={{
              borderColor: selected === c.id ? '#0f172a' : undefined,
              boxShadow: selected === c.id ? '0 0 0 1px #0f172a' : undefined,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">STAGE {i + 1}</span>
              <span className="text-xs font-mono font-bold" style={{ color: c.color }}>{c.totalFlow}</span>
            </div>
            <div className="font-bold text-xs text-slate-900 uppercase mb-1">{c.label}</div>
            <div className="text-[11px] text-slate-500">{c.sublabel}</div>
          </div>
        ))}
      </div>

      {/* Selected detail panel */}
      {sel && (
        <div className="card p-4 animate-fade-in-up border-slate-400">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase">{sel.label} Details</h3>
            <span className="text-xs font-mono font-bold" style={{ color: sel.color }}>{sel.totalFlow} Total</span>
          </div>
          <p className="text-xs text-slate-600 mb-3">{sel.description}</p>
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Associated Wallet Nodes:</div>
            {sel.wallets.map((w, idx) => (
              <div key={idx} className="text-xs font-mono text-slate-800 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                {w}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Flow visualization bar */}
      <div className="card p-4 space-y-3">
        <div className="text-xs font-bold uppercase text-slate-600">Fund Flow Path Across Clusters</div>
        <div className="flex items-center justify-between gap-2 text-xs font-mono">
          {flows.map((f, idx) => (
            <div key={idx} className="flex-1 p-2.5 rounded bg-slate-50 border border-slate-200 text-center">
              <div className="text-[10px] font-bold text-slate-500 uppercase">{f.label}</div>
              <div className="text-sm font-bold text-slate-900 mt-1">{f.amount}</div>
              <div className="text-[10px] text-slate-500 uppercase mt-0.5">{f.from} → {f.to}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
