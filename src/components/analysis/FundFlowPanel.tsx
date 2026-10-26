import React from 'react';
import { ArrowDown, DollarSign, Clock, GitBranch } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { InvestigationCase } from '../../data/syntheticCase';

interface Props {
  caseData: InvestigationCase;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="px-3 py-2 rounded text-xs bg-white border border-slate-300 shadow-sm">
        <div className="font-bold text-black">${payload[0].value.toLocaleString()}</div>
        <div className="text-slate-500">{payload[0].payload.label}</div>
      </div>
    );
  }
  return null;
};

export default function FundFlowPanel({ caseData }: Props) {
  // Dynamically compute flow steps from caseData.evidenceChain
  const flowSteps = caseData.evidenceChain.map((step, idx) => {
    const pct = Math.round((step.amount / caseData.reportedAmount) * 100);
    const dateObj = new Date(step.timestamp);
    const timeStr = isNaN(dateObj.getTime())
      ? 'Step ' + step.order
      : dateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    const color =
      idx === 0
        ? '#ef4444'
        : idx === caseData.evidenceChain.length - 1
        ? '#10b981'
        : '#f59e0b';

    return {
      label: step.label,
      address: `${step.address.slice(0, 6)}...${step.address.slice(-4)}`,
      amount: step.amount,
      pct,
      hop: step.order - 1,
      time: timeStr,
      color,
    };
  });

  // Dynamically compute timeline chart
  const timelineData = caseData.evidenceChain.map(step => {
    const dateObj = new Date(step.timestamp);
    const timeStr = isNaN(dateObj.getTime())
      ? `Hop ${step.order - 1}`
      : dateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    return {
      time: timeStr,
      amount: step.amount,
      label: step.label.split(' ')[0],
    };
  });

  // Dynamically compute VASP split
  const vaspSplit = caseData.vaspAttributions.map((v, i) => ({
    name: v.vasp,
    value: v.fundsPercentage,
    color: i === 0 ? '#0f172a' : i === 1 ? '#3b82f6' : '#94a3b8',
  }));

  const primaryVaspPercentage = caseData.vaspAttributions[0]?.fundsPercentage || caseData.attributionConfidence;

  return (
    <div className="p-5 space-y-5 h-full overflow-auto" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <DollarSign size={18} className="text-slate-800" />
          <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
            Fund Flow & Hop Tracing Ledger
          </h2>
        </div>
        <div className="text-xs px-2.5 py-1 rounded bg-slate-100 font-mono font-bold text-slate-900 border border-slate-200">
          ${caseData.amountTraced.toLocaleString()} / ${caseData.reportedAmount.toLocaleString()} Traced
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Flow Steps */}
        <div className="card p-4">
          <h3 className="text-xs font-bold uppercase text-slate-600 mb-4 tracking-wider">
            CHRONOLOGICAL FUND MOVEMENT TRAIL ({flowSteps.length} HOPS)
          </h3>
          <div className="space-y-0">
            {flowSteps.map((step, i) => (
              <div key={i} className="relative">
                <div className="flex items-start gap-3 pb-0">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 border"
                      style={{ background: step.color + '15', borderColor: step.color, color: step.color }}
                    >
                      {step.hop}
                    </div>
                    {i < flowSteps.length - 1 && (
                      <div className="w-px flex-1 mt-1 mb-1 bg-slate-200" style={{ minHeight: 18 }} />
                    )}
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-semibold text-slate-900">{step.label}</span>
                      <span className="text-xs font-mono font-bold" style={{ color: step.color }}>
                        ${step.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-mono">
                      <span className="text-slate-500">{step.address}</span>
                      <span className="ml-auto text-slate-400">{step.time}</span>
                      <span className="font-bold" style={{ color: step.pct >= 90 ? '#10b981' : '#f59e0b' }}>
                        {step.pct}%
                      </span>
                    </div>
                    <div className="mt-1 h-1 rounded-full overflow-hidden bg-slate-100">
                      <div className="h-full rounded-full transition-all" style={{ width: `${step.pct}%`, background: step.color }} />
                    </div>
                  </div>
                </div>
                {i < flowSteps.length - 1 && (
                  <div className="absolute left-3.5 ml-px" style={{ top: 28, height: 16 }}>
                    <ArrowDown size={10} className="text-slate-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {/* Timeline Chart */}
          <div className="card p-4">
            <h3 className="text-xs font-bold uppercase text-slate-600 mb-3 flex items-center gap-2 tracking-wider">
              <Clock size={13} />
              DISPERSED AMOUNT TIMELINE
            </h3>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="amount" stroke="#0f172a" fill="#0f172a" fillOpacity={0.08} strokeWidth={2} dot={{ fill: '#0f172a', r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* VASP Distribution */}
          <div className="card p-4">
            <h3 className="text-xs font-bold uppercase text-slate-600 mb-3 flex items-center gap-2 tracking-wider">
              <GitBranch size={13} />
              VASP DESTINATION DISTRIBUTION
            </h3>
            <div className="space-y-2.5">
              {vaspSplit.map(v => (
                <div key={v.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-800">{v.name}</span>
                    <span className="font-mono font-bold text-slate-900">{v.value}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden bg-slate-100">
                    <div className="h-full rounded-full" style={{ width: `${v.value}%`, background: v.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 text-xs text-slate-500 border-t border-slate-100">
              {primaryVaspPercentage}% of traced funds reached <strong>{caseData.likelyVasp}</strong>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Amount Traced', value: `$${caseData.amountTraced.toLocaleString()}`, color: '#0f172a' },
              { label: 'Max Hops', value: `${caseData.maxHops}`, color: '#0f172a' },
              { label: 'Likely VASP', value: caseData.likelyVasp, color: '#0284c7' },
              { label: 'Attribution Confidence', value: `${caseData.attributionConfidence}%`, color: '#10b981' },
            ].map(s => (
              <div key={s.label} className="card p-3">
                <div className="text-base font-bold font-mono truncate" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[10px] font-bold uppercase text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
