import { useState } from 'react';
import { Shield, ChevronDown, LogIn, Zap } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface OfficerSession {
  name: string;
  badgeNo: string;
  role: 'IO' | 'ANALYST' | 'NODAL';
  roleLabel: string;
  state: string;
  unit: string;
  rank: string;
}

export const SESSION_KEY = 'cdart_officer_session';

// ── Data ──────────────────────────────────────────────────────────────────────
const STATE_UNITS: { state: string; unit: string }[] = [
  { state: 'Delhi',               unit: 'IFSO – Intelligence Fusion & Strategic Ops' },
  { state: 'Maharashtra',         unit: 'Maharashtra Cyber – CCPWC' },
  { state: 'Telangana',           unit: 'TGCSB – Telangana Cyber Security Bureau' },
  { state: 'Karnataka',           unit: 'CID Cyber Crime, Karnataka Police' },
  { state: 'Uttar Pradesh',       unit: 'UP Police Cyber Crime Cell' },
  { state: 'Rajasthan',           unit: 'Rajasthan Cyber Cell, Jaipur' },
  { state: 'Tamil Nadu',          unit: 'CBCID Cyber Crime Wing, Tamil Nadu' },
  { state: 'Gujarat',             unit: 'Gujarat CID Cyber Crime' },
  { state: 'West Bengal',         unit: 'West Bengal Cyber Crime Wing' },
  { state: 'Madhya Pradesh',      unit: 'MP Cyber Cell – EOW' },
  { state: 'Kerala',              unit: 'Kerala Cyber Dome, Hi-Tech Cell' },
  { state: 'Andhra Pradesh',      unit: 'AP Cyber Crimes Unit, CID' },
  { state: 'Bihar',               unit: 'Bihar Police Economic Offences Unit' },
  { state: 'Punjab',              unit: 'Punjab Police Cyber Crime Cell' },
  { state: 'Haryana',             unit: 'Haryana Police Cyber Crime Cell' },
  { state: 'Odisha',              unit: 'Odisha Police Cyber Crime Unit' },
  { state: 'Assam',               unit: 'Assam Police Cyber Crime Cell' },
  { state: 'Jharkhand',           unit: 'Jharkhand Police Cyber Cell' },
  { state: 'Chhattisgarh',        unit: 'CG Police Cyber Cell, Raipur' },
  { state: 'Uttarakhand',         unit: 'Uttarakhand Police Cyber Cell' },
  { state: 'Himachal Pradesh',    unit: 'HP Police Cyber Crime Unit' },
  { state: 'Goa',                 unit: 'Goa Police Cyber Crime Cell' },
  { state: 'Tripura',             unit: 'Tripura Police Cyber Crime Wing' },
  { state: 'Manipur',             unit: 'Manipur Police Cyber Cell' },
  { state: 'Meghalaya',           unit: 'Meghalaya Police Cyber Crime Unit' },
  { state: 'Jammu & Kashmir',     unit: 'J&K Police Cyber Cell' },
  { state: 'CBI',                 unit: 'CBI – Cyber & Economic Offences Branch' },
  { state: 'ED / Enforcement',    unit: 'Enforcement Directorate – PMLA Division' },
];

const ROLES: { value: OfficerSession['role']; label: string; rank: string }[] = [
  { value: 'IO',       label: 'Investigating Officer (IO)',        rank: 'Inspector / SI'      },
  { value: 'ANALYST',  label: 'Cyber Forensic Analyst',           rank: 'Sub-Inspector / ASI' },
  { value: 'NODAL',    label: 'Nodal Officer / Case Supervisor',  rank: 'SP / DCP / ACP'      },
];

const DEMO_LOGINS: OfficerSession[] = [
  {
    name: 'SI Ramesh Kumar',
    badgeNo: 'DL-8821',
    role: 'IO',
    roleLabel: 'Investigating Officer (IO)',
    state: 'Delhi',
    unit: 'IFSO – Intelligence Fusion & Strategic Ops',
    rank: 'Inspector / SI',
  },
  {
    name: 'Inspector Priya Sharma',
    badgeNo: 'MH-4412',
    role: 'ANALYST',
    roleLabel: 'Cyber Forensic Analyst',
    state: 'Maharashtra',
    unit: 'Maharashtra Cyber – CCPWC',
    rank: 'Sub-Inspector / ASI',
  },
  {
    name: 'SP Arun Nair (Nodal)',
    badgeNo: 'KL-0091',
    role: 'NODAL',
    roleLabel: 'Nodal Officer / Case Supervisor',
    state: 'Kerala',
    unit: 'Kerala Cyber Dome, Hi-Tech Cell',
    rank: 'SP / DCP / ACP',
  },
];

interface Props {
  onLogin: (session: OfficerSession) => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [selectedState, setSelectedState] = useState(STATE_UNITS[0]);
  const [selectedRole, setSelectedRole]   = useState(ROLES[0]);
  const [officerName, setOfficerName]     = useState('');
  const [badgeNo, setBadgeNo]             = useState('');
  const [error, setError]                 = useState('');

  const handleLogin = () => {
    if (!officerName.trim()) { setError('Officer name is required'); return; }
    if (!badgeNo.trim())     { setError('Badge / Service number is required'); return; }
    setError('');
    const session: OfficerSession = {
      name:      officerName.trim(),
      badgeNo:   badgeNo.trim().toUpperCase(),
      role:      selectedRole.value,
      roleLabel: selectedRole.label,
      state:     selectedState.state,
      unit:      selectedState.unit,
      rank:      selectedRole.rank,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    onLogin(session);
  };

  const handleDemoLogin = (demo: OfficerSession) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(demo));
    onLogin(demo);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: '#f8fafc' }}
    >
      {/* Dot grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.5,
        }}
      />

      <div className="w-full max-w-sm relative z-10">

        {/* Header */}
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded mb-3"
            style={{
              background: '#000000',
              border: '2px solid #000000',
              boxShadow: '4px 4px 0px #475569',
            }}
          >
            <Shield size={26} className="text-white" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-0.5">
            <span className="text-2xl">🇮🇳</span>
            <h1 className="text-3xl font-black tracking-tight text-black">C-DART</h1>
          </div>
          <p className="text-[11px] font-black tracking-widest uppercase text-black">
            Crypto Digital Asset Recovery Toolkit
          </p>
          <p className="text-[10px] mt-0.5 font-semibold" style={{ color: '#64748b' }}>
            Ministry of Home Affairs · NCRB Integrated Platform
          </p>
        </div>

        {/* Login Card */}
        <div
          className="rounded bg-white p-5 space-y-4"
          style={{ border: '2px solid #000000', boxShadow: '5px 5px 0px #000000' }}
        >
          <div className="text-[10px] font-black uppercase tracking-widest text-black border-b-2 border-black pb-2">
            🔐 Secure Officer Authentication
          </div>

          {/* State / Unit */}
          <div>
            <label className="block text-[10px] font-black mb-1.5 uppercase tracking-wider text-black">
              State Cyber Cell / Unit
            </label>
            <div className="relative">
              <select
                value={selectedState.state}
                onChange={e => {
                  const found = STATE_UNITS.find(s => s.state === e.target.value);
                  if (found) setSelectedState(found);
                }}
                className="w-full appearance-none text-sm font-bold pr-8 pl-3 py-2 rounded outline-none bg-white text-black"
                style={{ border: '2px solid #000000' }}
              >
                {STATE_UNITS.map(s => (
                  <option key={s.state} value={s.state}>
                    {s.state} Police – {s.unit.split('–')[0].trim()}
                  </option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-3 pointer-events-none text-black" />
            </div>
            <div className="text-[10px] mt-1 font-mono font-semibold" style={{ color: '#64748b' }}>
              {selectedState.unit}
            </div>
          </div>

          {/* Officer Role */}
          <div>
            <label className="block text-[10px] font-black mb-1.5 uppercase tracking-wider text-black">
              Officer Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map(r => (
                <button
                  key={r.value}
                  onClick={() => setSelectedRole(r)}
                  className="py-2 px-1 rounded text-center text-[10px] font-black uppercase transition-all"
                  style={{
                    background:  selectedRole.value === r.value ? '#000000' : '#ffffff',
                    border:      '2px solid #000000',
                    boxShadow:   selectedRole.value === r.value ? 'none' : '2px 2px 0px #000000',
                    color:       selectedRole.value === r.value ? '#ffffff' : '#000000',
                    transform:   selectedRole.value === r.value ? 'translate(2px,2px)' : 'none',
                  }}
                >
                  {r.value === 'IO' ? '🔍 IO' : r.value === 'ANALYST' ? '🧬 Analyst' : '⭐ Nodal'}
                </button>
              ))}
            </div>
            <div className="text-[10px] mt-1 font-semibold" style={{ color: '#64748b' }}>
              {selectedRole.rank} · {selectedRole.label}
            </div>
          </div>

          {/* Officer Name */}
          <div>
            <label className="block text-[10px] font-black mb-1.5 uppercase tracking-wider text-black">
              Officer Name
            </label>
            <input
              type="text"
              placeholder="e.g. SI Ramesh Kumar"
              value={officerName}
              onChange={e => setOfficerName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="w-full text-sm font-semibold px-3 py-2 rounded outline-none bg-white text-black placeholder:text-slate-400"
              style={{ border: '2px solid #000000' }}
            />
          </div>

          {/* Badge No */}
          <div>
            <label className="block text-[10px] font-black mb-1.5 uppercase tracking-wider text-black">
              Badge / Service No.
            </label>
            <input
              type="text"
              placeholder="e.g. DL-8821"
              value={badgeNo}
              onChange={e => setBadgeNo(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="w-full text-sm font-black px-3 py-2 rounded outline-none bg-white font-mono placeholder:text-slate-400"
              style={{ border: '2px solid #000000', color: '#000000' }}
            />
          </div>

          {error && (
            <div
              className="text-xs font-bold px-3 py-2 rounded"
              style={{ background: '#fef2f2', color: '#dc2626', border: '2px solid #000000' }}
            >
              ⚠ {error}
            </div>
          )}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded font-black text-sm uppercase tracking-wider transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            style={{
              background:  '#000000',
              color:       '#ffffff',
              border:      '2px solid #000000',
              boxShadow:   '4px 4px 0px #475569',
            }}
          >
            <LogIn size={15} />
            Access C-DART Platform
          </button>
        </div>

        {/* Demo Login Shortcuts */}
        <div
          className="mt-4 rounded bg-white p-4 space-y-2"
          style={{ border: '2px solid #000000', boxShadow: '5px 5px 0px #000000' }}
        >
          <div className="flex items-center gap-2 mb-3 border-b-2 border-black pb-2">
            <Zap size={11} className="text-black" />
            <span className="text-[10px] font-black uppercase tracking-widest text-black">
              Quick Demo Access (Hackathon)
            </span>
          </div>
          {DEMO_LOGINS.map((demo, i) => (
            <button
              key={i}
              onClick={() => handleDemoLogin(demo)}
              className="w-full flex items-center justify-between px-3 py-2 rounded text-left transition-all hover:bg-slate-50 active:translate-x-[1px] active:translate-y-[1px]"
              style={{ border: '2px solid #000000', boxShadow: '2px 2px 0px #000000' }}
            >
              <div>
                <div className="text-xs font-black text-black">{demo.name}</div>
                <div className="text-[10px] font-semibold" style={{ color: '#64748b' }}>
                  {demo.state} · {demo.roleLabel.split(' (')[0]}
                </div>
              </div>
              <div
                className="text-[10px] font-mono font-black px-2 py-0.5 rounded"
                style={{ background: '#000000', color: '#ffffff' }}
              >
                #{demo.badgeNo}
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-4 text-[10px] font-semibold" style={{ color: '#94a3b8' }}>
          C-DART v1.0 · SIH26183 · MHA Problem Statement 183<br />
          Authorized use only · All access is logged and audited
        </div>

      </div>
    </div>
  );
}
