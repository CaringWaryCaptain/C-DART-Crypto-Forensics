import { useState, useEffect } from 'react';
import { Search, X, AlertTriangle, Wallet, Building2, ChevronRight } from 'lucide-react';

export interface CommandResult {
  type: 'wallet' | 'case' | 'vasp';
  id: string;
  label: string;
  sublabel: string;
  risk?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  badge?: string;
}

interface Props {
  onSelect: (result: CommandResult) => void;
}

const SUGGESTIONS: CommandResult[] = [
  { type: 'case',   id: 'CYB-2026-00182', label: 'CYB-2026-00182', sublabel: '0x742d35Cc... · $18,420 · 7 hops', risk: 'CRITICAL', badge: 'ACTIVE' },
  { type: 'case',   id: 'CYB-2026-00179', label: 'CYB-2026-00179', sublabel: '0x3a4B5c6D... · $44,100 · 5 hops', risk: 'HIGH',     badge: 'REVIEW' },
  { type: 'case',   id: 'CYB-2026-00168', label: 'CYB-2026-00168', sublabel: 'TAddr7KMx... · $91,200 · 9 hops', risk: 'CRITICAL', badge: 'ESCALATED' },
  { type: 'wallet', id: '0x742d35Cc', label: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', sublabel: 'Suspect Wallet · ETH · Risk 91/100', risk: 'CRITICAL' },
  { type: 'wallet', id: '0x3C4d5E6f', label: '0x3C4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0b1c2', sublabel: 'Exchange X Deposit Cluster', risk: 'HIGH' },
  { type: 'vasp',   id: 'Exchange X', label: 'Exchange X', sublabel: 'Primary VASP · 87% attribution · FIU-IND registered', badge: 'VASP' },
  { type: 'vasp',   id: 'Exchange Y', label: 'Exchange Y', sublabel: '8% attribution · India-accessible', badge: 'VASP' },
];

const riskColor = (r?: string) =>
  r === 'CRITICAL' ? 'var(--red)' : r === 'HIGH' ? '#ff6b35' : r === 'MEDIUM' ? 'var(--orange)' : 'var(--text-muted)';

const TypeIcon = ({ type }: { type: string }) => {
  if (type === 'wallet') return <Wallet size={13} style={{ color: 'var(--text-secondary)' }} />;
  if (type === 'vasp')   return <Building2 size={13} style={{ color: 'var(--cyan)' }} />;
  return <AlertTriangle size={13} style={{ color: 'var(--orange)' }} />;
};

export default function CommandBar({ onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  /* Ctrl+K / Cmd+K listener */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
        setQuery('');
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!open) return null;

  const results = query.trim()
    ? SUGGESTIONS.filter(s =>
        s.label.toLowerCase().includes(query.toLowerCase()) ||
        s.sublabel.toLowerCase().includes(query.toLowerCase())
      )
    : SUGGESTIONS;

  const handleSelect = (r: CommandResult) => {
    setOpen(false);
    setQuery('');
    onSelect(r);
  };

  return (
    /* Backdrop */
    <div
      onClick={() => setOpen(false)}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(6,10,18,0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '15vh',
      }}
    >
      {/* Modal */}
      <div
        onClick={e => e.stopPropagation()}
        className="animate-fade-in-up"
        style={{
          width: 600,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-lit)',
          boxShadow: '0 0 40px rgba(0,212,255,0.12)',
        }}
      >
        {/* Search input */}
        <div className="flex items-center gap-3" style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
          <Search size={15} style={{ color: 'var(--cyan)', flexShrink: 0 }} />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search case ID, wallet address, or VASP..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 13,
              color: 'var(--text-white)',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '2px 5px',
              background: 'var(--bg-hover)', border: '1px solid var(--border-lit)',
              color: 'var(--text-muted)', letterSpacing: '0.04em',
            }}>ESC</span>
          </div>
          <button onClick={() => setOpen(false)}>
            <X size={14} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
          </button>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 360, overflowY: 'auto' }}>
          {results.length === 0 && (
            <div style={{ padding: '24px 16px', textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
              No results for "<span style={{ color: 'var(--text-secondary)' }}>{query}</span>"
            </div>
          )}

          {/* Group by type */}
          {(['case', 'wallet', 'vasp'] as const).map(type => {
            const group = results.filter(r => r.type === type);
            if (!group.length) return null;
            const labels = { case: 'CASES', wallet: 'WALLETS', vasp: 'VASPS' };
            return (
              <div key={type}>
                <div style={{ padding: '8px 16px 4px', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                  {labels[type]}
                </div>
                {group.map(r => (
                  <div
                    key={r.id}
                    className="card-hover"
                    onClick={() => handleSelect(r)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 16px', cursor: 'pointer',
                    }}
                  >
                    <TypeIcon type={r.type} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 600,
                        color: r.risk ? riskColor(r.risk) : 'var(--text-white)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {r.label}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{r.sublabel}</div>
                    </div>
                    {r.risk && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '1px 6px',
                        background: `${riskColor(r.risk)}15`,
                        color: riskColor(r.risk),
                        border: `1px solid ${riskColor(r.risk)}40`,
                        letterSpacing: '0.05em',
                        flexShrink: 0,
                      }}>{r.risk}</span>
                    )}
                    {r.badge && r.badge !== r.risk && (
                      <span className="badge-cyan" style={{ flexShrink: 0 }}>{r.badge}</span>
                    )}
                    <ChevronRight size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4" style={{ padding: '8px 16px', borderTop: '1px solid var(--border)', background: 'var(--bg-floor)' }}>
          {[
            ['↵', 'Open'],
            ['ESC', 'Close'],
            ['↑↓', 'Navigate'],
          ].map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span style={{ fontSize: 9, padding: '1px 5px', background: 'var(--bg-hover)', border: '1px solid var(--border-lit)', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>{key}</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{label}</span>
            </div>
          ))}
          <div className="ml-auto" style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
            CTRL+K to toggle
          </div>
        </div>
      </div>
    </div>
  );
}
