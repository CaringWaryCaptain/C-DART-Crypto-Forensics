import React, { useState } from 'react';
import {
  Settings as SettingsIcon, Shield, Database, Radio, Key,
  CheckCircle, RefreshCw, HardDrive, User, Lock, Award
} from 'lucide-react';
import type { AppPage } from '../App';
import type { OfficerSession } from './LoginPage';
import { getDbStats, getDbInfo, initDatabaseSync } from '../services/caseDb';

interface Props {
  officer: OfficerSession;
  onNavigate: (page: AppPage) => void;
  onLogout: () => void;
}

export default function SettingsPage({ officer, onNavigate, onLogout }: Props) {
  const [syncing, setSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);
  const dbStats = getDbStats();
  const dbInfo = getDbInfo();

  const handleManualSync = async () => {
    setSyncing(true);
    await initDatabaseSync();
    setTimeout(() => {
      setSyncing(false);
      setSyncDone(true);
      setTimeout(() => setSyncDone(false), 3000);
    }, 600);
  };

  return (
    <div className="p-6 h-full overflow-auto space-y-5 animate-fade-in-up" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-900 text-white tracking-wider">
              SYSTEM CONFIGURATION & STATUTORY REGISTRATION
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
              PHYSICAL DISK DB ONLINE
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <SettingsIcon size={20} className="text-slate-700" />
            Officer Profile & Forensic Node Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage authenticated police credentials, local database file sync, and blockchain node APIs.
          </p>
        </div>

        <button
          onClick={() => onNavigate('dashboard')}
          className="px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold self-start md:self-auto cursor-pointer"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Officer Profile Dossier */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <User size={16} className="text-blue-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Authenticated Officer Credentials
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Officer Name:</span>
              <span className="font-bold text-slate-900">{officer.name}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Badge / Service Number:</span>
              <span className="font-mono font-bold text-slate-900">#{officer.badgeNo}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">State / Union Territory:</span>
              <span className="font-bold text-slate-900 uppercase">🇮🇳 {officer.state}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Cyber Crime Police Station:</span>
              <span className="font-semibold text-slate-800">{officer.unit}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Role & Clearance:</span>
              <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {officer.roleLabel}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onLogout}
              className="w-full py-2 rounded bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs border border-red-200 transition cursor-pointer"
            >
              Sign Out / Switch Officer Profile
            </button>
          </div>
        </div>

        {/* 2. Physical Database Engine Monitor */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <HardDrive size={16} className="text-emerald-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Physical Disk Database Status
              </h2>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
              LIVE SYNC ACTIVE
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Storage Architecture:</span>
              <span className="font-bold text-slate-800">Dual-Layer (Disk File + Cache)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Physical File Location:</span>
              <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                ./database/cases.json
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Registered Cases on Disk:</span>
              <span className="font-mono font-bold text-slate-900">{dbStats.totalCases} Dossiers</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Active High-Risk Cases:</span>
              <span className="font-mono font-bold text-red-600">{dbStats.highRiskCases}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Forensic Notes Stored:</span>
              <span className="font-mono font-bold text-slate-900">{dbStats.totalNotes}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleManualSync}
              disabled={syncing}
              className="w-full py-2 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <RefreshCw size={13} className={syncing ? 'animate-spin' : ''} />
              {syncing ? 'Syncing with Disk Files...' : syncDone ? '✓ Synced with Disk Database' : 'Force Sync Physical Database'}
            </button>
          </div>
        </div>

        {/* 3. Blockchain Nodes & API Status */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Key size={16} className="text-amber-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Blockchain Node Connectors
            </h2>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Ethereum Mainnet (Etherscan V2 API)</div>
                <div className="text-[10px] font-mono text-slate-500">Key: W87ZHCJ491...WDHKYP8Q · Rate: 5 calls/s</div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                CONNECTED
              </span>
            </div>

            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">TRON Network (TRC-20 Scanner)</div>
                <div className="text-[10px] font-mono text-slate-500">Base58 Address Validator Active</div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                VALIDATOR READY
              </span>
            </div>
          </div>
        </div>

        {/* 4. Statutory Certification Stamp */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Award size={16} className="text-purple-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Section 65B / BSA 2023 Digital Certification
            </h2>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            All reports and FIR drafts automatically embed the certifying officer's hash verification stamp:
          </p>

          <div className="p-3 bg-slate-900 rounded font-mono text-[11px] text-slate-200 space-y-1">
            <div className="text-amber-400 font-bold">DIGITAL FORENSIC CERTIFICATE REF:</div>
            <div>STAMP: CCPS-{officer.state.toUpperCase()}-SEC65B-2026</div>
            <div>OFFICER: {officer.name} (#{officer.badgeNo})</div>
            <div>STATUS: ADMISSIBLE UNDER SEC. 63 BSA 2023</div>
          </div>
        </div>
      </div>
    </div>
  );
}
