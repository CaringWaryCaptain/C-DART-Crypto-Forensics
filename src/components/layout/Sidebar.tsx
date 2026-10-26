import { useState } from 'react';
import {
  LayoutDashboard, Search, Wallet, GitBranch, Building2,
  BarChart3, FileText, Settings, ChevronLeft, ChevronRight,
  Shield, AlertTriangle, Command, HardDrive, Radio, Plus, CheckCircle2
} from 'lucide-react';
import { getAllCases } from '../../services/caseDb';
import type { AppPage } from '../../App';

interface Props {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
}

interface NavSection {
  title?: string;
  items: {
    id: AppPage;
    icon: React.ElementType;
    label: string;
    badge?: string | number;
    badgeColor?: string;
    badgeBg?: string;
    isAction?: boolean;
  }[];
}

export default function Sidebar({ currentPage, onNavigate }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const storedCases = getAllCases();
  const activeCount = storedCases.length > 0 ? storedCases.length : 11;

  const sections: NavSection[] = [
    {
      title: 'OPERATIONS',
      items: [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'create-investigation', icon: Plus, label: 'New Investigation', isAction: true },
        {
          id: 'investigations',
          icon: GitBranch,
          label: 'Investigations',
          badge: activeCount,
          badgeBg: '#fee2e2',
          badgeColor: '#991b1b',
        },
      ],
    },
    {
      title: 'FORENSIC INTEL',
      items: [
        {
          id: 'vasp-intelligence',
          icon: Building2,
          label: 'VASP Intelligence',
          badge: '10',
          badgeBg: '#eff6ff',
          badgeColor: '#1d4ed8',
        },
        { id: 'wallet-intelligence', icon: Wallet, label: 'Wallet Intelligence' },
        { id: 'risk-analysis', icon: BarChart3, label: 'Risk Analysis' },
      ],
    },
    {
      title: 'COURT & OUTPUT',
      items: [
        { id: 'reports', icon: FileText, label: 'Reports & FIR' },
      ],
    },
    {
      title: 'PREFERENCES',
      items: [
        { id: 'settings', icon: Settings, label: 'Settings & DB' },
      ],
    },
  ];

  const isActive = (id: AppPage) =>
    currentPage === id ||
    (currentPage === 'investigation-progress' && id === 'create-investigation') ||
    (currentPage === 'investigation-dashboard' && id === 'investigations');

  const triggerCommandBar = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
  };

  return (
    <aside
      className="flex flex-col transition-all duration-300 relative flex-shrink-0 select-none"
      style={{
        width: collapsed ? '68px' : '235px',
        background: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        height: '100%',
        boxShadow: '1px 0 3px rgba(0,0,0,0.02)',
      }}
    >
      {/* 1. Header & Brand */}
      <div
        className="flex items-center justify-between px-4 py-3.5"
        style={{ borderBottom: '1px solid #f1f5f9' }}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-slate-900 text-white shadow-md shadow-slate-900/20">
            <Shield size={18} className="text-blue-400" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in-up">
              <div className="font-extrabold text-slate-900 text-sm tracking-wider flex items-center gap-1.5 font-mono">
                C-DART
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                  SIH
                </span>
              </div>
              <div className="text-[10px] font-semibold text-slate-400 font-mono tracking-wider uppercase">
                FORENSICS v1.0
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Quick Command Search Bar */}
      {!collapsed ? (
        <div className="px-3 pt-3">
          <button
            onClick={triggerCommandBar}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200/80 transition text-xs cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Search size={13} className="text-slate-400 group-hover:text-blue-600 transition" />
              <span className="text-[11px] font-medium text-slate-500">Quick search...</span>
            </div>
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white text-[10px] font-mono font-bold text-slate-400 border border-slate-200 shadow-2xs">
              <Command size={10} />
              <span>K</span>
            </div>
          </button>
        </div>
      ) : (
        <div className="flex justify-center pt-2">
          <button
            onClick={triggerCommandBar}
            title="Search (Ctrl+K)"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          >
            <Search size={16} />
          </button>
        </div>
      )}

      {/* 3. High-Priority Alert Banner */}
      {!collapsed ? (
        <div className="mx-3 my-2.5 px-3 py-2 rounded-lg flex items-center justify-between bg-rose-50/80 border border-rose-200/70">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
            </span>
            <span className="text-[11px] font-bold text-rose-900 font-mono">
              {activeCount} Active Cases
            </span>
          </div>
          <button
            onClick={() => onNavigate('investigations')}
            className="text-[10px] font-bold text-rose-700 hover:text-rose-950 uppercase tracking-wider cursor-pointer"
          >
            View
          </button>
        </div>
      ) : (
        <div className="flex justify-center my-1.5">
          <div
            title={`${activeCount} Active Cases`}
            className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"
          />
        </div>
      )}

      {/* 4. Categorized Navigation */}
      <nav className="flex-1 px-2.5 py-1 overflow-y-auto space-y-3.5 custom-scrollbar">
        {sections.map((sec, secIdx) => (
          <div key={secIdx} className="space-y-0.5">
            {!collapsed && sec.title && (
              <div className="px-2.5 pb-1 text-[10px] font-extrabold font-mono text-slate-400 uppercase tracking-wider">
                {sec.title}
              </div>
            )}
            {sec.items.map(({ id, icon: Icon, label, badge, badgeBg, badgeColor, isAction }) => {
              const active = isActive(id);

              return (
                <button
                  key={id}
                  onClick={() => onNavigate(id)}
                  title={collapsed ? label : undefined}
                  className={`w-full group relative flex items-center rounded-lg transition-all text-xs font-semibold cursor-pointer ${
                    active
                      ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/10'
                      : isAction
                      ? 'bg-blue-50/60 hover:bg-blue-50 text-blue-700 border border-blue-200/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                  style={{
                    padding: collapsed ? '9px' : '7.5px 10px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    gap: '10px',
                  }}
                >
                  {/* Left Active Glow Bar */}
                  {active && !collapsed && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-blue-500 rounded-r" />
                  )}

                  <Icon
                    size={16}
                    className={`flex-shrink-0 transition-transform group-hover:scale-105 ${
                      active
                        ? 'text-blue-400'
                        : isAction
                        ? 'text-blue-600'
                        : 'text-slate-400 group-hover:text-slate-700'
                    }`}
                  />

                  {!collapsed && (
                    <span className="flex-1 text-left truncate tracking-tight text-[12px]">
                      {label}
                    </span>
                  )}

                  {!collapsed && badge !== undefined && (
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.2 rounded-md font-mono"
                      style={{
                        background: active ? '#1e293b' : badgeBg || '#f1f5f9',
                        color: active ? '#93c5fd' : badgeColor || '#475569',
                        border: active ? '1px solid #334155' : '1px solid rgba(0,0,0,0.05)',
                      }}
                    >
                      {badge}
                    </span>
                  )}

                  {/* Tooltip on Collapsed Mode */}
                  {collapsed && (
                    <div className="absolute left-full ml-3.5 px-2.5 py-1.5 rounded-md bg-slate-900 text-white text-[11px] font-semibold whitespace-nowrap shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition z-50">
                      {label}
                      {badge !== undefined && ` (${badge})`}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* 5. Live Node & Database Status Footer */}
      {!collapsed && (
        <div className="mx-3 mb-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 text-[10px] space-y-1.5 font-mono">
          <div className="flex items-center justify-between text-slate-500">
            <span className="flex items-center gap-1.5">
              <Radio size={11} className="text-emerald-500 animate-pulse" />
              <span>ETH Node:</span>
            </span>
            <span className="font-bold text-emerald-600">Online · V2</span>
          </div>
          <div className="flex items-center justify-between text-slate-500 border-t border-slate-200/60 pt-1">
            <span className="flex items-center gap-1.5">
              <HardDrive size={11} className="text-blue-500" />
              <span>Local DB:</span>
            </span>
            <span className="font-bold text-slate-700">cases.json ({activeCount})</span>
          </div>
        </div>
      )}

      {/* 6. Collapse Toggle */}
      <div
        className="px-3 py-2 flex items-center justify-between"
        style={{ borderTop: '1px solid #f1f5f9' }}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer text-xs font-semibold"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          {!collapsed && <span className="text-[11px]">Collapse sidebar</span>}
        </button>
      </div>
    </aside>
  );
}
