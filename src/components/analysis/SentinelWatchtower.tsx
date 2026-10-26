import React, { useState } from 'react';
import {
  Bell, AlertTriangle, Shield, CheckCircle, Radio, Clock,
  ExternalLink, ArrowRight, Zap, RefreshCw, Volume2, VolumeX,
  FileText, Lock, Globe, Landmark, Copy, Check
} from 'lucide-react';
import type { InvestigationCase } from '../../data/syntheticCase';
import { formatDualCurrency, formatINR } from '../../utils/currency';
import { getVASPInfo } from '../../data/vaspDirectory';

interface Props {
  caseData: InvestigationCase;
  onNavigateToFIR: () => void;
  onNavigateToVASP: () => void;
}

export default function SentinelWatchtower({ caseData, onNavigateToFIR, onNavigateToVASP }: Props) {
  const [isArmed, setIsArmed] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [alarmTriggered, setAlarmTriggered] = useState(false);
  const [copiedContract, setCopiedContract] = useState(false);
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'WATCHTOWER' | 'NON_EXCHANGE'>('WATCHTOWER');

  // Play synthesized emergency forensic chime using standard Web Audio API
  const playSiren = () => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(880, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.35);
      
      gain1.gain.setValueAtTime(0.25, ctx.currentTime);
      gain1.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.35);

      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(980, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.4);
        gain2.gain.setValueAtTime(0.3, ctx.currentTime);
        gain2.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.4);
      }, 360);
    } catch {
      // Audio not supported or blocked by autoplay policy
    }
  };

  const handleTriggerSimulatedAlarm = () => {
    setAlarmTriggered(true);
    playSiren();
  };

  const vaspInfo = getVASPInfo(caseData.likelyVasp);

  const tetherRequisitionLetter = `LEGAL REQUISITION FOR EMERGENCY SMART CONTRACT FREEZE UNDER PMLA & CRPC
To:
Tether Limited Compliance & Legal Enforcement Directorate
Email: compliance@tether.to / lawenforcement@tether.to
Subject: Emergency Asset Freeze Request: USDT Token Contract (FIR No: ${caseData.caseId})

Respected Compliance Team,

1. This statutory directive is issued by the Law Enforcement Agency (LEA) Cyber Crime Unit, India, investigating Criminal Cyber Fraud / Ransomware Case Ref: ${caseData.caseId}.

2. Traced Illicit Asset Coordinates:
   - Target Token: USD Tether (USDT - ERC-20 / TRC-20)
   - Suspect Non-Custodial Address: ${caseData.suspectWallet}
   - Intermediary Relay Wallets: ${caseData.wallets.slice(1, 4).map(w => w.address).join(', ')}
   - Total Stolen Volume: $${caseData.reportedAmount.toLocaleString()} USD (~₹${(caseData.reportedAmount * 83.5).toLocaleString('en-IN')})
   - Primary Ingress Hash: 0xee11de22ee33fa44de55bc66ee77fa88de99bc00ee11fa22de33bc44ee55fa80

3. Mandate & Execution Request:
   Pursuant to international law enforcement mutual assistance principles and Tether Limited's policy on cooperating with criminal investigations:
   You are hereby requested to invoke the smart contract administrative function:
   >> 'freeze(address targetAddress = ${caseData.suspectWallet})'
   to immediately immobilize and blacklist all USDT holdings within this private wallet, preventing any secondary dissipation, mixer hopping, or P2P liquidation.

4. Certified Electronic Evidence under Section 65B Indian Evidence Act / Section 63 BSA 2023 is maintained on police records.

Investigating Officer: ${caseData.investigatorName}
Cyber Crime Police Station (CCPS)
Reference: ${caseData.caseId} / SIH-2026-MHA`;

  return (
    <div className="p-5 h-full overflow-auto space-y-5 animate-fade-in-up" style={{ background: 'var(--bg-primary)' }}>
      {/* Top Banner & Mode Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Radio size={20} className="text-amber-600 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                24/7 Sentinel Watchtower & Ingress Alarm Engine
              </h2>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                isArmed ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-600'
              }`}>
                {isArmed ? '● SENTINEL ARMED' : '○ DISARMED'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Autonomous on-chain block & mempool scanner · Instant alerts when funds hit exchanges or private non-custodial exits
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub-tab switcher */}
          <div className="flex rounded bg-slate-100 p-0.5 border border-slate-200 text-xs">
            <button
              onClick={() => setActiveSubTab('WATCHTOWER')}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition ${
                activeSubTab === 'WATCHTOWER' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔔 Sentinel Watchtower
            </button>
            <button
              onClick={() => setActiveSubTab('NON_EXCHANGE')}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition ${
                activeSubTab === 'NON_EXCHANGE' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🧊 Non-Exchange Seizure
            </button>
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:text-slate-900 transition"
            title={isMuted ? 'Unmute siren' : 'Mute siren'}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        </div>
      </div>

      {/* 🚨 Emergency Alarm Banner (Triggered state) */}
      {alarmTriggered && (
        <div className="p-4 rounded-lg bg-red-500 text-white shadow-lg border-2 border-red-600 animate-pulse space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <AlertTriangle size={24} className="text-white animate-bounce" />
              <div>
                <div className="text-xs font-mono font-black tracking-widest uppercase text-red-100">
                  CRITICAL INGRESS TRIGGER DETECTED · MEMPOOL CONFIRMATION
                </div>
                <div className="text-base font-bold">
                  Funds from suspect chain entered {caseData.likelyVasp} Deposit Cluster!
                </div>
              </div>
            </div>
            <button
              onClick={() => setAlarmTriggered(false)}
              className="text-xs px-2 py-1 rounded bg-red-700 hover:bg-red-800 text-white font-mono font-bold"
            >
              DISMISS ALARM
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs font-mono bg-red-600/60 p-2.5 rounded">
            <div>
              <span className="text-red-200">Ingress Target:</span>
              <div className="font-bold text-white">{caseData.likelyVasp}</div>
            </div>
            <div>
              <span className="text-red-200">Amount Ingress:</span>
              <div className="font-bold text-white">${caseData.reportedAmount.toLocaleString()} ({formatINR(caseData.reportedAmount * 83.5)})</div>
            </div>
            <div>
              <span className="text-red-200">Block / Hop:</span>
              <div className="font-bold text-white">Block #20462991 · Hop 5</div>
            </div>
            <div>
              <span className="text-red-200">Statutory Window:</span>
              <div className="font-bold text-yellow-300">Golden Hour: ≤ 4h Freeze Mandate</div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onNavigateToFIR}
              className="px-3.5 py-1.5 rounded bg-white text-red-700 font-bold text-xs hover:bg-red-50 transition flex items-center gap-1.5 shadow"
            >
              <FileText size={14} />
              Dispatch Instant S.91 CrPC Notice to {vaspInfo.name} Compliance
            </button>
            <button
              onClick={() => setActiveSubTab('NON_EXCHANGE')}
              className="px-3.5 py-1.5 rounded bg-red-700 text-white font-semibold text-xs hover:bg-red-800 transition flex items-center gap-1.5"
            >
              <Lock size={14} />
              Initiate Smart Contract Freeze
            </button>
          </div>
        </div>
      )}

      {/* ── SUB-TAB 1: WATCHTOWER & ALARM SIMULATION ── */}
      {activeSubTab === 'WATCHTOWER' && (
        <div className="space-y-4">
          {/* Status & Control Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4 space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Watchtower Status
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${isArmed ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                <span className="text-base font-bold text-slate-900 font-mono">
                  {isArmed ? '24/7 ACTIVE LISTENER' : 'PAUSED'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Listening on Ethereum Mainnet & Tron blocks. Average mempool ingress detection: <strong>1.8s</strong>.
              </p>
              <button
                onClick={() => setIsArmed(!isArmed)}
                className={`w-full py-1.5 rounded text-xs font-bold font-mono transition ${
                  isArmed ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {isArmed ? 'Disarm Sentinel Watchtower' : 'Arm 24/7 Sentinel Watchtower'}
              </button>
            </div>

            <div className="card p-4 space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Monitored Addresses
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900">
                {caseData.wallets.length} <span className="text-xs font-normal text-slate-500">Nodes in Cluster</span>
              </div>
              <p className="text-xs text-slate-500">
                Root suspect wallet + {caseData.wallets.length - 1} intermediary peel & mule wallets under concurrent surveillance.
              </p>
              <div className="text-[11px] font-mono text-blue-600 truncate bg-blue-50 px-2 py-1 rounded border border-blue-200">
                Root: {caseData.suspectWallet}
              </div>
            </div>

            <div className="card p-4 space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Live Alarm Simulator (Hackathon Demo)
              </div>
              <p className="text-xs text-slate-500">
                Simulate what happens when the scammer deposits stolen funds into an exchange days later.
              </p>
              <button
                onClick={handleTriggerSimulatedAlarm}
                className="w-full py-2 rounded bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition cursor-pointer"
              >
                <Zap size={14} />
                🚨 Test Ingress Alert (Simulate VASP Deposit)
              </button>
              <div className="text-[10px] text-slate-400 text-center font-mono">
                Triggers visual alert + audio siren + pre-filled S.91 notice
              </div>
            </div>
          </div>

          {/* Monitored Hop Targets Table */}
          <div className="card p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-slate-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Sentinel Surveillance Target Registry ({caseData.wallets.length} Addresses)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                STREAMING WEBSOCKET ACTIVE
              </span>
            </div>

            <div className="space-y-2">
              {caseData.wallets.slice(0, 6).map((w, idx) => (
                <div key={w.id} className="p-2.5 rounded border border-slate-200 bg-white flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] font-bold text-slate-400 w-5">#{idx + 1}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-800">{w.address}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                          w.type === 'suspect' ? 'bg-red-100 text-red-700' :
                          w.type === 'vasp' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {w.type.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{w.label}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right font-mono">
                    <div>
                      <div className="text-[11px] font-semibold text-slate-700">${w.totalOutgoing.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400">{w.txCount} txs tracked</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      MONITORED
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SUB-TAB 2: NON-EXCHANGE DIRECT ASSET SEIZURE ── */}
      {activeSubTab === 'NON_EXCHANGE' && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Explanatory Banner */}
          <div className="card p-4 bg-blue-50/70 border-blue-200 space-y-2">
            <div className="flex items-center gap-2">
              <Lock size={17} className="text-blue-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                Non-Exchange Direct Asset Seizure & Off-Ramp Recovery
              </h3>
            </div>
            <p className="text-xs text-blue-800 leading-relaxed">
              When criminals deliberately avoid centralized exchanges (WazirX, Binance) to evade KYC identification, 
              Law Enforcement has <strong>3 direct statutory and cryptographic avenues</strong> to freeze and trace the money:
            </p>
          </div>

          {/* 3 Non-Exchange Recovery Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pillar 1: Smart Contract Freeze */}
            <div className="card p-4 space-y-2.5 border-t-4 border-t-emerald-600">
              <div className="flex items-center gap-2">
                <Lock size={15} className="text-emerald-600" />
                <h4 className="text-xs font-bold text-slate-900">1. Smart Contract Direct Freeze</h4>
              </div>
              <p className="text-xs text-slate-600">
                USDT (Tether) & USDC (Circle) smart contracts possess a hardcoded <code>freeze(address)</code> function. 
                Even if funds sit in a private non-custodial wallet (MetaMask/Ledger), issuer compliance can remote-freeze the tokens.
              </p>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] font-mono">
                <span className="text-slate-500">Tether Contract Method:</span>
                <div className="text-emerald-700 font-bold">freeze(address target)</div>
                <div className="text-slate-400 mt-1">Status: Legally Accessible via LEA</div>
              </div>
            </div>

            {/* Pillar 2: P2P Fiat Banking Trail */}
            <div className="card p-4 space-y-2.5 border-t-4 border-t-blue-600">
              <div className="flex items-center gap-2">
                <Landmark size={15} className="text-blue-600" />
                <h4 className="text-xs font-bold text-slate-900">2. P2P Banking Trail (UPI/IMPS)</h4>
              </div>
              <p className="text-xs text-slate-600">
                If the scammer off-ramps crypto via Telegram P2P or OTC brokers, the counterparty pays in INR via bank transfer. 
                Correlating the timestamp enables direct <strong>Section 102 CrPC Lien / Account Debit Freeze</strong>.
              </p>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] font-mono">
                <span className="text-slate-500">Enforcement Mechanism:</span>
                <div className="text-blue-700 font-bold">NCRP 1930 / I4C Bank Lien</div>
                <div className="text-slate-400 mt-1">Average Response: ≤ 2 Hours</div>
              </div>
            </div>

            {/* Pillar 3: RPC Node IP Subpoena */}
            <div className="card p-4 space-y-2.5 border-t-4 border-t-purple-600">
              <div className="flex items-center gap-2">
                <Globe size={15} className="text-purple-600" />
                <h4 className="text-xs font-bold text-slate-900">3. RPC Node & IP Subpoena</h4>
              </div>
              <p className="text-xs text-slate-600">
                Non-custodial wallets broadcast transactions through centralized RPC nodes (Infura, Alchemy, QuickNode). 
                Section 91 CrPC notice to the RPC provider reveals the suspect's origin IP address and ISP geolocation.
              </p>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] font-mono">
                <span className="text-slate-500">Target Entities:</span>
                <div className="text-purple-700 font-bold">Infura · Alchemy · Cloudflare</div>
                <div className="text-slate-400 mt-1">Yields: Origin IP & ISP Coordinates</div>
              </div>
            </div>
          </div>

          {/* Pre-Drafted Tether / Circle Smart Contract Freeze Requisition */}
          <div className="card p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-slate-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Pre-Drafted Tether (USDT) Smart Contract Freeze Requisition
                </h3>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(tetherRequisitionLetter);
                  setCopiedLetter(true);
                  setTimeout(() => setCopiedLetter(false), 2000);
                }}
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-semibold flex items-center gap-1.5 transition"
              >
                {copiedLetter ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                {copiedLetter ? 'Copied Letter' : 'Copy Requisition'}
              </button>
            </div>

            <pre className="p-3 rounded bg-slate-900 text-slate-100 font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap">
              {tetherRequisitionLetter}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
