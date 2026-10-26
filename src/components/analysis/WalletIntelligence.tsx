import React from 'react';
import { Wallet, AlertTriangle, Calendar, ArrowUpRight, ArrowDownLeft, Hash, Tag, Network } from 'lucide-react';
import type { Wallet as WalletType, Transaction } from '../../data/syntheticCase';

interface Props {
  wallet: WalletType | null;
  relatedTransactions: Transaction[];
  allWallets: WalletType[];
  onSelectWallet: (w: WalletType) => void;
}

function RiskBar({ score }: { score: number }) {
  const color = score >= 80 ? '#ef4444' : score >= 60 ? '#f97316' : score >= 40 ? '#eab308' : '#22c55e';
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span style={{ color: 'var(--text-secondary)' }}>Risk Score</span>
        <span className="font-bold" style={{ color }}>{score}/100</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
      </div>
    </div>
  );
}

const typeLabels: Record<string, string> = {
  suspect: 'Suspect Wallet',
  intermediate: 'Intermediate',
  exchange_deposit: 'Exchange Deposit',
  vasp: 'VASP Hot Wallet',
  bridge: 'Bridge Relay',
  mixer: 'Mixer/Relay',
};

export default function WalletIntelligence({ wallet, relatedTransactions, allWallets, onSelectWallet }: Props) {
  if (!wallet) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full text-center">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <Wallet size={20} style={{ color: 'var(--text-muted)' }} />
        </div>
        <h3 className="font-semibold text-white mb-2">Wallet Intelligence</h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Click any wallet node in the Transaction Graph to view detailed intelligence.
        </p>
        <div className="mt-6 space-y-2 w-full max-w-xs">
          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>OR SELECT A WALLET BELOW</p>
          {allWallets.slice(0, 8).map(w => (
            <button
              key={w.id}
              onClick={() => onSelectWallet(w)}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all card card-hover"
              style={{ color: 'var(--text-secondary)' }}
            >
              <div className="font-medium text-white">{w.label}</div>
              <div style={{ fontSize: 10 }}>{w.shortAddress}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const sevColor = wallet.riskScore >= 80 ? '#ef4444' : wallet.riskScore >= 60 ? '#f97316' : '#22c55e';
  const connectedWallets = allWallets.filter(w =>
    relatedTransactions.some(t => (t.from === wallet.id && t.to === w.id) || (t.to === wallet.id && t.from === w.id))
  ).slice(0, 8);

  return (
    <div className="p-5 h-full overflow-auto space-y-4 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Wallet size={18} className="text-blue-400" />
        <h2 className="font-semibold text-white">Wallet Intelligence</h2>
        {wallet.flagged && (
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full badge-high font-bold flex items-center gap-1">
            <AlertTriangle size={10} /> FLAGGED
          </span>
        )}
      </div>

      {/* Address card */}
      <div className="card p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>ADDRESS</div>
            <div className="font-mono text-sm text-white break-all leading-relaxed">{wallet.address}</div>
          </div>
          <div className="text-xs px-2 py-1 rounded-lg ml-3 flex-shrink-0"
            style={{ background: `${sevColor}18`, color: sevColor, border: `1px solid ${sevColor}33` }}>
            {typeLabels[wallet.type] || wallet.type}
          </div>
        </div>

        <RiskBar score={wallet.riskScore} />

        <div className="grid grid-cols-2 gap-3 mt-4">
          {[
            { icon: Calendar, label: 'First Seen', value: new Date(wallet.firstSeen).toLocaleDateString() },
            { icon: Calendar, label: 'Last Seen', value: new Date(wallet.lastSeen).toLocaleDateString() },
            { icon: Hash, label: 'Transactions', value: wallet.txCount.toLocaleString() },
            { icon: Network, label: 'Connected', value: connectedWallets.length + ' wallets' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-lg p-3" style={{ background: 'var(--bg-secondary)' }}>
              <div className="flex items-center gap-1.5 mb-1">
                <Icon size={11} style={{ color: 'var(--text-muted)' }} />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
              </div>
              <div className="text-sm font-semibold text-white">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial summary */}
      <div className="card p-4">
        <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>FINANCIAL SUMMARY</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <ArrowDownLeft size={14} className="text-green-400" /> Incoming
            </div>
            <span className="font-bold text-green-400 font-mono">${wallet.totalIncoming.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <ArrowUpRight size={14} className="text-red-400" /> Outgoing
            </div>
            <span className="font-bold text-red-400 font-mono">${wallet.totalOutgoing.toLocaleString()}</span>
          </div>
          <div className="pt-2" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Net retained</span>
              <span className="font-semibold text-white font-mono">${(wallet.totalIncoming - wallet.totalOutgoing).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="card p-4">
        <h3 className="text-xs font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
          <Tag size={11} /> INTELLIGENCE TAGS
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {wallet.tags.map(t => (
            <span key={t} className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(59,130,246,0.08)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>
              {t}
            </span>
          ))}
        </div>
        {wallet.knownService && (
          <div className="mt-3 pt-3 text-xs" style={{ borderTop: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Known Service: </span>
            <span className="text-yellow-400 font-semibold">{wallet.knownService}</span>
          </div>
        )}
      </div>

      {/* Connected wallets */}
      {connectedWallets.length > 0 && (
        <div className="card p-4">
          <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>CONNECTED WALLETS</h3>
          <div className="space-y-2">
            {connectedWallets.map(w => (
              <button
                key={w.id}
                onClick={() => onSelectWallet(w)}
                className="w-full flex items-center gap-3 text-left p-2.5 rounded-lg transition-all hover:bg-white/5"
              >
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: w.riskScore >= 80 ? '#ef4444' : w.riskScore >= 60 ? '#f97316' : '#22c55e' }} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">{w.label}</div>
                  <div className="font-mono text-xs" style={{ color: 'var(--text-muted)', fontSize: 10 }}>{w.shortAddress}</div>
                </div>
                <div className="text-xs font-bold" style={{ color: w.riskScore >= 80 ? '#ef4444' : w.riskScore >= 60 ? '#f97316' : '#22c55e' }}>
                  {w.riskScore}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
