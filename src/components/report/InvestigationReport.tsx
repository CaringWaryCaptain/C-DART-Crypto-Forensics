import React, { useRef } from 'react';
import { FileText, Download, AlertTriangle, CheckCircle, Shield } from 'lucide-react';
import type { InvestigationCase } from '../../data/syntheticCase';
import { getVASPInfo, getCountryFreezingLaws } from '../../data/vaspDirectory';

interface Props {
  caseData: InvestigationCase;
}

export default function InvestigationReport({ caseData }: Props) {
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePDFExport = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');
      if (!reportRef.current) return;
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: '#080c14',
        scale: 1.5,
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      let heightLeft = pdfHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
      pdf.save(`CDART_${caseData.caseId}_Report.pdf`);
    } catch (e) {
      alert('PDF export requires the browser to be in a non-sandboxed environment. Please try in a standard browser window.');
    }
  };

  const handleJSONExport = () => {
    const exportData = {
      caseId: caseData.caseId,
      investigatorName: caseData.investigatorName,
      incidentDate: caseData.incidentDate,
      network: caseData.network,
      suspectWallet: caseData.suspectWallet,
      reportedAmount: caseData.reportedAmount,
      riskScore: caseData.riskScore,
      riskLevel: caseData.riskLevel,
      attributionConfidence: caseData.attributionConfidence,
      likelyVasp: caseData.likelyVasp,
      transactionsAnalysed: caseData.transactionsAnalysed,
      walletsAnalysed: caseData.walletsAnalysed,
      maxHops: caseData.maxHops,
      fraudPatterns: caseData.fraudPatterns.map(p => ({ type: p.type, severity: p.severity, title: p.title })),
      vaspAttributions: caseData.vaspAttributions,
      evidenceChain: caseData.evidenceChain,
      datasetNote: caseData.datasetNote,
      generatedAt: new Date().toISOString(),
      tool: 'C-DART v1.0 — SIH 2026 PS183 Platform',
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CDART_${caseData.caseId}_Report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const riskColor = caseData.riskScore >= 80 ? '#ef4444' : '#f97316';

  return (
    <div className="p-5 h-full overflow-auto" style={{ background: '#f8fafc' }}>
      {/* Export toolbar */}
      <div className="flex items-center gap-3 mb-5">
        <FileText size={18} className="text-blue-600" />
        <h2 className="font-semibold text-slate-900">Investigation Report</h2>
        <div className="ml-auto flex gap-2">
          <button
            onClick={handlePDFExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' }}
          >
            <Download size={14} />
            Export PDF
          </button>
          <button
            onClick={handleJSONExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}
          >
            <Download size={14} />
            Export JSON
          </button>
        </div>
      </div>

      {/* Report document */}
      <div ref={reportRef} className="card p-6 space-y-6" style={{ maxWidth: 800, margin: '0 auto', background: '#ffffff' }}>
        {/* Report header */}
        <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: 16 }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                <Shield size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900">C-DART</div>
                <div className="text-xs text-slate-500">Blockchain Forensics Investigation Report</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Generated</div>
              <div className="text-sm text-slate-800 font-mono font-semibold">{new Date().toLocaleDateString()}</div>
            </div>
          </div>

          <div className="inline-block px-3 py-1 rounded text-xs font-bold mb-2"
            style={{ background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' }}>
            ⚠ SYNTHETIC INVESTIGATION DATASET — FOR DEMONSTRATION PURPOSES ONLY
          </div>
        </div>

        {/* Case info */}
        <div>
          <h3 className="text-xs font-bold mb-3 tracking-widest text-slate-500 uppercase">Case Information</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Case ID',         value: caseData.caseId },
              { label: 'Investigator',    value: caseData.investigatorName },
              { label: 'Incident Date',   value: caseData.incidentDate },
              { label: 'Network',         value: caseData.network },
              { label: 'Reported Amount', value: `$${caseData.reportedAmount.toLocaleString()}` },
              { label: 'Report Date',     value: new Date().toLocaleDateString() },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg p-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{label}</div>
                <div className="text-sm font-bold text-slate-900 font-mono">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Suspect wallet */}
        <div className="rounded-xl p-4" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
          <h3 className="text-xs font-bold mb-2 text-red-600 uppercase tracking-widest">Suspect Wallet (Victim-Reported)</h3>
          <div className="font-mono text-sm text-slate-900 break-all">{caseData.suspectWallet}</div>
        </div>

        {/* Reported amount highlight */}
        <div className="rounded-xl p-4" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Total Reported Fraud Amount</div>
              <div className="text-3xl font-bold text-slate-900 font-mono">${caseData.reportedAmount.toLocaleString()}</div>
              <div className="text-xs text-slate-500 mt-1">
                ${caseData.amountTraced.toLocaleString()} traced &nbsp;·&nbsp; {Math.round((caseData.amountTraced / caseData.reportedAmount) * 100)}% of reported
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Crime Type</div>
              <div className="text-sm font-bold text-slate-800">{caseData.crimeType}</div>
              <div className="text-xs text-slate-400 mt-1">{caseData.network} Network</div>
            </div>
          </div>
        </div>

        {/* Investigation summary */}
        <div>
          <h3 className="text-xs font-bold mb-3 tracking-widest text-slate-500 uppercase">Investigation Summary</h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Risk Level',    value: caseData.riskLevel,                           color: riskColor },
              { label: 'Risk Score',    value: `${caseData.riskScore}/100`,                  color: riskColor },
              { label: 'Transactions', value: caseData.transactionsAnalysed,                color: '#2563eb' },
              { label: 'Wallets',      value: caseData.walletsAnalysed,                     color: '#2563eb' },
              { label: 'Max Hops',     value: caseData.maxHops,                             color: '#0284c7' },
              { label: 'Amount Traced',value: `$${caseData.amountTraced.toLocaleString()}`, color: '#16a34a' },
              { label: 'Likely VASP',  value: caseData.likelyVasp,                          color: '#7c3aed' },
              { label: 'Confidence',   value: `${caseData.attributionConfidence}%`,         color: '#7c3aed' },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-lg p-3 text-center" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div className="text-base font-bold font-mono" style={{ color }}>{value}</div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Fraud patterns */}
        <div>
          <h3 className="text-xs font-bold mb-3 tracking-widest text-slate-500 uppercase">Detected Fraud Patterns</h3>
          <div className="space-y-2">
            {caseData.fraudPatterns.map(p => (
              <div key={p.id} className="flex items-start gap-3 p-3 rounded-lg"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <AlertTriangle size={14} style={{ color: p.severity === 'HIGH' ? '#ef4444' : '#f97316' }} className="flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">{p.title}</div>
                  <div className="text-xs mt-0.5 text-slate-500">{p.description}</div>
                </div>
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${p.severity === 'HIGH' ? 'badge-high' : 'badge-medium'}`}>
                  {p.severity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* VASP attribution */}
        <div>
          <h3 className="text-xs font-bold mb-3 tracking-widest text-slate-500 uppercase">VASP Attribution</h3>
          <div className="rounded-xl p-4" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-0.5">Primary VASP</div>
                <div className="text-xl font-bold text-slate-900">{caseData.likelyVasp}</div>
              </div>
              <div className="text-4xl font-bold text-blue-600 font-mono">{caseData.attributionConfidence}%</div>
            </div>
            <div className="space-y-1.5">
              {caseData.vaspAttributions[0].evidence.map((ev, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <CheckCircle size={12} className="text-green-500 flex-shrink-0 mt-0.5" />
                  {ev}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Destination Wallet Country & Statutory Freezing Laws */}
        {(() => {
          const vaspInfo = getVASPInfo(caseData.likelyVasp);
          const detectedCountry = vaspInfo.country === 'Switzerland' ? 'Switzerland' : 'India';
          const freezingLaws = getCountryFreezingLaws(detectedCountry);

          return (
            <div className="space-y-3">
              <h3 className="text-xs font-bold mb-2 tracking-widest uppercase" style={{ color: 'var(--text-secondary)' }}>
                DESTINATION WALLET JURISDICTION & STATUTORY FREEZING PROVISIONS
              </h3>
              <div className="rounded-xl p-4 border border-slate-200 bg-slate-50 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{freezingLaws.countryFlag}</span>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">
                        Destination Country: {freezingLaws.country.toUpperCase()} ({vaspInfo.jurisdiction})
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Target VASP: <strong className="text-slate-800">{vaspInfo.name}</strong> · Nodal Email: <strong className="text-blue-600">{vaspInfo.nodalEmail}</strong>
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold border border-blue-200">
                    SLA: {freezingLaws.executionSLA}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-500 block font-semibold">GOVERNING SEIZURE & FREEZING STATUTE:</span>
                    <span className="text-slate-900 font-bold">{freezingLaws.primaryStatute}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-semibold">SUPERVISORY / COMPLIANCE AUTHORITY:</span>
                    <span className="text-slate-900 font-bold">{freezingLaws.regulatoryBody}</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1 border-t border-slate-200">
                  <div className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                    Statutory Provisions for Asset Restraint & Freezing:
                  </div>
                  {freezingLaws.keySections.map((sec, idx) => (
                    <div key={idx} className="bg-white p-2.5 rounded border border-slate-200 text-[11px] text-slate-700 space-y-0.5">
                      <div className="font-bold text-blue-700 font-mono">{sec.section} ({sec.act})</div>
                      <div>{sec.description}</div>
                      <div className="text-emerald-700 font-semibold pt-0.5">{sec.actionableDirectives}</div>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 rounded bg-blue-50/80 border border-blue-200 text-[11px] text-blue-900 font-mono">
                  <strong>Recommended Law Enforcement Action:</strong> Issue formal statutory requisition ({freezingLaws.country === 'India' ? 'Section 102 CrPC notice' : 'IMAC Art. 18 / Swiss CP Art. 263 preservation request'}) immediately to {vaspInfo.nodalEmail} to enforce debit freeze prior to secondary wallet off-ramping.
                </div>
              </div>
            </div>
          );
        })()}

        {/* Key TX hashes */}
        <div>
          <h3 className="text-xs font-bold mb-3 tracking-widest" style={{ color: 'var(--text-secondary)' }}>KEY TRANSACTION HASHES</h3>
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: 'var(--bg-secondary)' }}>
                  <th className="text-left px-3 py-2 font-semibold" style={{ color: 'var(--text-muted)' }}>Step</th>
                  <th className="text-left px-3 py-2 font-semibold" style={{ color: 'var(--text-muted)' }}>TX Hash</th>
                  <th className="text-right px-3 py-2 font-semibold" style={{ color: 'var(--text-muted)' }}>Amount</th>
                  <th className="text-right px-3 py-2 font-semibold" style={{ color: 'var(--text-muted)' }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {caseData.evidenceChain.map((s, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                    <td className="px-3 py-2 text-white">{s.order}. {s.label.slice(0, 22)}...</td>
                    <td className="px-3 py-2 font-mono" style={{ color: '#60a5fa' }}>{s.txHash.slice(0, 20)}...</td>
                    <td className="px-3 py-2 text-right font-semibold text-white">${s.amount.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right" style={{ color: 'var(--text-muted)' }}>{new Date(s.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-center pt-4" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
          C-DART v1.0 — SIH 2026 PS183 Platform · Generated {new Date().toISOString()} ·
          All data is synthetic and for demonstration purposes only.
          Analytical scores are not legally admissible without independent verification.
        </div>
      </div>
    </div>
  );
}
