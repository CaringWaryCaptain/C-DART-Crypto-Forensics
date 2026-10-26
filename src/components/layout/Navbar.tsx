import { UserCheck } from 'lucide-react';
import type { AppPage } from '../../App';
import type { OfficerSession } from '../../pages/LoginPage';

interface Props {
  officer: OfficerSession;
  onNavigate: (page: AppPage) => void;
}

export default function Navbar({ officer, onNavigate }: Props) {
  return (
    <header
      className="flex items-center justify-between px-4 py-1.5 text-xs select-none flex-shrink-0"
      style={{
        background: '#0a0f1d',
        borderBottom: '1px solid #1e293b',
        color: '#f8fafc',
      }}
    >
      {/* Left: Jurisdiction / Police Department */}
      <div className="flex items-center gap-2 font-mono">
        <div className="flex flex-col w-4 h-3 rounded-xs overflow-hidden border border-slate-700 flex-shrink-0" title="India">
          <div className="h-1 bg-amber-500 w-full" />
          <div className="h-1 bg-white w-full flex items-center justify-center">
            <div className="w-0.5 h-0.5 rounded-full bg-blue-900" />
          </div>
          <div className="h-1 bg-emerald-600 w-full" />
        </div>
        <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px]">
          IN {officer.state.toUpperCase()} · {officer.unit.toUpperCase()}
        </span>
        <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      {/* Right: Investigating Officer Credentials */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('settings')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700/80 hover:border-slate-500 text-slate-200 transition cursor-pointer"
          title="Click to view officer credentials and settings"
        >
          <UserCheck size={13} className="text-blue-400" />
          <span className="text-[11px] text-slate-400 font-normal">Investigating Officer</span>
          <span className="text-[11px] font-bold text-white tracking-wide">{officer.name}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold">
            #{officer.badgeNo}
          </span>
        </button>
      </div>
    </header>
  );
}

