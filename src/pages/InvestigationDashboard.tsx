import React, { useState, useEffect } from 'react';
import {
  AlertTriangle, Activity, Database, GitBranch, Wallet,
  Building2, BarChart3, FileText, ArrowLeft, Shield, Clock,
  MessageSquare, Layers
} from 'lucide-react';
import { allDemoCases, getTransactionsByWallet, type InvestigationCase, type Wallet as WalletType } from '../data/syntheticCase';
import TransactionGraph from '../components/graph/TransactionGraph';
import FundFlowPanel from '../components/analysis/FundFlowPanel';
import FraudPatterns from '../components/analysis/FraudPatterns';
import WalletIntelligence from '../components/analysis/WalletIntelligence';
import VASPAttribution from '../components/analysis/VASPAttribution';
import Explainability from '../components/analysis/Explainability';
import RiskScoring from '../components/analysis/RiskScoring';
import InvestigationReport from '../components/report/InvestigationReport';
import FIRDraft from '../components/report/FIRDraft';
import ClusterView from '../components/graph/ClusterView';
import CaseNotes from '../components/analysis/CaseNotes';
import { getVASPInfo, getCountryFreezingLaws } from '../data/vaspDirectory';
import type { AppPage } from '../App';

interface Props {
  caseData: InvestigationCase;
  onNavigate: (page: AppPage) => void;
  onSwitchCase?: (c: InvestigationCase) => void;
  initialTab?: TabId;
}

export type TabId =
  | 'overview'
  | 'graph'
  | 'clusters'
  | 'fund-flow'
  | 'patterns'
  | 'wallet'
  | 'vasp'
  | 'explain'
  | 'risk'
  | 'notes'
  | 'report'
  | 'fir';

const tabs: { id: TabId; label: string; icon: React.ElementType; highlight?: boolean }[] = [
  { id: 'overview',   label: 'Overview',          icon: Activity },
  { id: 'graph',      label: 'Tx Graph',           icon: GitBranch },
  { id: 'clusters',   label: 'Cluster Map',        icon: Layers },
  { id: 'fund-flow',  label: 'Fund Flow',          icon: Database },
  { id: 'patterns',   label: 'Fraud Patterns',     icon: AlertTriangle },
  { id: 'wallet',     label: 'Wallet Intel',        icon: Wallet },
  { id: 'vasp',       label: 'VASP Attribution',   icon: Building2 },
  { id: 'explain',    label: 'Explainability',      icon: Shield },
  { id: 'risk',       label: 'Risk Score',         icon: BarChart3 },
  { id: 'notes',      label: 'Case Notes',         icon: MessageSquare },
  { id: 'report',     label: 'Report',             icon: FileText },
  { id: 'fir',        label: 'FIR Draft',          icon: FileText, highlight: true },
];

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="card p-4">
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{value}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: '#94a3b8' }}>{sub}</div>}
    </div>
  );
}

function DestWalletCard({ caseData }: { caseData: InvestigationCase }) {
  const [copied, setCopied] = useState(false);

  // Find the last VASP / exchange deposit wallet in the wallets list
  const destWallet =
    caseData.wallets.find(w => w.knownService === caseData.likelyVasp) ??
    caseData.wallets.find(w => w.type === 'vasp') ??
    caseData.wallets.find(w => w.type === 'exchange_deposit') ??
    caseData.wallets[caseData.wallets.length - 1];

  if (!destWallet) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(destWallet.address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="card p-4 border-l-4" style={{ borderLeftColor: '#0284c7' }}>
      <div className="section-header mb-3">FINAL EXCHANGE DESTINATION WALLET</div>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <Building2 size={18} className="text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          {/* Exchange name + type badge */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-bold text-slate-900 text-sm">{destWallet.knownService ?? caseData.likelyVasp}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold"
              style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}>
              {destWallet.type === 'vasp' ? 'VASP COLD VAULT' : 'EXCHANGE DEPOSIT GATEWAY'}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Last seen: {new Date(destWallet.lastSeen).toLocaleDateString('en-IN')}
            </span>
          </div>

          {/* Full wallet address */}
          <div className="flex items-center gap-2 mt-1.5">
            <code className="flex-1 text-[11px] font-mono text-blue-700 bg-blue-50 border border-blue-200 rounded px-2 py-1.5 break-all leading-relaxed">
              {destWallet.address}
            </code>
            <button
              onClick={handleCopy}
              className="flex-shrink-0 px-3 py-1.5 rounded text-[11px] font-bold transition-all cursor-pointer"
              style={{
                background: copied ? '#dcfce7' : '#eff6ff',
                color: copied ? '#15803d' : '#1d4ed8',
                border: `1px solid ${copied ? '#86efac' : '#bfdbfe'}`,
              }}
            >
              {copied ? '✓ Copied' : '⎘ Copy'}
            </button>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-600">
            <span>💰 <strong>${destWallet.totalIncoming?.toLocaleString() ?? '—'}</strong> received</span>
            <span>📦 <strong>{destWallet.txCount?.toLocaleString() ?? '—'}</strong> transactions</span>
            <span className="font-mono text-slate-400">{destWallet.shortAddress}</span>
          </div>
        </div>
      </div>

      {/* Actionable directive */}
      <div className="mt-3 text-[11px] text-amber-900 bg-amber-50 border border-amber-200 rounded px-3 py-2 flex items-center gap-2">
        <Shield size={12} className="text-amber-600 flex-shrink-0" />
        <span>
          <strong>IO Action Required:</strong> Issue formal freeze notice to{' '}
          <strong>{destWallet.knownService ?? caseData.likelyVasp}</strong> compliance desk citing
          the above wallet address. Attach hash trail from evidence chain as Annexure&nbsp;A.
        </span>
      </div>
    </div>
  );
}

export default function InvestigationDashboard({ caseData, onNavigate, onSwitchCase, initialTab }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>(initialTab || 'overview');
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleWalletClick = (wallet: WalletType) => {
    setSelectedWallet(wallet);
    setActiveTab('wallet');
  };

  const relatedTx = selectedWallet
    ? caseData.transactions.filter(t => t.from === selectedWallet.id || t.to === selectedWallet.id)
    : [];

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-primary)' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 px-4 flex-shrink-0 whitespace-nowrap"
        style={{ height: 48, background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-1.5 transition-colors font-semibold flex-shrink-0 whitespace-nowrap"
            style={{ fontSize: 12, color: '#475569', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <ArrowLeft size={14} />
            Dashboard
          </button>
          <div style={{ width: 1, height: 16, background: '#e2e8f0' }} className="flex-shrink-0" />
          <span className="whitespace-nowrap flex-shrink-0" style={{ fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700, color: '#0f172a' }}>
            {caseData.caseId}
          </span>
          <span className="whitespace-nowrap flex-shrink-0" style={{
            fontSize: 10, padding: '1px 6px', fontFamily: 'JetBrains Mono', fontWeight: 600,
            background: '#f1f5f9', color: '#475569',
            border: '1px solid #cbd5e1', borderRadius: '4px',
          }}>{caseData.network}</span>
          <span className={`${caseData.riskLevel === 'HIGH' ? 'badge-high' : 'badge-medium'} whitespace-nowrap flex-shrink-0`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <AlertTriangle size={11} />
            {caseData.riskLevel} RISK ({caseData.riskScore}/100)
          </span>

          {/* Synchronous Case Switcher Dropdown */}
          {onSwitchCase && (
            <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-slate-200 flex-shrink-0">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">SCENARIO:</span>
              <select
                className="bg-white text-slate-900 font-mono text-xs font-semibold px-2 py-1 rounded border border-slate-300 outline-none cursor-pointer max-w-[240px] truncate"
                value={caseData.caseId}
                onChange={(e) => {
                  const match = allDemoCases.find(c => c.caseId === e.target.value);
                  if (match && onSwitchCase) {
                    onSwitchCase(match);
                  }
                }}
              >
                {allDemoCases.map(c => (
                  <option key={c.caseId} value={c.caseId}>
                    {c.caseId} · {c.caseTitle || c.crimeType} (${(c.reportedAmount/1000).toFixed(1)}k)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-slate-700 flex-shrink-0 whitespace-nowrap">
          <Clock size={13} />
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748b' }}>
            {caseData.suspectWallet.slice(0, 10)}...{caseData.suspectWallet.slice(-6)}
          </span>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700, color: '#0f172a' }}>
            ${caseData.reportedAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 px-4 flex-shrink-0 overflow-x-auto"
        style={{ height: 40, background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        {tabs.map(({ id, label, icon: Icon, highlight }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '5px 11px',
                fontSize: 11, fontWeight: active ? 700 : 500,
                whiteSpace: 'nowrap',
                background: active ? '#0f172a' : 'transparent',
                color: active ? '#ffffff' : '#64748b',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'all 0.1s',
              }}
            >
              <Icon size={12} style={{ color: active ? '#ffffff' : '#64748b' }} />
              {label}
              {highlight && !active && (
                <span style={{ fontSize: 9, padding: '1px 4px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontWeight: 700, borderRadius: '3px' }}>NEW</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div key={caseData.caseId} className="p-5 h-full overflow-auto animate-fade-in-up space-y-4">
            {/* Alert banner */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
              <AlertTriangle size={18} className="text-red-600 flex-shrink-0" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#b91c1c', textTransform: 'uppercase' }}>
                  CRITICAL FRAUD SIGNATURE DETECTED — {caseData.caseTitle || caseData.crimeType}
                </div>
                <div style={{ fontSize: 12, color: '#475569' }}>
                  {caseData.fraudPatterns.length} patterns flagged · {caseData.attributionConfidence}% confidence → {caseData.likelyVasp} · Risk Score {caseData.riskScore}/100
                </div>
              </div>
              <button className="btn-danger" onClick={() => setActiveTab('fir')} style={{ flexShrink: 0 }}>
                GENERATE FIR DRAFT
              </button>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-4 gap-3">
              <StatCard label="Risk Score" value={`${caseData.riskScore}/100`} sub="CRITICAL threshold" color="var(--red)" />
              <StatCard label="Amount Traced" value={`$${caseData.amountTraced.toLocaleString()}`} sub={`of $${caseData.reportedAmount.toLocaleString()} reported`} color="#0f172a" />
              <StatCard label="VASP Attribution" value={`${caseData.attributionConfidence}%`} sub={caseData.likelyVasp} color="#0284c7" />
              <StatCard label="Transactions Analysed" value={caseData.transactionsAnalysed} sub="across suspect cluster" color="#0f172a" />
            </div>

            {/* Destination Wallet Country & Statutory Freezing Laws */}
            {(() => {
              const vaspInfo = getVASPInfo(caseData.likelyVasp);
              const detectedCountry = vaspInfo.country === 'Switzerland' ? 'Switzerland' : 'India';
              const freezingLaws = getCountryFreezingLaws(detectedCountry);
              return (
                <div className="card p-4 border border-slate-200 bg-white space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{freezingLaws.countryFlag}</span>
                      <div>
                        <div className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">
                          DESTINATION WALLET JURISDICTION & STATUTORY FREEZING LAWS
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Destination Country: <span className="text-blue-600 font-extrabold">{freezingLaws.country}</span> ({vaspInfo.jurisdiction})
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                        Turnaround SLA: {freezingLaws.executionSLA}
                      </span>
                      <button
                        onClick={() => setActiveTab('vasp')}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        Full Legal Subpoena →
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 rounded bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="text-slate-500 font-mono text-[11px] block font-semibold">PRIMARY STATUTE:</span>
                      <span className="font-bold text-slate-900 font-mono">{freezingLaws.primaryStatute}</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="text-slate-500 font-mono text-[11px] block font-semibold">SUPERVISORY AUTHORITY:</span>
                      <span className="font-semibold text-slate-900">{freezingLaws.regulatoryBody}</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="text-slate-500 font-mono text-[11px] block font-semibold">LEGAL ENFORCEMENT ROUTE:</span>
                      <span className="font-semibold text-slate-900">{freezingLaws.bilateralTreaty}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-700 bg-blue-50/60 p-2.5 rounded border border-blue-100 flex items-start gap-2">
                    <Shield size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Police Seizure / Freezing Directives:</strong> {freezingLaws.keySections[0].description} {freezingLaws.keySections[0].actionableDirectives}
                    </span>
                  </div>
                </div>
              );
            })()}

            <div className="grid grid-cols-4 gap-3">
              <StatCard label="Wallets Analysed" value={caseData.walletsAnalysed} color="#10b981" />
              <StatCard label="Max Hops" value={caseData.maxHops} color="#f97316" />
              <StatCard label="Fraud Patterns" value={caseData.fraudPatterns.length} color="#ef4444" />
              <StatCard label="Identified Clusters" value={4} color="#8b5cf6" />
            </div>

            <div className="grid grid-cols-3 gap-5">
              <div className="col-span-2 space-y-4">
                {/* Evidence chain */}
                <div className="card p-4">
                  <div className="section-header">VERIFIED ON-CHAIN EVIDENCE CHAIN ({caseData.evidenceChain.length} HOPS)</div>
                  <div className="space-y-1">
                    {caseData.evidenceChain.map((s, i) => (
                      <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                        <div className="w-5 h-5 rounded flex items-center justify-center bg-slate-100 text-slate-700 font-mono text-[11px] font-bold">
                          {s.order}
                        </div>
                        <span className="flex-1 text-slate-700 font-mono text-xs">{s.label}</span>
                        <span className="font-mono text-xs font-bold text-slate-900">
                          ${s.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final Exchange Destination Wallet */}
                <DestWalletCard caseData={caseData} />

                {/* Fraud patterns */}
                <div className="card p-4">
                  <div className="section-header">DETECTED FRAUD PATTERNS ({caseData.fraudPatterns.length})</div>
                  <div className="grid grid-cols-2 gap-2">
                    {caseData.fraudPatterns.map(p => (
                      <div key={p.id} className="p-3 rounded bg-slate-50 border border-slate-200">
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{p.title}</div>
                        <span className={p.severity === 'HIGH' ? 'badge-high' : 'badge-medium'}>{p.severity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right panel */}
              <div className="space-y-3">
                <div className="card p-4">
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: '#64748b', marginBottom: 10 }}>PRIMARY VASP ATTRIBUTION</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{caseData.likelyVasp}</div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 26, fontWeight: 700, color: '#0284c7', lineHeight: 1 }}>{caseData.attributionConfidence}%</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, marginBottom: 12 }}>Attribution confidence</div>
                  <button className="btn-ghost w-full justify-center" onClick={() => setActiveTab('vasp')}>
                    VIEW EVIDENCE →
                  </button>
                </div>
                {/* Quick nav */}
                <div className="card p-4">
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: '#64748b', marginBottom: 10 }}>QUICK NAVIGATION</div>
                  {tabs.slice(1).map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => setActiveTab(id)} className="w-full flex items-center gap-2 hover:bg-slate-50 rounded"
                      style={{ padding: '6px 8px', fontSize: 11, color: '#475569', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', marginBottom: 2 }}>
                      <Icon size={12} className="text-slate-500" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'graph' && <div className="h-full animate-fade-in-up"><TransactionGraph key={caseData.caseId} caseData={caseData} onWalletClick={handleWalletClick} /></div>}
        {activeTab === 'clusters' && <div className="h-full overflow-auto animate-fade-in-up"><ClusterView key={caseData.caseId} caseData={caseData} /></div>}
        {activeTab === 'fund-flow' && <div className="h-full overflow-auto animate-fade-in-up"><FundFlowPanel key={caseData.caseId} caseData={caseData} /></div>}
        {activeTab === 'patterns' && <div className="h-full overflow-auto animate-fade-in-up"><FraudPatterns key={caseData.caseId} patterns={caseData.fraudPatterns} /></div>}
        {activeTab === 'wallet' && <div className="h-full overflow-auto animate-fade-in-up"><WalletIntelligence key={caseData.caseId} wallet={selectedWallet} relatedTransactions={relatedTx} allWallets={caseData.wallets} onSelectWallet={setSelectedWallet} /></div>}
        {activeTab === 'vasp' && <div className="h-full overflow-auto animate-fade-in-up"><VASPAttribution key={caseData.caseId} attributions={caseData.vaspAttributions} primaryVasp={caseData.likelyVasp} confidence={caseData.attributionConfidence} /></div>}
        {activeTab === 'explain' && <div className="h-full overflow-auto animate-fade-in-up"><Explainability key={caseData.caseId} steps={caseData.evidenceChain} primaryVasp={caseData.likelyVasp} /></div>}
        {activeTab === 'risk' && <div className="h-full overflow-auto animate-fade-in-up"><RiskScoring key={caseData.caseId} factors={caseData.riskFactors} totalScore={caseData.riskScore} riskLevel={caseData.riskLevel} /></div>}
        {activeTab === 'notes' && <div className="h-full overflow-auto animate-fade-in-up"><CaseNotes key={caseData.caseId} caseData={caseData} /></div>}
        {activeTab === 'report' && <div className="h-full overflow-auto animate-fade-in-up"><InvestigationReport key={caseData.caseId} caseData={caseData} /></div>}
        {activeTab === 'fir' && <div className="h-full overflow-auto animate-fade-in-up"><FIRDraft key={caseData.caseId} caseData={caseData} /></div>}
      </div>
    </div>
  );
}
