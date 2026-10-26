import { useState } from 'react';
import { ArrowRight, Zap, AlertTriangle, Shield, Search, CheckCircle } from 'lucide-react';
import type { CaseForm } from '../App';
import { allDemoCases, type InvestigationCase } from '../data/syntheticCase';

interface Props {
  form: CaseForm;
  onChange: (f: CaseForm) => void;
  onStart: () => void;
  onDemo: (c?: InvestigationCase) => void;
}

const networks = ['Ethereum', 'Bitcoin', 'Tron', 'BNB Smart Chain', 'Polygon', 'Solana'];

export default function CreateInvestigation({ form, onChange, onStart, onDemo }: Props) {
  const [lastLoaded, setLastLoaded] = useState<string | null>(null);

  const set = (k: keyof CaseForm, v: string) => onChange({ ...form, [k]: v });
  const isValid = form.caseId && form.investigatorName && form.suspectWallet.startsWith('0x');

  const handleSelectPreset = (c: InvestigationCase) => {
    onChange({
      caseId: c.caseId,
      investigatorName: c.investigatorName,
      incidentDate: c.incidentDate,
      reportedAmount: String(c.reportedAmount),
      network: c.network,
      suspectWallet: c.suspectWallet,
    });
    setLastLoaded(c.caseId);
  };

  return (
    <div className="p-6 overflow-auto h-full space-y-5 pb-24" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          CASE REGISTRATION & TARGET ON-CHAIN SPECIFICATION
        </div>
        <h1 className="text-xl font-bold text-slate-900 mt-0.5">Create New Investigation</h1>
        <p className="text-xs text-slate-500 mt-1">
          Specify suspect wallet address and victim parameters. C-DART will extract on-chain evidence, calculate hop velocity, and isolate recipient exchange clusters.
        </p>
      </div>

      {/* Preset Quick-Fill Scenarios */}
      <div className="card p-4 space-y-3 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={15} className="text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Quick-Fill Forensic Scenarios (Click any preset to autofill form)
            </span>
          </div>
          {lastLoaded && (
            <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle size={12} /> {lastLoaded} Loaded into Form
            </span>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {allDemoCases.map((c, i) => {
            const isSelected = form.caseId === c.caseId;
            return (
              <button
                key={c.caseId}
                type="button"
                onClick={() => handleSelectPreset(c)}
                className="p-3 rounded-lg text-left border transition-all cursor-pointer"
                style={{
                  background: isSelected ? '#f8fafc' : '#ffffff',
                  borderColor: isSelected ? '#0f172a' : '#e2e8f0',
                  boxShadow: isSelected ? '0 0 0 1px #0f172a' : '0 1px 2px rgba(0,0,0,0.03)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400">#{i + 1} {c.caseId}</span>
                  <span className={c.riskLevel === 'HIGH' ? 'badge-high' : 'badge-medium'} style={{ fontSize: 9, padding: '1px 5px' }}>
                    {c.riskLevel}
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-900 truncate mt-1">
                  {c.caseTitle || c.crimeType}
                </div>
                <div className="text-[11px] font-mono text-slate-600 mt-1.5 flex items-center justify-between">
                  <span>${c.reportedAmount.toLocaleString()}</span>
                  <span className="text-slate-400 text-[10px]">{c.likelyVasp}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: 780 }}>
        {/* Case details */}
        <div className="card p-5 mb-5 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Shield size={14} className="text-slate-600" />
            Case Identification Parameters
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase mb-1 text-slate-600">
                CASE ID *
              </label>
              <input className="field-input" value={form.caseId}
                onChange={e => set('caseId', e.target.value)} placeholder="CYB-2026-00XXX" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase mb-1 text-slate-600">
                INVESTIGATING OFFICER *
              </label>
              <input className="field-input" style={{ fontFamily: 'Inter' }} value={form.investigatorName}
                onChange={e => set('investigatorName', e.target.value)} placeholder="SI / Inspector Name" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase mb-1 text-slate-600">
                INCIDENT DATE
              </label>
              <input className="field-input" type="date" value={form.incidentDate}
                onChange={e => set('incidentDate', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Blockchain parameters */}
        <div className="card p-5 mb-5 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Search size={14} className="text-slate-600" />
            On-Chain Forensic Target
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase mb-1 text-slate-600">
                REPORTED AMOUNT (USD)
              </label>
              <input className="field-input" value={form.reportedAmount}
                onChange={e => set('reportedAmount', e.target.value)} placeholder="18420" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase mb-1 text-slate-600">
                BLOCKCHAIN NETWORK
              </label>
              <select className="field-input" value={form.network} onChange={e => set('network', e.target.value)}>
                {networks.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase mb-1 text-slate-600">
              SUSPECT WALLET ADDRESS *
            </label>
            <input className="field-input" value={form.suspectWallet}
              onChange={e => set('suspectWallet', e.target.value)}
              placeholder="0x742d35Cc6634C0532925a3b844Bc454e4438f44e" />
            {form.suspectWallet && (
              <div className="flex items-center gap-1.5 mt-2">
                {form.suspectWallet.startsWith('0x') && form.suspectWallet.length >= 42
                  ? <><div className="live-dot" />
                      <span className="text-xs font-semibold text-emerald-700">Valid Ethereum address format</span></>
                  : <><div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-xs font-semibold text-amber-700">ETH addresses start with 0x (42 characters)</span></>
                }
              </div>
            )}
          </div>
        </div>

        {/* Legal notice */}
        <div className="card p-3.5 mb-5 flex items-start gap-2.5 bg-amber-50 border-amber-200">
          <AlertTriangle size={16} className="text-amber-700 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900 leading-relaxed">
            <strong>Statutory Notice:</strong> Queries interface with live Etherscan V2 nodes. Extracted block hashes, transaction timestamps, and flow graphs are automatically certified under Section 65B of the Indian Evidence Act.
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            className="btn-ghost text-xs"
            onClick={() => {
              const match = allDemoCases.find(c => c.caseId === form.caseId) || allDemoCases[0];
              onDemo(match);
            }}
          >
            <Zap size={13} className="text-amber-500" />
            Quick Launch Analysis Dashboard
          </button>

          <button className="btn-primary" onClick={onStart} disabled={!isValid}
            style={{ fontSize: 13, padding: '9px 22px' }}>
            <Search size={14} />
            Start Investigation (Run Pipeline)
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
