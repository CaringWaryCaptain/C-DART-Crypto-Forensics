import { useState, useEffect } from 'react';
import {
  Plus, TrendingUp, AlertTriangle, CheckCircle,
  Clock, Activity, ArrowRight, Shield, Zap, Database,
  Search, FileText, ArrowUpRight, Filter, Lock,
  Globe, Landmark, AlertOctagon, Radio, Check,
  ExternalLink, Layers
} from 'lucide-react';
import type { AppPage } from '../App';
import { allDemoCases, type InvestigationCase } from '../data/syntheticCase';

interface Props {
  onNavigate: (page: AppPage) => void;
  onDemo: (targetCase?: InvestigationCase) => void;
}

// Ingestion feed events simulating real-time feeds from NCRP / 1930 Helpline
interface LiveFeedEvent {
  id: string;
  timeAgo: string;
  source: string;
  complaintId: string;
  victimCity: string;
  amountUsd: number;
  amountInr: string;
  network: string;
  hops: number;
  targetVasp: string;
  status: 'S.91 Ready' | 'Attributed' | 'Tracing' | 'Frozen';
  statusColor: 'emerald' | 'blue' | 'amber' | 'purple';
}

const LIVE_INGESTION_EVENTS: LiveFeedEvent[] = [
  {
    id: 'EV-901',
    timeAgo: 'Just now',
    source: '1930 Helpline',
    complaintId: 'NCRP-2026-DEL-0842',
    victimCity: 'New Delhi',
    amountUsd: 18420,
    amountInr: '₹15.3 Lakhs',
    network: 'Ethereum (ERC-20)',
    hops: 3,
    targetVasp: 'Binance',
    status: 'S.91 Ready',
    statusColor: 'emerald'
  },
  {
    id: 'EV-902',
    timeAgo: '4 mins ago',
    source: 'NCRP Portal',
    complaintId: 'NCRP-2026-MUM-1104',
    victimCity: 'Mumbai',
    amountUsd: 28950,
    amountInr: '₹24.0 Lakhs',
    network: 'TRON (TRC-20)',
    hops: 4,
    targetVasp: 'OKX',
    status: 'Attributed',
    statusColor: 'blue'
  },
  {
    id: 'EV-903',
    timeAgo: '18 mins ago',
    source: '1930 Helpline',
    complaintId: 'NCRP-2026-HYD-0751',
    victimCity: 'Hyderabad',
    amountUsd: 16200,
    amountInr: '₹13.4 Lakhs',
    network: 'TRON (TRC-20)',
    hops: 3,
    targetVasp: 'WazirX (FIU-IND)',
    status: 'Frozen',
    statusColor: 'purple'
  },
  {
    id: 'EV-904',
    timeAgo: '41 mins ago',
    source: 'NCRP Portal',
    complaintId: 'NCRP-2026-BLR-0419',
    victimCity: 'Bengaluru',
    amountUsd: 9500,
    amountInr: '₹7.9 Lakhs',
    network: 'Ethereum (ERC-20)',
    hops: 2,
    targetVasp: 'CoinDCX (FIU-IND)',
    status: 'S.91 Ready',
    statusColor: 'emerald'
  },
  {
    id: 'EV-905',
    timeAgo: '1 hr ago',
    source: 'CCPS Gujarat',
    complaintId: 'NCRP-2026-AHM-0312',
    victimCity: 'Ahmedabad',
    amountUsd: 21500,
    amountInr: '₹17.8 Lakhs',
    network: 'Ethereum (ERC-20)',
    hops: 3,
    targetVasp: 'Bybit',
    status: 'Tracing',
    statusColor: 'amber'
  }
];

// VASP distribution across tracked illicit fund flows
interface VaspStat {
  name: string;
  volumeUsd: string;
  volumeInr: string;
  percentage: number;
  jurisdiction: 'Domestic (FIU-IND)' | 'Offshore (Global)';
  legalRoute: string;
  color: string;
}

const VASP_BREAKDOWN: VaspStat[] = [
  {
    name: 'Binance',
    volumeUsd: '$540,000',
    volumeInr: '₹4.49 Cr',
    percentage: 38,
    jurisdiction: 'Offshore (Global)',
    legalRoute: 'LEA Portal / S.91 MLAT Request',
    color: '#f59e0b'
  },
  {
    name: 'WazirX',
    volumeUsd: '$312,500',
    volumeInr: '₹2.60 Cr',
    percentage: 22,
    jurisdiction: 'Domestic (FIU-IND)',
    legalRoute: 'Direct S.91 CrPC Freezing (≤ 4h)',
    color: '#3b82f6'
  },
  {
    name: 'OKX',
    volumeUsd: '$255,700',
    volumeInr: '₹2.12 Cr',
    percentage: 18,
    jurisdiction: 'Offshore (Global)',
    legalRoute: 'Global LE Compliance Expedited',
    color: '#0f172a'
  },
  {
    name: 'CoinDCX',
    volumeUsd: '$170,500',
    volumeInr: '₹1.41 Cr',
    percentage: 12,
    jurisdiction: 'Domestic (FIU-IND)',
    legalRoute: 'Direct S.91 CrPC Freezing (≤ 4h)',
    color: '#10b981'
  },
  {
    name: 'Bybit',
    volumeUsd: '$142,150',
    volumeInr: '₹1.18 Cr',
    percentage: 10,
    jurisdiction: 'Offshore (Global)',
    legalRoute: 'LE Response Unit Expedited',
    color: '#8b5cf6'
  }
];

export default function Dashboard({ onNavigate, onDemo }: Props) {
  const [time, setTime] = useState(new Date());
  const [triageAddress, setTriageAddress] = useState('');
  const [triageNetwork, setTriageNetwork] = useState<'ETH' | 'TRON' | 'BTC'>('ETH');
  const [caseFilter, setCaseFilter] = useState<'ALL' | 'HIGH' | 'DOMESTIC' | 'OFFSHORE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const totalReported = allDemoCases.reduce((acc, c) => acc + c.reportedAmount, 0);
  const totalTraced = allDemoCases.reduce((acc, c) => acc + c.amountTraced, 0);

  // Filter cases
  const filteredCases = allDemoCases.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.caseId.toLowerCase().includes(q) ||
      (c.crimeType ? c.crimeType.toLowerCase().includes(q) : false) ||
      (c.caseTitle ? c.caseTitle.toLowerCase().includes(q) : false) ||
      c.likelyVasp.toLowerCase().includes(q) ||
      c.investigatorName.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (caseFilter === 'HIGH') return c.riskLevel === 'HIGH';
    if (caseFilter === 'DOMESTIC') {
      return c.likelyVasp.toLowerCase().includes('wazirx') || c.likelyVasp.toLowerCase().includes('coindcx');
    }
    if (caseFilter === 'OFFSHORE') {
      return c.likelyVasp.toLowerCase().includes('binance') || c.likelyVasp.toLowerCase().includes('okx');
    }
    return true;
  });

  const handleTriageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!triageAddress.trim()) {
      // If empty, launch primary demo case
      onDemo();
      return;
    }
    // Check if entered address matches any demo case
    const match = allDemoCases.find(
      (c) => c.suspectWallet.toLowerCase() === triageAddress.trim().toLowerCase()
    );
    if (match) {
      onDemo(match);
    } else {
      // Navigate to create-investigation with this address
      onNavigate('create-investigation');
    }
  };

  return (
    <div className="p-6 overflow-auto h-full space-y-5" style={{ background: 'var(--bg-primary)' }}>

      {/* ── 1. Top Command Header ── */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-900 text-white tracking-wider">
              C-DART FORENSICS v1.0
            </span>
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              MHA SIH 2026 · PS183
            </span>
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              NCRP 1930 FEED ACTIVE
            </span>
            <span className="text-xs font-mono text-slate-400 hidden lg:inline">
              SEC. 65B INDIAN EVIDENCE ACT READY
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1.5 flex items-center gap-2">
            <span>Forensic Intelligence Command Center</span>
          </h1>
          <p className="text-xs text-slate-500">
            Real-Time Identification of Fraud-Linked Cryptocurrency Exchanges from Victim-Reported Suspect Wallet Addresses.
          </p>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white border border-slate-200 text-xs font-mono text-slate-700 shadow-xs">
            <Clock size={13} className="text-slate-500" />
            <span className="font-semibold">{time.toLocaleTimeString('en-IN', { hour12: false })} IST</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-50 border border-emerald-200">
            <div className="live-dot" />
            <span className="text-xs font-semibold text-emerald-700">4 Chain Nodes Online</span>
          </div>
          <button
            onClick={() => onNavigate('create-investigation')}
            className="btn-primary"
          >
            <Plus size={14} />
            <span>New Investigation</span>
          </button>
        </div>
      </div>

      {/* ── 2. Operational KPI Metric Cards (National Forensics Overview) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1 */}
        <div className="card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Monitored Fraud
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              +18.4% this week
            </span>
          </div>
          <div className="mt-2">
            <div className="text-xl font-extrabold font-mono text-slate-900">
              $1,420,850
            </div>
            <div className="text-xs font-semibold text-slate-600 mt-0.5">
              ~₹11.82 Crore (128 NCRP Cases)
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 mt-2 flex items-center justify-between">
            <span>In-scope prototype cases:</span>
            <span className="font-mono font-semibold text-slate-700">${totalReported.toLocaleString()} (~₹60.6L)</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              VASP Attribution Rate
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              ≤ 3 Hops Triage
            </span>
          </div>
          <div className="mt-2">
            <div className="text-xl font-extrabold font-mono text-slate-900">
              94.2%
            </div>
            <div className="text-xs font-semibold text-emerald-600 mt-0.5 flex items-center gap-1">
              <CheckCircle size={12} />
              <span>High attribution confidence (&gt;88%)</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 mt-2 flex items-center justify-between">
            <span>Multi-hop clustering engine:</span>
            <span className="font-mono font-semibold text-slate-700">Active</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Avg. S.91 Notice Speed
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              99.1% Faster
            </span>
          </div>
          <div className="mt-2">
            <div className="text-xl font-extrabold font-mono text-slate-900">
              4.8 Minutes
            </div>
            <div className="text-xs font-semibold text-slate-600 mt-0.5">
              vs. 7–14 days traditional manual inquiry
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 mt-2 flex items-center justify-between">
            <span>Legal standard:</span>
            <span className="font-mono font-semibold text-slate-700">Sec. 91 CrPC / BNSS</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Assets Under Freeze Action
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
              14 Exchanges
            </span>
          </div>
          <div className="mt-2">
            <div className="text-xl font-extrabold font-mono text-slate-900">
              $415,200
            </div>
            <div className="text-xs font-semibold text-slate-600 mt-0.5">
              ~₹3.45 Crore pending compliance
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 mt-2 flex items-center justify-between">
            <span>Direct FIU-IND compliance:</span>
            <span className="font-mono font-semibold text-slate-700">WazirX / CoinDCX</span>
          </div>
        </div>
      </div>

      {/* ── 3. Quick Address Triage Bar (Law Enforcement Quick Action) ── */}
      <div className="card p-3.5 bg-slate-900 text-white">
        <form onSubmit={handleTriageSubmit} className="flex flex-col md:flex-row items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 whitespace-nowrap pl-1">
            <Search size={15} className="text-blue-400" />
            <span>INSTANT SUSPECT TRIAGE:</span>
          </div>

          <div className="flex-1 w-full flex items-center gap-2">
            <div className="flex rounded bg-slate-800 p-0.5 border border-slate-700 text-[11px] font-mono">
              {(['ETH', 'TRON', 'BTC'] as const).map((net) => (
                <button
                  type="button"
                  key={net}
                  onClick={() => setTriageNetwork(net)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    triageNetwork === net
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {net}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={triageAddress}
              onChange={(e) => setTriageAddress(e.target.value)}
              placeholder="Paste victim-reported suspect wallet (e.g., 0x71C... or TRON address) to trace..."
              className="flex-1 px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span>Launch Hop Trace</span>
            <ArrowRight size={13} />
          </button>
        </form>

        {/* Preset shortcut chips */}
        <div className="flex flex-wrap items-center gap-2 mt-2.5 pt-2.5 border-t border-slate-800 text-[11px]">
          <span className="text-slate-400 font-mono">Verified Case Shortcuts:</span>
          {allDemoCases.map((c, idx) => (
            <button
              key={c.caseId}
              onClick={() => onDemo(c)}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition flex items-center gap-1 font-mono cursor-pointer"
            >
              <span className="text-blue-400 font-bold">#{idx + 1}</span>
              <span>{c.likelyVasp}</span>
              <span className="text-slate-400">(${c.reportedAmount.toLocaleString()})</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 4. Two Analytical Command Widgets (VASP Distribution & Live Ingestion Pulse) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Left Column (7 cols): Target VASP Exposure & Jurisdictional Flow */}
        <div className="lg:col-span-7 card p-4 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Landmark size={15} className="text-slate-700" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Exit VASP Exposure & Legal Jurisdictions
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              FIU-IND vs. Offshore Triage
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Destination exchanges where fraud-linked proceeds converge. Domestic entities follow direct Section 91 CrPC compliance; offshore VASPs are routed through LEA portals.
          </p>

          {/* VASP Distribution List */}
          <div className="space-y-2.5">
            {VASP_BREAKDOWN.map((vasp) => {
              const isDomestic = vasp.jurisdiction.includes('Domestic');
              return (
                <div key={vasp.name} className="p-2.5 rounded border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{vasp.name}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                          isDomestic
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {vasp.jurisdiction}
                      </span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-slate-900">{vasp.volumeUsd}</span>
                      <span className="text-slate-400 text-[10px] ml-1.5">({vasp.volumeInr})</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-1">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${vasp.percentage * 2}%`, backgroundColor: vasp.color }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-mono">Route: {vasp.legalRoute}</span>
                    <span className="font-mono font-semibold text-slate-700">{vasp.percentage}% Share</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-2.5 rounded bg-blue-50 border border-blue-200 text-[11px] text-blue-900 flex items-start gap-2">
            <Shield size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold">MHA PS183 Interoperability Note: </span>
              FIU-IND registered entities (WazirX, CoinDCX) maintain registered nodal officers in India. S.91 CrPC notices drafted by C-DART provide the exact deposit transaction hashes and timestamps required for 4-hour account freezing.
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Live Ingestion Pulse (NCRP 1930 Helpline Stream) */}
        <div className="lg:col-span-5 card p-4 space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Radio size={15} className="text-emerald-600 animate-pulse" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Live NCRP 1930 Ingestion Pulse
                </h2>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                STREAMING
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-2 mb-3">
              Automated webhook ingest from National Cyber Crime Reporting Portal & state CCPS nodes.
            </p>

            {/* Ingestion feed items */}
            <div className="space-y-2">
              {LIVE_INGESTION_EVENTS.map((ev) => (
                <div
                  key={ev.id}
                  className="p-2.5 rounded border border-slate-200 bg-white hover:border-slate-400 transition text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-800 text-[11px]">
                        {ev.complaintId}
                      </span>
                      <span className="text-[10px] text-slate-400">· {ev.victimCity}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{ev.timeAgo}</span>
                  </div>

                  <div className="flex items-center justify-between mt-1 text-[11px]">
                    <span className="font-semibold text-slate-700">
                      ${ev.amountUsd.toLocaleString()} <span className="text-slate-400 font-normal">({ev.amountInr})</span>
                    </span>
                    <span className="font-mono text-slate-500">
                      → {ev.targetVasp} ({ev.hops} hops)
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-100 text-[10px]">
                    <span className="text-slate-500 font-mono">Source: {ev.source}</span>
                    <span
                      className={`font-bold font-mono px-1.5 py-0.2 rounded ${
                        ev.status === 'S.91 Ready'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : ev.status === 'Attributed'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : ev.status === 'Frozen'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {ev.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-center">
            <span className="text-[11px] font-mono text-slate-400">
              API polling cycle: 15s · End-to-end trace latency: ~1.8s
            </span>
          </div>
        </div>

      </div>

      {/* ── 5. Operational Case Dossiers Queue (Unified Table & 1-Click Launch) ── */}
      <div className="card p-4 space-y-4">
        {/* Table Controls Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <Database size={16} className="text-slate-700" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Active Forensic Case Dossiers & Scenarios
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-white font-bold">
                {filteredCases.length} OF {allDemoCases.length} LOADED
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any dossier row to inspect the full interactive transaction graph, AI explainability matrix, and Section 91 CrPC notice.
            </p>
          </div>

          {/* Filter Tabs & Search */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex rounded bg-slate-100 p-0.5 border border-slate-200 text-xs">
              {(
                [
                  { id: 'ALL', label: 'All Cases' },
                  { id: 'HIGH', label: 'High Risk (90+)' },
                  { id: 'DOMESTIC', label: 'FIU-IND (India)' },
                  { id: 'OFFSHORE', label: 'Offshore (Global)' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCaseFilter(tab.id)}
                  className={`px-2.5 py-1 rounded transition text-xs font-medium cursor-pointer ${
                    caseFilter === tab.id
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search case, victim, VASP..."
                className="pl-7 pr-2.5 py-1 text-xs rounded border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Dossiers Grid / Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredCases.map((c, idx) => {
            const isHigh = c.riskLevel === 'HIGH';
            const inrEstimate = (c.reportedAmount * 83).toLocaleString('en-IN');

            return (
              <div
                key={c.caseId}
                onClick={() => onDemo(c)}
                className="forensic-card cursor-pointer group hover:border-slate-900 transition-all"
              >
                {/* Header */}
                <div className="forensic-card-header bg-slate-50/70 group-hover:bg-slate-100/70 transition">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-slate-600">
                        {c.caseId}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-semibold">
                        SCENARIO #{idx + 1}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {c.caseTitle || c.crimeType}
                    </h3>
                  </div>
                  <span className={isHigh ? 'badge-high' : 'badge-medium'}>
                    {c.riskLevel} ({c.riskScore}/100)
                  </span>
                </div>

                {/* Body Details */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  {/* Key Stats Row */}
                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-xs">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Reported Loss</div>
                      <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                        ${c.reportedAmount.toLocaleString()}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        ~₹{inrEstimate}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Target VASP</div>
                      <div className="text-xs font-bold text-slate-900 mt-1 truncate">
                        {c.likelyVasp}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        {c.attributionConfidence}% Confirmed
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Hops & Network</div>
                      <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                        {c.maxHops} Hops
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 truncate">
                        {c.network}
                      </div>
                    </div>
                  </div>

                  {/* Suspect wallet & Victim */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span>INVESTIGATOR:</span>
                      <span className="text-slate-800 font-semibold">
                        {c.investigatorName} (Cyber Cell)
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
                      <span>SUSPECT WALLET:</span>
                      <span className="text-slate-800 font-semibold">
                        {c.suspectWallet.slice(0, 10)}...{c.suspectWallet.slice(-6)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span>DETECTED PATTERN:</span>
                      <span className="text-slate-800 font-medium truncate max-w-[260px]">
                        {c.fraudPatterns[0]?.title || 'Fund Splitting & Peel Chain'}
                      </span>
                    </div>
                  </div>

                  {/* Action Banner */}
                  <div className="pt-2">
                    <div className="w-full py-2 px-3 rounded bg-slate-900 group-hover:bg-blue-600 text-white text-xs font-semibold flex items-center justify-between transition">
                      <span>Inspect Graph, Cluster & Legal FIR</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCases.length === 0 && (
          <div className="p-8 text-center text-slate-500 space-y-2">
            <p className="text-sm font-medium">No forensic cases match the selected filter.</p>
            <button
              onClick={() => { setCaseFilter('ALL'); setSearchQuery(''); }}
              className="btn-ghost text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
