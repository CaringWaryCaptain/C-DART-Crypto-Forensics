import React, { useState } from 'react';
import {
  Building2, CheckCircle, AlertCircle, Shield, Globe, Landmark,
  Scale, Clock, FileText, Copy, Check, ChevronRight, AlertTriangle,
  ExternalLink, ArrowRight
} from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import type { VASPAttribution as VASPType } from '../../data/syntheticCase';
import {
  getVASPInfo, getCountryFreezingLaws, FREEZING_LAWS_BY_COUNTRY,
  type CountryFreezingLaws
} from '../../data/vaspDirectory';

interface Props {
  attributions: VASPType[];
  primaryVasp: string;
  confidence: number;
}

const vaspColors: Record<string, string> = {
  'Exchange X': '#3b82f6',
  'Exchange Y': '#a855f7',
  'Exchange Z': '#f97316',
  'WazirX Deposit Cluster': '#0284c7',
  'WazirX': '#0284c7',
  'Bitcoin Suisse AG': '#dc2626',
  'Bitcoin Suisse': '#dc2626',
  'Sygnum Bank': '#dc2626',
  'Binance Hot Wallet 14': '#f59e0b',
  'Unknown / Unattributed': '#4a5568',
};

export default function VASPAttribution({ attributions, primaryVasp, confidence }: Props) {
  const primary = attributions.find(a => a.vasp === primaryVasp) || attributions[0];
  const alternatives = attributions.filter(a => a.vasp !== primaryVasp);

  const primaryVaspInfo = primary ? getVASPInfo(primary.vasp) : getVASPInfo('WazirX');
  
  // Selected country tab for viewing freezing laws (India vs Switzerland)
  const defaultCountry = primaryVaspInfo.country === 'Switzerland' ? 'Switzerland' : 'India';
  const [activeCountry, setActiveCountry] = useState<'India' | 'Switzerland'>(defaultCountry);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);

  const freezingLaws: CountryFreezingLaws = FREEZING_LAWS_BY_COUNTRY[activeCountry];

  const gaugeData = [{ name: 'Confidence', value: confidence, fill: '#3b82f6' }];

  const handleCopyNotice = () => {
    navigator.clipboard.writeText(
      `${freezingLaws.subpoenaTemplate.title}\n\n` +
      `${freezingLaws.subpoenaTemplate.legalHeader}\n` +
      `LEGAL STATUTE: ${freezingLaws.subpoenaTemplate.statutoryCitation}\n\n` +
      `${freezingLaws.subpoenaTemplate.bodyText}`
    );
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  return (
    <div className="p-5 h-full overflow-auto space-y-5 animate-fade-in-up" style={{ background: 'var(--bg-primary)' }}>
      {/* 1. Header with Destination Country Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-900 text-white tracking-wider">
              STAGE 04: DESTINATION VASP ATTRIBUTION
            </span>
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
              <span>{primaryVaspInfo.countryFlag}</span>
              <span>DESTINATION: {primaryVaspInfo.country.toUpperCase()}</span>
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Building2 size={20} className="text-blue-600" />
            Exchange Ingress Attribution & Freezing Laws
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographic tracing of exit nodes, destination exchange geography, and statutory asset freezing protocols.
          </p>
        </div>

        <div className="text-xs px-3 py-1.5 rounded-md font-semibold self-start sm:self-auto bg-blue-50 text-blue-700 border border-blue-200">
          PROBABILISTIC CLUSTERING · 95% CONFIDENCE
        </div>
      </div>

      {/* 2. Primary VASP Card with Country & Location Badge */}
      {primary && (
        <div className="card p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  PRIMARY DESTINATION EXCHANGE
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                  <span>{primaryVaspInfo.countryFlag}</span>
                  <span>{primaryVaspInfo.country} ({primaryVaspInfo.jurisdiction})</span>
                </span>
              </div>

              <div className="text-2xl font-black text-slate-900 flex items-center gap-2">
                {primaryVaspInfo.name}
              </div>

              <div className="text-xs text-slate-600 flex items-center gap-3 font-mono">
                <span>Funds Traced: <strong className="text-slate-900">{primary.fundsPercentage}%</strong></span>
                <span>·</span>
                <span>Nodal Contact: <strong className="text-blue-600 select-all">{primaryVaspInfo.nodalEmail}</strong></span>
              </div>
            </div>

            {/* Radial confidence gauge */}
            <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div style={{ width: 80, height: 80 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="65%" outerRadius="100%" data={gaugeData} startAngle={90} endAngle={90 - (confidence / 100) * 360}>
                    <RadialBar dataKey="value" background={{ fill: '#e2e8f0' }} cornerRadius={4} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <div className="text-2xl font-black text-blue-600">{confidence}%</div>
                <div className="text-[11px] font-bold uppercase text-slate-500">Attribution Score</div>
                <div className="text-[10px] text-emerald-600 font-semibold font-mono">FIU/FINMA Clustered</div>
              </div>
            </div>
          </div>

          {/* Forensic Evidence Points */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              On-Chain Attribution Evidence Points:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {primary.evidence.map((ev, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2 rounded border border-slate-200/60">
                  <CheckCircle size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{ev}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Statutory Asset Freezing Framework (India 🇮🇳 vs Switzerland 🇨🇭) */}
      <div className="card p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Scale size={18} className="text-slate-800" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Statutory Asset Freezing Matrix & Governing Laws
            </h3>
          </div>

          {/* Interactive Country Toggle: India vs Switzerland */}
          <div className="flex items-center rounded-lg bg-slate-100 p-1 border border-slate-200 text-xs">
            <button
              onClick={() => setActiveCountry('India')}
              className={`px-3 py-1.5 rounded-md font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeCountry === 'India'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🇮🇳</span>
              <span>India Legal Framework</span>
              {primaryVaspInfo.country === 'India' && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-mono">
                  DETECTED
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveCountry('Switzerland')}
              className={`px-3 py-1.5 rounded-md font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeCountry === 'Switzerland'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🇨🇭</span>
              <span>Switzerland Legal Framework</span>
              {primaryVaspInfo.country === 'Switzerland' && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-mono">
                  DETECTED
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Selected Country Legal Breakdown Banner */}
        <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{freezingLaws.countryFlag}</span>
              <div>
                <div className="text-base font-extrabold flex items-center gap-2">
                  {freezingLaws.country.toUpperCase()} JURISDICTION: ASSET FREEZING PROVISIONS
                </div>
                <div className="text-xs text-slate-300 font-mono">
                  Supervisory Authority: <strong>{freezingLaws.regulatoryBody}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <div className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-amber-300 font-bold flex items-center gap-1.5">
                <Clock size={12} />
                <span>SLA: {freezingLaws.executionSLA}</span>
              </div>
              <button
                onClick={() => setShowNoticeModal(true)}
                className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <FileText size={12} />
                <span>View Freezing Subpoena</span>
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-300 border-t border-slate-800 pt-2 font-mono">
            <strong>Bilateral Enforcement Channel:</strong> {freezingLaws.bilateralTreaty}
          </div>
        </div>

        {/* Key Statutory Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {freezingLaws.keySections.map((sec, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {sec.section}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">{sec.act}</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                {sec.description}
              </p>
              <div className="text-[11px] font-semibold text-emerald-800 pt-1 border-t border-slate-200/60 flex items-start gap-1">
                <ArrowRight size={12} className="flex-shrink-0 mt-0.5 text-emerald-600" />
                <span>{sec.actionableDirectives}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Step-by-Step Police Execution Protocol */}
        <div className="p-3.5 rounded-lg bg-blue-50/60 border border-blue-200 space-y-2">
          <div className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Shield size={14} className="text-blue-700" />
            <span>Investigating Officer Protocol for Account Seizure ({freezingLaws.country}):</span>
          </div>
          <div className="space-y-1.5">
            {freezingLaws.stepByStepProtocol.map((step, idx) => (
              <div key={idx} className="text-xs text-slate-800 flex items-start gap-2">
                <span className="font-mono font-bold text-blue-700">•</span>
                <span className="leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Alternative Attributions Table */}
      {alternatives.length > 0 && (
        <div className="card p-4 border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Secondary / Counterparty Exchanges Detected
          </h3>
          <div className="space-y-2">
            {alternatives.map(a => {
              const altInfo = getVASPInfo(a.vasp);
              return (
                <div key={a.vasp} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span>{altInfo.countryFlag}</span>
                    <span className="font-bold text-slate-900">{altInfo.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({altInfo.country})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-600">{a.fundsPercentage}% of traced outflow</span>
                    <span className="font-mono font-bold text-blue-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {a.confidence}% Confidence
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Subpoena & Freeze Notice Modal */}
      {showNoticeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{freezingLaws.countryFlag}</span>
                  <span className="text-xs font-bold font-mono text-slate-500 uppercase">
                    {freezingLaws.country} STATUTORY FREEZING REQUISITION
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {freezingLaws.subpoenaTemplate.title}
                </h3>
              </div>
              <button
                onClick={() => setShowNoticeModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded bg-slate-900 text-slate-200 font-mono text-xs space-y-2 whitespace-pre-line leading-relaxed">
              <div className="text-amber-400 font-bold border-b border-slate-800 pb-1">
                {freezingLaws.subpoenaTemplate.legalHeader}
              </div>
              <div className="text-blue-300 font-semibold">
                STATUTORY CITATION: {freezingLaws.subpoenaTemplate.statutoryCitation}
              </div>
              <div className="pt-2 text-slate-100">
                {freezingLaws.subpoenaTemplate.bodyText}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500 font-mono">
                Turnaround SLA: {freezingLaws.executionSLA}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyNotice}
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow transition"
                >
                  {copiedNotice ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
                  <span>{copiedNotice ? 'Notice Copied!' : 'Copy Freezing Notice'}</span>
                </button>
                <button
                  onClick={() => setShowNoticeModal(false)}
                  className="px-4 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
