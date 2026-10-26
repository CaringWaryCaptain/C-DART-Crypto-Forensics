import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import CommandBar from './components/layout/CommandBar';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import CreateInvestigation from './pages/CreateInvestigation';
import InvestigationProgress from './pages/InvestigationProgress';
import InvestigationDashboard from './pages/InvestigationDashboard';
import InvestigationsPage from './pages/InvestigationsPage';
import VASPIntelligencePage from './pages/VASPIntelligencePage';
import SettingsPage from './pages/SettingsPage';
import { type OfficerSession, SESSION_KEY } from './pages/LoginPage';
import { demoCase, buildLiveCase } from './data/syntheticCase';
import type { InvestigationCase } from './data/syntheticCase';
import type { WalletSummary } from './services/etherscanApi';
import type { CommandResult } from './components/layout/CommandBar';

export type AppPage =
  | 'dashboard'
  | 'create-investigation'
  | 'investigation-progress'
  | 'investigation-dashboard'
  | 'investigations'
  | 'wallet-intelligence'
  | 'vasp-intelligence'
  | 'risk-analysis'
  | 'reports'
  | 'settings';

export interface CaseForm {
  caseId: string;
  investigatorName: string;
  incidentDate: string;
  reportedAmount: string;
  network: string;
  suspectWallet: string;
}

const DEFAULT_OFFICER: OfficerSession = {
  name: 'AHMED SAAD',
  badgeNo: 'UP-1944',
  role: 'IO',
  roleLabel: 'Investigating Officer (IO)',
  state: 'Uttar Pradesh',
  unit: 'UP Police Cyber Crime Cell',
  rank: 'Inspector / IO',
};

const DEMO_FORM: CaseForm = {
  caseId: demoCase.caseId,
  investigatorName: demoCase.investigatorName,
  incidentDate: demoCase.incidentDate,
  reportedAmount: String(demoCase.reportedAmount),
  network: demoCase.network,
  suspectWallet: demoCase.suspectWallet,
};

function App() {
  const [page, setPage]         = useState<AppPage>('vasp-intelligence');
  const [caseForm, setCaseForm] = useState<CaseForm>(DEMO_FORM);
  const [activeCase, setActiveCase] = useState<InvestigationCase>(demoCase);

  const [officer, setOfficer] = useState<OfficerSession>(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_OFFICER;
  });

  const navigate = (p: AppPage) => setPage(p);

  // Demo shortcut — launch specific demo case
  const handleDemo = (targetCase?: InvestigationCase) => {
    const selected = targetCase || demoCase;
    setCaseForm({
      caseId: selected.caseId,
      investigatorName: selected.investigatorName,
      incidentDate: selected.incidentDate,
      reportedAmount: String(selected.reportedAmount),
      network: selected.network,
      suspectWallet: selected.suspectWallet,
    });
    setActiveCase(selected);
    navigate('investigation-dashboard');
  };

  // Called when InvestigationProgress completes — merges real API data if available
  const handleProgressComplete = (liveData: WalletSummary | null) => {
    const merged = buildLiveCase({
      caseId:             caseForm.caseId,
      investigatorName:   caseForm.investigatorName,
      incidentDate:       caseForm.incidentDate,
      network:            caseForm.network,
      suspectWallet:      caseForm.suspectWallet,
      reportedAmount:     parseFloat(caseForm.reportedAmount) || demoCase.reportedAmount,
      realTxCount:        liveData?.txCount,
      realBalanceEth:     liveData?.balanceEth,
    });
    setActiveCase(merged);
    navigate('investigation-dashboard');
  };

  const handleCommandSelect = (result: CommandResult) => {
    if (result.type === 'case' || result.type === 'wallet' || result.type === 'vasp') {
      handleDemo();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* Officer & Jurisdiction Top Bar */}
      <Navbar officer={officer} onNavigate={navigate} />

      <div className="flex flex-1 overflow-hidden min-h-0">
        <CommandBar onSelect={handleCommandSelect} />
        <Sidebar currentPage={page} onNavigate={navigate} />

        <main className="flex-1 overflow-hidden flex flex-col min-h-0">
          {page === 'dashboard' && (
            <Dashboard onNavigate={navigate} onDemo={handleDemo} />
          )}
          {page === 'create-investigation' && (
            <CreateInvestigation
              form={caseForm}
              onChange={setCaseForm}
              onStart={() => navigate('investigation-progress')}
              onDemo={handleDemo}
            />
          )}
          {page === 'investigation-progress' && (
            <InvestigationProgress
              form={caseForm}
              onComplete={handleProgressComplete}
            />
          )}
          {page === 'investigation-dashboard' && (
            <InvestigationDashboard
              caseData={activeCase}
              onNavigate={navigate}
              onSwitchCase={handleDemo}
            />
          )}
          {page === 'investigations' && (
            <InvestigationsPage
              onNavigate={navigate}
              onOpenCase={handleDemo}
            />
          )}
          {page === 'vasp-intelligence' && (
            <VASPIntelligencePage
              onNavigate={navigate}
            />
          )}
          {page === 'wallet-intelligence' && (
            <InvestigationDashboard
              caseData={activeCase}
              onNavigate={navigate}
              onSwitchCase={handleDemo}
              initialTab="wallet"
            />
          )}
          {page === 'risk-analysis' && (
            <InvestigationDashboard
              caseData={activeCase}
              onNavigate={navigate}
              onSwitchCase={handleDemo}
              initialTab="risk"
            />
          )}
          {page === 'reports' && (
            <InvestigationDashboard
              caseData={activeCase}
              onNavigate={navigate}
              onSwitchCase={handleDemo}
              initialTab="report"
            />
          )}
          {page === 'settings' && (
            <SettingsPage
              officer={officer}
              onNavigate={navigate}
              onLogout={() => {
                localStorage.removeItem(SESSION_KEY);
                setOfficer(DEFAULT_OFFICER);
                navigate('dashboard');
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
