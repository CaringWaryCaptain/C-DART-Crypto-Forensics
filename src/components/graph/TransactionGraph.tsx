import { useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
} from 'reactflow';
import type { Node, Edge, NodeProps } from 'reactflow';
import 'reactflow/dist/style.css';
import { AlertTriangle, Building2, Wallet, Globe, Link } from 'lucide-react';
import type { InvestigationCase, Wallet as WalletType } from '../../data/syntheticCase';

interface Props {
  caseData: InvestigationCase;
  onWalletClick: (wallet: WalletType) => void;
}

// ── Custom Nodes ──────────────────────────────────────────────────────────────

const nodeStyles: Record<string, { bg: string; border: string; icon: React.ElementType; iconColor: string }> = {
  suspect: { bg: '#fef2f2', border: '#ef4444', icon: AlertTriangle, iconColor: '#ef4444' },
  intermediate: { bg: '#ffffff', border: '#cbd5e1', icon: Wallet, iconColor: '#64748b' },
  exchange_deposit: { bg: '#faf5ff', border: '#a855f7', icon: Building2, iconColor: '#a855f7' },
  vasp: { bg: '#f0fdf4', border: '#10b981', icon: Building2, iconColor: '#10b981' },
  bridge: { bg: '#fff7ed', border: '#f97316', icon: Globe, iconColor: '#f97316' },
  mixer: { bg: '#fefce8', border: '#eab308', icon: Link, iconColor: '#eab308' },
};

function WalletNode({ data }: NodeProps) {
  const style = nodeStyles[data.type] || nodeStyles.intermediate;
  const Icon = style.icon;

  return (
    <div
      className="rounded-lg px-3 py-2 cursor-pointer transition-all hover:shadow-md"
      style={{
        background: style.bg,
        border: `1.5px solid ${style.border}`,
        minWidth: 140,
        maxWidth: 170,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
      onClick={() => data.onWalletClick && data.onWalletClick(data.wallet)}
    >
      <Handle type="target" position={Position.Top} style={{ background: style.border, border: 'none', width: 7, height: 7 }} />

      <div className="flex items-center gap-2 mb-1">
        <Icon size={13} style={{ color: style.iconColor }} />
        {data.flagged && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse ml-auto" />}
      </div>

      <div className="text-xs font-bold text-slate-900 leading-tight mb-0.5 truncate" title={data.label}>
        {data.label}
      </div>
      <div className="font-mono text-[10px] text-slate-500">
        {data.shortAddress}
      </div>

      {data.riskScore > 0 && (
        <div className="mt-1.5 flex items-center gap-1.5">
          <div className="flex-1 h-1 rounded-full overflow-hidden bg-slate-100">
            <div
              className="h-full rounded-full"
              style={{
                width: `${data.riskScore}%`,
                background: data.riskScore >= 80 ? '#ef4444' : data.riskScore >= 60 ? '#f97316' : '#10b981',
              }}
            />
          </div>
          <span className="text-[10px] font-mono font-bold" style={{ color: data.riskScore >= 80 ? '#ef4444' : data.riskScore >= 60 ? '#f97316' : '#10b981' }}>
            {data.riskScore}
          </span>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} style={{ background: style.border, border: 'none', width: 7, height: 7 }} />
    </div>
  );
}

const nodeTypes = { walletNode: WalletNode };

// ── Layout positions ──────────────────────────────────────────────────────────
const positions: Record<string, { x: number; y: number }> = {
  w0: { x: 350, y: 0 },
  w1: { x: 350, y: 130 },
  w2: { x: 150, y: 280 },
  w3: { x: 550, y: 280 },
  w4: { x: 50, y: 440 },
  w5: { x: 250, y: 440 },
  w6: { x: 200, y: 600 },
  w7: { x: 100, y: 760 },
  w8: { x: 300, y: 760 },
  w9: { x: 200, y: 920 },
  w10: { x: 380, y: 920 },
  w11: { x: 280, y: 1070 },
  w12: { x: 450, y: 440 },
  w13: { x: 660, y: 440 },
  w14: { x: 750, y: 280 },
  w15: { x: 660, y: 600 },
  w16: { x: 660, y: 760 },
  w17: { x: 650, y: 130 },
  w18: { x: 800, y: 130 },
};

export default function TransactionGraph({ caseData, onWalletClick }: Props) {
  const [filterSuspicious, setFilterSuspicious] = useState(false);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);

  // Build nodes from current caseData
  const initialNodes: Node[] = caseData.wallets
    .filter(w => positions[w.id])
    .map(w => ({
      id: w.id,
      type: 'walletNode',
      position: positions[w.id] || { x: 300, y: 300 },
      data: {
        ...w,
        label: w.label,
        shortAddress: w.shortAddress,
        riskScore: w.riskScore,
        flagged: w.flagged,
        type: w.type,
        wallet: w,
        onWalletClick,
      },
    }));

  // Build edges from current caseData
  const coreTransactions = caseData.transactions.slice(0, 21);
  const initialEdges: Edge[] = coreTransactions
    .filter(t => positions[t.from] && positions[t.to])
    .filter(t => !filterSuspicious || t.suspicious)
    .map(t => ({
      id: t.id,
      source: t.from,
      target: t.to,
      animated: t.suspicious,
      label: `$${t.amountUsd.toLocaleString()}`,
      labelStyle: { fill: '#0f172a', fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: 600 },
      labelBgStyle: { fill: '#ffffff', fillOpacity: 0.95, stroke: '#cbd5e1', strokeWidth: 1 },
      markerEnd: { type: MarkerType.ArrowClosed, color: t.suspicious ? '#ef4444' : '#64748b' },
      style: {
        stroke: t.suspicious ? '#ef4444' : '#94a3b8',
        strokeWidth: t.suspicious ? 2 : 1.5,
        opacity: selectedPath.length > 0 ? (selectedPath.includes(t.from) ? 1 : 0.2) : 1,
      },
    }));

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const mainPath = ['w0', 'w1', 'w2', 'w4', 'w6', 'w7', 'w9', 'w11'];

  return (
    <div className="flex flex-col h-full" style={{ background: '#f8fafc' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2.5 flex-shrink-0 bg-white border-b border-slate-200">
        <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
          Transaction Flow Graph · {caseData.caseId}
        </span>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setFilterSuspicious(!filterSuspicious)}
            className="px-2.5 py-1 rounded text-xs font-semibold transition-all border"
            style={{
              background: filterSuspicious ? '#fef2f2' : '#ffffff',
              borderColor: filterSuspicious ? '#fecaca' : '#cbd5e1',
              color: filterSuspicious ? '#dc2626' : '#475569',
            }}
          >
            {filterSuspicious ? '🔴 Suspicious Only' : 'All Transactions'}
          </button>
          <button
            onClick={() => setSelectedPath(selectedPath.length ? [] : mainPath)}
            className="px-2.5 py-1 rounded text-xs font-semibold transition-all border"
            style={{
              background: selectedPath.length ? '#f0fdf4' : '#ffffff',
              borderColor: selectedPath.length ? '#bbf7d0' : '#cbd5e1',
              color: selectedPath.length ? '#16a34a' : '#475569',
            }}
          >
            {selectedPath.length ? '✓ Path Active' : 'Highlight Primary Trail'}
          </button>
        </div>
      </div>

      {/* ReactFlow Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.2}
          maxZoom={1.5}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#cbd5e1" />
          <Controls />
          <MiniMap
            nodeStrokeWidth={3}
            zoomable
            pannable
            nodeColor={(n: Node) => {
              const type = n.data?.type;
              if (type === 'suspect') return '#ef4444';
              if (type === 'vasp') return '#10b981';
              if (type === 'exchange_deposit') return '#a855f7';
              return '#cbd5e1';
            }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}
