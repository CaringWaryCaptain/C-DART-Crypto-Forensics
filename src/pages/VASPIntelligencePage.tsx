import React, { useState } from 'react';
import {
  Building2, Shield, Globe, Landmark, Search, ExternalLink,
  Mail, Clock, FileText, CheckCircle, AlertTriangle, Lock,
  Copy, Check, Scale
} from 'lucide-react';
import { VASP_DIRECTORY, FREEZING_LAWS_BY_COUNTRY, type VASPInfo } from '../data/vaspDirectory';
import type { AppPage } from '../App';

interface Props {
  onNavigate: (page: AppPage) => void;
}

export default function VASPIntelligencePage({ onNavigate }: Props) {
  const [filter, setFilter] = useState<'ALL' | 'INDIA' | 'SWITZERLAND' | 'OFFSHORE' | 'MIXER'>('ALL');
  const [search, setSearch] = useState('');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const vasps = Object.values(VASP_DIRECTORY);

  const filtered = vasps.filter(v => {
    const q = search.toLowerCase();
    const matchSearch =
      v.name.toLowerCase().includes(q) ||
      v.country.toLowerCase().includes(q) ||
      v.nodalEmail.toLowerCase().includes(q) ||
      (v.fiuRegistrationNumber && v.fiuRegistrationNumber.toLowerCase().includes(q));

    if (!matchSearch) return false;
    if (filter === 'INDIA') return v.country === 'India';
    if (filter === 'SWITZERLAND') return v.country === 'Switzerland';
    if (filter === 'OFFSHORE') return v.category === 'OFFSHORE' && v.country !== 'India' && v.country !== 'Switzerland';
    if (filter === 'MIXER') return v.category === 'MIXER';
    return true;
  });

  const handleCopy = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <div className="p-6 h-full overflow-auto space-y-5 animate-fade-in-up" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-900 text-white tracking-wider">
              VASP DIRECTORY & STATUTORY COMPLIANCE DESK
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300">
              FIU-IND PMLA & FINMA REGISTRY 2026
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Building2 size={20} className="text-blue-600" />
            VASP Intelligence & Jurisdiction Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Official nodal contacts, destination country laws, and statutory asset freezing channels for crypto exchanges.
          </p>
        </div>

        <button
          onClick={() => onNavigate('dashboard')}
          className="px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold self-start md:self-auto cursor-pointer"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap rounded bg-slate-100 p-0.5 border border-slate-200 text-xs">
          {(
            [
              { id: 'ALL', label: `All Exchanges (${vasps.length})` },
              { id: 'INDIA', label: '🇮🇳 India (PMLA / CrPC)' },
              { id: 'SWITZERLAND', label: '🇨🇭 Switzerland (FINMA / AMLA)' },
              { id: 'OFFSHORE', label: '🌐 Other Offshore' },
              { id: 'MIXER', label: '⚠️ Mixer Protocols' },
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
            placeholder="Search VASP name, country, FIU reg, nodal email..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* VASP Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(v => {
          const isSwiss = v.country === 'Switzerland';
          const isIndia = v.country === 'India';

          return (
            <div key={v.shortName} className="card p-4 space-y-3 hover:border-slate-400 transition shadow-xs">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded font-mono flex items-center gap-1"
                      style={{ background: v.badgeBg, border: `1px solid ${v.badgeBorder}`, color: v.badgeText }}
                    >
                      <span>{v.countryFlag}</span>
                      <span>
                        {isIndia ? 'INDIA · FIU-IND REPORTING ENTITY' :
                         isSwiss ? 'SWITZERLAND · FINMA REGULATED' :
                         v.category === 'OFFSHORE' ? 'OFFSHORE JURISDICTION' : 'PRIVACY PROTOCOL'}
                      </span>
                    </span>
                    {v.fiuRegistrationNumber && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                        {v.fiuRegistrationNumber}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{v.name}</h3>
                  <div className="text-xs text-slate-500 font-mono">
                    Country: <strong>{v.country}</strong> · {v.jurisdiction}
                  </div>
                </div>

                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  {isIndia ? <Landmark size={16} className="text-blue-600" /> :
                   isSwiss ? <Scale size={16} className="text-red-600" /> :
                   v.category === 'OFFSHORE' ? <Globe size={16} className="text-amber-600" /> :
                   <Lock size={16} className="text-red-600" />}
                </div>
              </div>

              {/* Nodal and Freezing Law details */}
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-xs space-y-1.5 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Nodal Legal Email:</span>
                  <button
                    onClick={() => handleCopy(v.nodalEmail)}
                    className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedEmail === v.nodalEmail ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                    <span>{copiedEmail === v.nodalEmail ? 'Copied' : 'Copy Email'}</span>
                  </button>
                </div>
                <div className="text-slate-800 font-semibold truncate select-all">{v.nodalEmail}</div>

                <div className="pt-1 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Statutory Freezing Law:</span>
                  <span className="font-bold text-slate-900">
                    {isIndia ? 'Section 102 CrPC / Sec 106 BNSS' :
                     isSwiss ? 'Swiss Criminal Code Art. 263 / AMLA' :
                     v.legalProcess.split(' / ')[0]}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Freezing SLA:</span>
                  <span className="font-bold text-emerald-700">{v.statutoryDeadline}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {v.notes}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
