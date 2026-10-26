import React from 'react';
import { BarChart3, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { RiskFactor } from '../../data/syntheticCase';

interface Props {
  factors: RiskFactor[];
  totalScore: number;
  riskLevel: string;
}

const Gauge = ({ score }: { score: number }) => {
  const angle = -135 + (score / 100) * 270;
  const color = score >= 80 ? '#ef4444' : score >= 60 ? '#f97316' : score >= 40 ? '#eab308' : '#22c55e';

  return (
    <div className="relative flex flex-col items-center">
      <svg viewBox="0 0 200 130" width="180" height="120">
        {/* Background arc */}
        <path d="M 20 110 A 80 80 0 1 1 180 110" fill="none" stroke="#1e2d47" strokeWidth="14" strokeLinecap="round" />
        {/* Green zone */}
        <path d="M 20 110 A 80 80 0 0 1 57 41" fill="none" stroke="#22c55e" strokeWidth="14" strokeLinecap="round" opacity="0.25" />
        {/* Yellow zone */}
        <path d="M 57 41 A 80 80 0 0 1 143 41" fill="none" stroke="#eab308" strokeWidth="14" strokeLinecap="round" opacity="0.25" />
        {/* Red zone */}
        <path d="M 143 41 A 80 80 0 0 1 180 110" fill="none" stroke="#ef4444" strokeWidth="14" strokeLinecap="round" opacity="0.25" />

        {/* Needle */}
        <g transform={`rotate(${angle}, 100, 110)`}>
          <line x1="100" y1="110" x2="100" y2="40" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="110" r="6" fill={color} />
          <circle cx="100" cy="110" r="3" fill="#080c14" />
        </g>

        {/* Labels */}
        <text x="14" y="128" fontSize="10" fill="#4a5568">LOW</text>
        <text x="85" y="22" fontSize="10" fill="#4a5568">MED</text>
        <text x="163" y="128" fontSize="10" fill="#4a5568">HIGH</text>
      </svg>

      <div className="text-center -mt-3">
        <div className="text-4xl font-bold" style={{ color }}>{score}</div>
        <div className="text-xs font-semibold" style={{ color }}>/ 100</div>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const d = payload[0].payload;
    return (
      <div className="p-3 rounded-lg max-w-xs text-xs" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="font-bold text-white mb-1">{d.label}: +{d.score}</div>
        <div style={{ color: 'var(--text-secondary)' }}>{d.reason}</div>
      </div>
    );
  }
  return null;
};

const barColors = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#a855f7'];

export default function RiskScoring({ factors, totalScore, riskLevel }: Props) {
  const riskColor = totalScore >= 80 ? '#ef4444' : totalScore >= 60 ? '#f97316' : '#22c55e';

  return (
    <div className="p-5 h-full overflow-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BarChart3 size={18} className="text-blue-400" />
        <h2 className="font-semibold text-white">Risk Scoring Engine</h2>
        <div className="ml-auto text-xs px-2 py-1 rounded-full"
          style={{ background: 'rgba(234,179,8,0.08)', color: '#eab308', border: '1px solid rgba(234,179,8,0.2)' }}>
          Analytical Prototype Score
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Gauge */}
        <div className="card p-5 flex flex-col items-center">
          <div className="text-xs font-semibold mb-4 text-center" style={{ color: 'var(--text-secondary)' }}>
            WALLET RISK SCORE
          </div>
          <Gauge score={totalScore} />
          <div className="mt-4 text-center">
            <div className="text-sm font-bold px-4 py-1.5 rounded-full"
              style={{ background: `${riskColor}18`, color: riskColor, border: `1px solid ${riskColor}33` }}>
              Risk Level: {riskLevel}
            </div>
          </div>

          {/* Score breakdown table */}
          <div className="mt-4 w-full space-y-1.5">
            {factors.map((f, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1"
                style={{ borderBottom: i < factors.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{f.label}</span>
                <span className="font-bold font-mono text-green-400">+{f.score}</span>
              </div>
            ))}
            <div className="flex items-center justify-between text-sm font-bold pt-2"
              style={{ borderTop: '2px solid var(--border-bright)', color: riskColor }}>
              <span>TOTAL</span>
              <span>{totalScore}</span>
            </div>
          </div>
        </div>

        {/* Factor chart */}
        <div className="card p-4 flex flex-col">
          <h3 className="text-xs font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>CONTRIBUTING FACTORS</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={factors} layout="vertical" barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d47" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#4a5568', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 30]} />
                <YAxis type="category" dataKey="label" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} width={130} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,130,246,0.05)' }} />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {factors.map((_, i) => <Cell key={i} fill={barColors[i % barColors.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Factor detail cards */}
          <div className="mt-3 space-y-2">
            {factors.map((f, i) => (
              <div key={i} className="flex items-start gap-2 text-xs p-2 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 font-bold text-xs"
                  style={{ background: `${barColors[i]}18`, color: barColors[i] }}>
                  {f.score}
                </div>
                <div>
                  <div className="font-medium text-white">{f.label}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 10 }}>{f.reason.slice(0, 80)}...</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2.5 text-xs p-3 rounded-lg"
        style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', color: 'var(--text-secondary)' }}>
        <Info size={13} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <span>
          <strong className="text-blue-400">Score Methodology:</strong> Risk score is computed using a weighted heuristic model based on
          transaction velocity, fund flow patterns, known address intelligence, and behavioral clustering. This score is generated by an
          analytical prototype and is <strong>not scientifically validated</strong>. It is intended to assist investigator triage only.
        </span>
      </div>
    </div>
  );
}
