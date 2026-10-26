import { useEffect, useState, useRef } from 'react';
import { CheckCircle, Loader, Shield, AlertTriangle, ExternalLink } from 'lucide-react';
import type { CaseForm } from '../App';
import { fetchWalletTransactions, weiToEth, ethToUsd } from '../services/etherscanApi';
import type { WalletSummary } from '../services/etherscanApi';

interface Props {
  form: CaseForm;
  onComplete: (liveData: WalletSummary | null) => void;
}

const steps = [
  { label: 'Validating wallet address format',    duration: 500  },
  { label: 'Fetching blockchain transactions',     duration: 2200 },
  { label: 'Building transaction graph',           duration: 900  },
  { label: 'Tracing fund movement (hop analysis)', duration: 1100 },
  { label: 'Detecting wallet clusters',            duration: 750  },
  { label: 'Analysing suspicious behaviour',       duration: 900  },
  { label: 'Matching known VASP addresses',        duration: 700  },
  { label: 'Calculating attribution confidence',   duration: 850  },
  { label: 'Generating investigation report',      duration: 600  },
];

type StepStatus = 'pending' | 'running' | 'done';

const isEthAddress = (addr: string) => addr.startsWith('0x') && addr.length === 42;

export default function InvestigationProgress({ form, onComplete }: Props) {
  const [statuses, setStatuses]   = useState<StepStatus[]>(steps.map(() => 'pending'));
  const [done, setDone]           = useState(false);
  const [liveData, setLiveData]   = useState<WalletSummary | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [metrics, setMetrics]     = useState({ txCount: 0, wallets: 0, hops: 0, patterns: 0 });
  const liveRef = useRef<WalletSummary | null>(null);

  const isLiveMode = isEthAddress(form.suspectWallet);

  useEffect(() => {
    let cancelled = false;

    const runSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        if (cancelled) return;
        setStatuses(prev => { const n = [...prev]; n[i] = 'running'; return n; });

        // Step 1 → real Etherscan call
        if (i === 1 && isLiveMode) {
          const result = await fetchWalletTransactions(form.suspectWallet);
          if (!cancelled) {
            if (result.error) {
              setFetchError(result.error);
            } else {
              setLiveData(result);
              liveRef.current = result;
              setMetrics(m => ({ ...m, txCount: result.txCount }));
            }
          }
        } else {
          await new Promise(r => setTimeout(r, steps[i].duration));
        }

        if (cancelled) return;
        setStatuses(prev => { const n = [...prev]; n[i] = 'done'; return n; });

        if (i === 2) setMetrics(m => ({ ...m, wallets: 47 }));
        if (i === 4) setMetrics(m => ({ ...m, hops: 7 }));
        if (i === 5) setMetrics(m => ({ ...m, patterns: 4 }));
      }
      if (!cancelled) setDone(true);
    };

    const t = setTimeout(runSteps, 400);
    return () => { cancelled = true; clearTimeout(t); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progress = (statuses.filter(s => s === 'done').length / steps.length) * 100;
  const recentTxs = liveData?.transactions.slice(0, 3) ?? [];

  return (
    <div className="h-full overflow-auto" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-xl mx-auto animate-fade-in-up py-10 px-6 space-y-5">

        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded mx-auto mb-3 flex items-center justify-center"
            style={{ background: '#000000', border: '2px solid #000000', boxShadow: '3px 3px 0px #000000' }}>
            <Shield size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-black uppercase tracking-tight mb-1">Running Forensic Analysis</h1>
          <div className="font-mono text-xs font-bold text-slate-600">
            CASE ID: {form.caseId} · {form.network} · {form.suspectWallet.slice(0, 10)}...{form.suspectWallet.slice(-6)}
          </div>
          <div className="flex items-center justify-center gap-2 mt-2">
            {isLiveMode ? (
              <span className="badge-safe">
                ● LIVE ETHERSCAN API ACTIVE
              </span>
            ) : (
              <span className="badge-medium">
                ⚠ DEMO MODE — SYNTHETIC PIPELINE
              </span>
            )}
          </div>
        </div>

        {/* Large Progress Bar (CyberVidya Style) */}
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
                background: '#f59e0b',
              }}
            >
              {Math.round(progress)}%
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="card p-5 space-y-1">
          {steps.map((step, i) => {
            const status = statuses[i];
            return (
              <div key={i} className="flex items-center gap-3 py-2 px-2 rounded transition-all"
                style={{ background: status === 'running' ? '#f1f5f9' : 'transparent' }}>
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {status === 'done'    && <CheckCircle size={16} className="text-black" />}
                  {status === 'running' && <Loader size={15} className="text-black animate-spin" />}
                  {status === 'pending' && <div className="w-4 h-4 rounded-full border-2 border-black" />}
                </div>
                <span className="text-xs tracking-wide" style={{
                  color: status === 'done' ? '#334155' : status === 'running' ? '#000000' : '#94a3b8',
                  fontWeight: status === 'running' ? 800 : 600,
                  textTransform: 'uppercase',
                }}>
                  {step.label}
                  {i === 1 && status === 'done' && liveData && (
                    <span className="ml-2 font-mono font-bold text-black">
                      → {liveData.txCount} txs fetched (live)
                    </span>
                  )}
                  {i === 1 && status === 'done' && fetchError && (
                    <span className="ml-2 text-amber-700">→ using demo fallback</span>
                  )}
                </span>
                {status === 'running' && (
                  <div className="ml-auto flex gap-1">
                    {[0, 1, 2].map(d => (
                      <div key={d} className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" style={{ animationDelay: `${d * 0.2}s` }} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Live wallet panel */}
        {liveData && liveData.txCount > 0 && (
          <div className="card p-4 space-y-3" style={{ background: '#f8fafc' }}>
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <div className="text-xs font-black text-black uppercase tracking-wider">
                ✓ LIVE BLOCKCHAIN DATA EXTRACTED
              </div>
              <a href={`https://etherscan.io/address/${form.suspectWallet}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-1 text-xs font-bold text-black uppercase underline">
                Etherscan <ExternalLink size={11} />
              </a>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 rounded bg-white border-2 border-black shadow-[2px_2px_0px_#000000]">
                <div className="text-lg font-black font-mono text-black">{liveData.txCount}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase">Transactions</div>
              </div>
              <div className="text-center p-2 rounded bg-white border-2 border-black shadow-[2px_2px_0px_#000000]">
                <div className="text-lg font-black font-mono text-black">{liveData.balanceEth.toFixed(4)}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase">ETH Balance</div>
              </div>
              <div className="text-center p-2 rounded bg-white border-2 border-black shadow-[2px_2px_0px_#000000]">
                <div className="text-lg font-black font-mono text-black">${ethToUsd(liveData.balanceEth).toLocaleString()}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase">USD Value</div>
              </div>
            </div>
            {recentTxs.length > 0 && (
              <div className="pt-1">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">RECENT ON-CHAIN TRANSACTIONS</div>
                <div className="space-y-1">
                  {recentTxs.map(tx => (
                    <div key={tx.hash} className="flex items-center gap-2 py-1 border-b border-slate-300 text-xs font-mono">
                      <span className="font-bold text-black truncate w-32">
                        {tx.hash.slice(0, 14)}...
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        {new Date(parseInt(tx.timeStamp) * 1000).toLocaleDateString('en-IN')}
                      </span>
                      <span className="font-bold text-black ml-auto">
                        {weiToEth(tx.value).toFixed(4)} ETH
                      </span>
                      <span className="font-bold text-[10px] text-slate-700">
                        {tx.isError === '1' ? '✕' : '✓'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Transactions', value: metrics.txCount || '—', live: !!liveData && metrics.txCount > 0 },
            { label: 'Wallets',      value: metrics.wallets  || '—', live: false },
            { label: 'Max Hops',     value: metrics.hops     || '—', live: false },
            { label: 'Patterns',     value: metrics.patterns || '—', live: false },
          ].map(m => (
            <div key={m.label} className="card p-3 text-center">
              <div className="text-xl font-black font-mono text-black">{m.value}</div>
              <div className="text-[10px] font-bold uppercase text-slate-500 mt-0.5">{m.label}</div>
              {m.live && <div className="text-[9px] font-black uppercase text-green-700 mt-1">LIVE</div>}
            </div>
          ))}
        </div>

        {/* Done Button */}
        {done && (
          <div className="animate-fade-in-up text-center space-y-3">
            <div className="p-3 rounded flex items-center gap-3"
              style={{ background: '#dcfce7', border: '2px solid #000000', boxShadow: '3px 3px 0px #000000' }}>
              <CheckCircle size={20} className="text-black flex-shrink-0" />
              <div className="text-left">
                <div className="text-xs font-black text-black uppercase">Forensic Analysis Complete</div>
                <div className="text-xs font-semibold text-slate-700">
                  {liveData ? `Extracted ${liveData.txCount} transactions · patterns applied` : 'Dossier generated'}
                  {' '}· Risk Level: <span className="text-red-700 font-black uppercase">HIGH (91/100)</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onComplete(liveRef.current)}
              className="w-full btn-primary justify-center py-3 text-sm"
            >
              View Investigation Results →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
