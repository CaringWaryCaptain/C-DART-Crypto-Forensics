import React, { useState, useEffect } from 'react';
import {
  GitBranch, Search, Filter, Plus, ArrowRight, Shield,
  AlertTriangle, CheckCircle, Clock, ExternalLink, Database,
  Layers, ChevronRight, Copy, Check
} from 'lucide-react';
import type { AppPage } from '../App';
import { allDemoCases, type InvestigationCase } from '../data/syntheticCase';
import { getAllCases, type StoredCase } from '../services/caseDb';
import { formatDualCurrency } from '../utils/currency';

interface Props {
  onNavigate: (page: AppPage) => void;
  onOpenCase: (c: InvestigationCase) => void;
}

export default function InvestigationsPage({ onNavigate, onOpenCase }: Props) {
  const [savedCases, setSavedCases] = useState<StoredCase[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'HIGH' | 'DOMESTIC'>('ALL');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setSavedCases(getAllCases());
  }, []);

  // Merge saved disk cases + demo cases
  const allCases: (InvestigationCase & { _isStored?: boolean; status?: string })[] = [
    ...savedCases.map((sc): InvestigationCase & { _isStored?: boolean; status?: string } => {
      // Find base template or use first demo case
      const base = allDemoCases.find(dc => dc.caseId === sc.caseId) || allDemoCases[0];
      return {
        ...base,
        caseId: sc.caseId,
        caseTitle: sc.datasetNote || `Live Case · ${sc.suspectWallet.slice(0, 8)}...`,
        suspectWallet: sc.suspectWallet,
        network: sc.network,
        investigatorName: sc.investigatorName,
        incidentDate: sc.incidentDate,
        reportedAmount: sc.reportedAmount,
        amountTraced: Math.round(sc.reportedAmount * 0.82),
        riskLevel: sc.riskLevel,
        riskScore: sc.riskScore,
        likelyVasp: sc.likelyVasp || 'Under Analysis',
        transactionsAnalysed: sc.txCount,
        walletsAnalysed: sc.walletsFound,
        status: sc.status,
        _isStored: true,
      };
    }),
    ...allDemoCases.filter(dc => !savedCases.some(sc => sc.caseId === dc.caseId)).map(dc => ({
      ...dc,
      status: 'ACTIVE',
    })),
  ];

  const filtered = allCases.filter(c => {
    const q = search.toLowerCase();
    const matchSearch =
      c.caseId.toLowerCase().includes(q) ||
      c.suspectWallet.toLowerCase().includes(q) ||
      c.investigatorName.toLowerCase().includes(q) ||
      c.likelyVasp.toLowerCase().includes(q) ||
      (c.caseTitle && c.caseTitle.toLowerCase().includes(q));

    if (!matchSearch) return false;
    if (filter === 'ACTIVE') return c.status === 'ACTIVE';
    if (filter === 'HIGH') return c.riskLevel === 'HIGH';
    if (filter === 'DOMESTIC') return c.likelyVasp.toLowerCase().includes('wazirx') || c.likelyVasp.toLowerCase().includes('coindcx');
    return true;
  });

  const handleCopy = (txt: string, id: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6 h-full overflow-auto space-y-5 animate-fade-in-up" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-900 text-white tracking-wider">
              CENTRAL FORENSIC DOSSIER REPOSITORY
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
              DISK DATABASE: database/cases.json
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <GitBranch size={20} className="text-blue-600" />
            Active Blockchain Investigations Registry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete dossier index synced with local disk database. Click any case row to resume multi-hop graph tracing.
          </p>
        </div>

        <button
          onClick={() => onNavigate('create-investigation')}
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer self-start md:self-auto"
        >
          <Plus size={14} />
          New Investigation
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex rounded bg-slate-100 p-0.5 border border-slate-200 text-xs">
          {(
            [
              { id: 'ALL', label: `All Cases (${allCases.length})` },
              { id: 'ACTIVE', label: 'Active (Tracing)' },
              { id: 'HIGH', label: 'High Risk (80+)' },
              { id: 'DOMESTIC', label: '🇮🇳 FIU-IND (Domestic)' },
            ] as const
          ).map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition ${
                filter === tab.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Case ID, suspect wallet address (0x...), investigator..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Cases Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider font-mono">
                <th className="py-3 px-4">Case ID & Network</th>
                <th className="py-3 px-4">Suspect Wallet Address</th>
                <th className="py-3 px-4">Reported Volume</th>
                <th className="py-3 px-4">Risk Rating</th>
                <th className="py-3 px-4">Attributed VASP</th>
                <th className="py-3 px-4">Investigating Officer</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(c => {
                const isHigh = c.riskLevel === 'HIGH';
                const isDomestic = c.likelyVasp.toLowerCase().includes('wazirx') || c.likelyVasp.toLowerCase().includes('coindcx');

                return (
                  <tr
                    key={c.caseId}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => onOpenCase(c)}
                  >
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                        {c.caseId}
                        {c._isStored && (
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                            DISK
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{c.network} · {c.incidentDate}</span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-slate-700">
                        <span>{c.suspectWallet.slice(0, 10)}...{c.suspectWallet.slice(-6)}</span>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleCopy(c.suspectWallet, c.caseId);
                          }}
                          className="text-slate-400 hover:text-slate-700 p-0.5 rounded"
                          title="Copy address"
                        >
                          {copiedId === c.caseId ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">{c.caseTitle}</div>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-slate-900">${c.reportedAmount.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-500">₹{(c.reportedAmount * 83.5).toLocaleString('en-IN')}</div>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold inline-flex items-center gap-1 ${
                        isHigh ? 'bg-red-50 text-red-700 border border-red-200' :
                        c.riskLevel === 'LOW' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {c.riskScore}/100 {c.riskLevel}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 flex items-center gap-1">
                        {c.likelyVasp}
                      </div>
                      <span className={`text-[10px] font-mono font-bold ${isDomestic ? 'text-blue-700' : 'text-slate-500'}`}>
                        {isDomestic ? '🇮🇳 Domestic (FIU-IND)' : '🌐 Offshore Gateway'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{c.investigatorName}</div>
                      <div className="text-[10px] font-mono text-slate-400">CCPS Active Node</div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onOpenCase(c);
                        }}
                        className="px-3 py-1 rounded bg-slate-900 hover:bg-blue-600 text-white font-semibold text-xs inline-flex items-center gap-1 transition shadow-xs cursor-pointer"
                      >
                        Open Case <ArrowRight size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
