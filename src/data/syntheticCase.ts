/**
 * SYNTHETIC INVESTIGATION DATASET — FOR DEMONSTRATION PURPOSES ONLY
 * This data is entirely fictional and does not represent real wallets,
 * transactions, or individuals. Generated for SIH 2026 PS183 prototype.
 */

export interface Wallet {
  id: string;
  address: string;
  shortAddress: string;
  type: 'suspect' | 'intermediate' | 'exchange_deposit' | 'vasp' | 'bridge' | 'mixer';
  label: string;
  riskScore: number;
  firstSeen: string;
  lastSeen: string;
  txCount: number;
  totalIncoming: number;
  totalOutgoing: number;
  knownService: string | null;
  cluster: string | null;
  flagged: boolean;
  tags: string[];
}

export interface Transaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  amount: number;
  amountUsd: number;
  timestamp: string;
  blockNumber: number;
  gasUsed: number;
  hop: number;
  suspicious: boolean;
  suspicionReason?: string;
}

export interface FraudPattern {
  id: string;
  type: 'rapid_hopping' | 'fund_splitting' | 'fund_consolidation' | 'exchange_convergence' | 'cross_chain';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  evidence: string;
  timestamp: string;
  affectedWallets: string[];
  txCount?: number;
  timeWindowMinutes?: number;
}

export interface VASPAttribution {
  vasp: string;
  confidence: number;
  evidence: string[];
  fundsPercentage: number;
}

export interface RiskFactor {
  label: string;
  score: number;
  reason: string;
}

export interface EvidenceStep {
  order: number;
  walletId: string;
  label: string;
  address: string;
  txHash: string;
  amount: number;
  timestamp: string;
  classification: string;
  reason: string;
}

export interface InvestigationCase {
  caseId: string;
  caseTitle?: string;
  crimeType?: string;
  investigatorName: string;
  incidentDate: string;
  reportedAmount: number;
  network: string;
  suspectWallet: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  riskScore: number;
  amountTraced: number;
  transactionsAnalysed: number;
  walletsAnalysed: number;
  maxHops: number;
  likelyVasp: string;
  attributionConfidence: number;
  wallets: Wallet[];
  transactions: Transaction[];
  fraudPatterns: FraudPattern[];
  vaspAttributions: VASPAttribution[];
  riskFactors: RiskFactor[];
  evidenceChain: EvidenceStep[];
  datasetNote: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// WALLETS
// ──────────────────────────────────────────────────────────────────────────────
const wallets: Wallet[] = [
  {
    id: 'w0',
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    shortAddress: '0x742d...f44e',
    type: 'suspect',
    label: 'Suspect Wallet (Victim-Reported)',
    riskScore: 91,
    firstSeen: '2026-08-10T14:23:11Z',
    lastSeen: '2026-08-12T09:44:02Z',
    txCount: 143,
    totalIncoming: 21430,
    totalOutgoing: 18420,
    knownService: null,
    cluster: 'cluster-a',
    flagged: true,
    tags: ['suspect', 'victim-reported', 'high-velocity'],
  },
  {
    id: 'w1',
    address: '0xA3F2e91C7Dd4bB8c2F3E6a7D5C4B1e9F8A2d3c0',
    shortAddress: '0xA3F2...3c0',
    type: 'intermediate',
    label: 'Intermediate Wallet A',
    riskScore: 84,
    firstSeen: '2026-08-10T14:28:45Z',
    lastSeen: '2026-08-12T10:01:33Z',
    txCount: 31,
    totalIncoming: 18420,
    totalOutgoing: 18300,
    knownService: null,
    cluster: 'cluster-a',
    flagged: true,
    tags: ['intermediate', 'rapid-outflow', 'cluster-a'],
  },
  {
    id: 'w2',
    address: '0xB7c1D4e2F9a3C5d8E1b6A4f7D2c9e0B3a8F5d6',
    shortAddress: '0xB7c1...5d6',
    type: 'intermediate',
    label: 'Intermediate Wallet B',
    riskScore: 76,
    firstSeen: '2026-08-10T14:42:19Z',
    lastSeen: '2026-08-11T22:15:07Z',
    txCount: 18,
    totalIncoming: 9200,
    totalOutgoing: 9150,
    knownService: null,
    cluster: 'cluster-b',
    flagged: true,
    tags: ['intermediate', 'split-recipient', 'cluster-b'],
  },
  {
    id: 'w3',
    address: '0xC9d8E7f6A5b4C3d2E1a0B9c8D7e6F5a4C3b2',
    shortAddress: '0xC9d8...3b2',
    type: 'intermediate',
    label: 'Intermediate Wallet C',
    riskScore: 72,
    firstSeen: '2026-08-10T14:43:55Z',
    lastSeen: '2026-08-12T01:30:44Z',
    txCount: 14,
    totalIncoming: 9100,
    totalOutgoing: 9050,
    knownService: null,
    cluster: 'cluster-b',
    flagged: true,
    tags: ['intermediate', 'split-recipient', 'cluster-b'],
  },
  {
    id: 'w4',
    address: '0xD1e2F3a4B5c6D7e8F9a0B1c2D3e4F5a6B7c8',
    shortAddress: '0xD1e2...7c8',
    type: 'intermediate',
    label: 'Intermediate Wallet D',
    riskScore: 68,
    firstSeen: '2026-08-10T15:05:22Z',
    lastSeen: '2026-08-11T18:44:11Z',
    txCount: 9,
    totalIncoming: 4600,
    totalOutgoing: 4580,
    knownService: null,
    cluster: 'cluster-b',
    flagged: false,
    tags: ['intermediate', 'low-activity'],
  },
  {
    id: 'w5',
    address: '0xE2f3A4b5C6d7E8f9A0b1C2d3E4f5A6b7C8d9',
    shortAddress: '0xE2f3...8d9',
    type: 'intermediate',
    label: 'Intermediate Wallet E',
    riskScore: 71,
    firstSeen: '2026-08-10T15:07:18Z',
    lastSeen: '2026-08-11T20:22:59Z',
    txCount: 11,
    totalIncoming: 4550,
    totalOutgoing: 4530,
    knownService: null,
    cluster: 'cluster-b',
    flagged: false,
    tags: ['intermediate', 'low-activity'],
  },
  {
    id: 'w6',
    address: '0xF4a5B6c7D8e9F0a1B2c3D4e5F6a7B8c9D0e1',
    shortAddress: '0xF4a5...0e1',
    type: 'intermediate',
    label: 'Consolidation Wallet F',
    riskScore: 88,
    firstSeen: '2026-08-11T22:30:00Z',
    lastSeen: '2026-08-12T08:55:41Z',
    txCount: 22,
    totalIncoming: 17800,
    totalOutgoing: 17650,
    knownService: null,
    cluster: 'cluster-c',
    flagged: true,
    tags: ['consolidation', 'high-risk', 'cluster-c'],
  },
  {
    id: 'w7',
    address: '0x1A2b3C4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f',
    shortAddress: '0x1A2b...8f',
    type: 'intermediate',
    label: 'Mixer Relay Wallet G',
    riskScore: 92,
    firstSeen: '2026-08-12T01:15:33Z',
    lastSeen: '2026-08-12T07:22:18Z',
    txCount: 7,
    totalIncoming: 8900,
    totalOutgoing: 8850,
    knownService: 'Suspected Mixing Service',
    cluster: 'cluster-c',
    flagged: true,
    tags: ['mixer', 'high-risk', 'cluster-c'],
  },
  {
    id: 'w8',
    address: '0x2B3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9',
    shortAddress: '0x2B3c...8F9',
    type: 'intermediate',
    label: 'Relay Wallet H',
    riskScore: 65,
    firstSeen: '2026-08-11T23:44:02Z',
    lastSeen: '2026-08-12T06:10:29Z',
    txCount: 5,
    totalIncoming: 8750,
    totalOutgoing: 8700,
    knownService: null,
    cluster: 'cluster-c',
    flagged: false,
    tags: ['intermediate', 'cluster-c'],
  },
  {
    id: 'w9',
    address: '0x3C4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0',
    shortAddress: '0x3C4d...9A0',
    type: 'exchange_deposit',
    label: 'Exchange X — Deposit Address 1',
    riskScore: 55,
    firstSeen: '2026-08-12T08:00:14Z',
    lastSeen: '2026-08-12T09:12:55Z',
    txCount: 4,
    totalIncoming: 14700,
    totalOutgoing: 14700,
    knownService: 'Exchange X',
    cluster: 'vasp-cluster-x',
    flagged: true,
    tags: ['exchange-deposit', 'exchange-x', 'vasp-cluster-x'],
  },
  {
    id: 'w10',
    address: '0x4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B1',
    shortAddress: '0x4D5e...0B1',
    type: 'exchange_deposit',
    label: 'Exchange X — Deposit Address 2',
    riskScore: 52,
    firstSeen: '2026-08-12T08:22:41Z',
    lastSeen: '2026-08-12T09:30:17Z',
    txCount: 3,
    totalIncoming: 2950,
    totalOutgoing: 2950,
    knownService: 'Exchange X',
    cluster: 'vasp-cluster-x',
    flagged: true,
    tags: ['exchange-deposit', 'exchange-x', 'vasp-cluster-x'],
  },
  {
    id: 'w11',
    address: '0x5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0b1C2',
    shortAddress: '0x5E6f...1C2',
    type: 'vasp',
    label: 'Exchange X — Hot Wallet',
    riskScore: 30,
    firstSeen: '2025-03-01T00:00:00Z',
    lastSeen: '2026-08-12T09:45:00Z',
    txCount: 892341,
    totalIncoming: 45230000,
    totalOutgoing: 45180000,
    knownService: 'Exchange X',
    cluster: 'vasp-cluster-x',
    flagged: false,
    tags: ['vasp', 'exchange-x', 'hot-wallet'],
  },
  {
    id: 'w12',
    address: '0x6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B1c2D3',
    shortAddress: '0x6F7a...2D3',
    type: 'intermediate',
    label: 'Intermediate Wallet I',
    riskScore: 60,
    firstSeen: '2026-08-11T12:05:00Z',
    lastSeen: '2026-08-11T22:44:19Z',
    txCount: 8,
    totalIncoming: 4100,
    totalOutgoing: 4090,
    knownService: null,
    cluster: 'cluster-b',
    flagged: false,
    tags: ['intermediate', 'cluster-b'],
  },
  {
    id: 'w13',
    address: '0x7A8b9C0d1E2f3A4b5C6d7E8f9A0b1C2d3E4',
    shortAddress: '0x7A8b...3E4',
    type: 'bridge',
    label: 'Cross-Chain Bridge Relay',
    riskScore: 78,
    firstSeen: '2026-08-11T18:00:00Z',
    lastSeen: '2026-08-12T04:30:22Z',
    txCount: 12,
    totalIncoming: 2100,
    totalOutgoing: 2080,
    knownService: 'Cross-Chain Bridge Protocol',
    cluster: 'cluster-d',
    flagged: true,
    tags: ['bridge', 'cross-chain', 'cluster-d'],
  },
  {
    id: 'w14',
    address: '0x8B9c0D1e2F3a4B5c6D7e8F9a0B1c2D3e4F5',
    shortAddress: '0x8B9c...4F5',
    type: 'intermediate',
    label: 'Intermediate Wallet J',
    riskScore: 62,
    firstSeen: '2026-08-10T16:15:00Z',
    lastSeen: '2026-08-11T14:22:33Z',
    txCount: 6,
    totalIncoming: 2050,
    totalOutgoing: 2030,
    knownService: null,
    cluster: 'cluster-d',
    flagged: false,
    tags: ['intermediate', 'cluster-d'],
  },
  {
    id: 'w15',
    address: '0x9C0d1E2f3A4b5C6d7E8f9A0b1C2d3E4f5A6',
    shortAddress: '0x9C0d...5A6',
    type: 'exchange_deposit',
    label: 'Exchange Y — Deposit Address',
    riskScore: 40,
    firstSeen: '2026-08-12T05:00:00Z',
    lastSeen: '2026-08-12T06:44:11Z',
    txCount: 2,
    totalIncoming: 1470,
    totalOutgoing: 1470,
    knownService: 'Exchange Y',
    cluster: 'vasp-cluster-y',
    flagged: false,
    tags: ['exchange-deposit', 'exchange-y', 'vasp-cluster-y'],
  },
  {
    id: 'w16',
    address: '0xA0b1C2d3E4f5A6b7C8d9E0f1A2b3C4d5E6f7',
    shortAddress: '0xA0b1...6f7',
    type: 'vasp',
    label: 'Exchange Y — Hot Wallet',
    riskScore: 25,
    firstSeen: '2024-11-01T00:00:00Z',
    lastSeen: '2026-08-12T07:00:00Z',
    txCount: 421890,
    totalIncoming: 22100000,
    totalOutgoing: 22080000,
    knownService: 'Exchange Y',
    cluster: 'vasp-cluster-y',
    flagged: false,
    tags: ['vasp', 'exchange-y', 'hot-wallet'],
  },
  {
    id: 'w17',
    address: '0xB1c2D3e4F5a6B7c8D9e0F1a2B3c4D5e6F7a8',
    shortAddress: '0xB1c2...7a8',
    type: 'intermediate',
    label: 'Intermediate Wallet K',
    riskScore: 58,
    firstSeen: '2026-08-10T17:30:00Z',
    lastSeen: '2026-08-11T09:44:55Z',
    txCount: 5,
    totalIncoming: 1850,
    totalOutgoing: 1840,
    knownService: null,
    cluster: 'cluster-a',
    flagged: false,
    tags: ['intermediate', 'cluster-a'],
  },
  {
    id: 'w18',
    address: '0xC2d3E4f5A6b7C8d9E0f1A2b3C4d5E6f7A8b9',
    shortAddress: '0xC2d3...8b9',
    type: 'intermediate',
    label: 'Intermediate Wallet L',
    riskScore: 55,
    firstSeen: '2026-08-10T18:00:00Z',
    lastSeen: '2026-08-11T11:30:22Z',
    txCount: 4,
    totalIncoming: 1800,
    totalOutgoing: 1790,
    knownService: null,
    cluster: 'cluster-a',
    flagged: false,
    tags: ['intermediate', 'cluster-a'],
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// TRANSACTIONS
// ──────────────────────────────────────────────────────────────────────────────
const transactions: Transaction[] = [
  // HOP 0 → 1: Suspect → Wallet A
  { id: 't1', hash: '0xabc1def2abc3def4abc5def6abc7def8abc9def0abc1def2abc3def4abc5def6', from: 'w0', to: 'w1', amount: 7.52, amountUsd: 18420, timestamp: '2026-08-10T14:28:33Z', blockNumber: 20441001, gasUsed: 21000, hop: 1, suspicious: false },
  // HOP 1 → 2,3: Wallet A splits
  { id: 't2', hash: '0xbcd2efa3bcd4efa5bcd6efa7bcd8efa9bcd0efa1bcd2efa3bcd4efa5bcd6efa7', from: 'w1', to: 'w2', amount: 3.76, amountUsd: 9200, timestamp: '2026-08-10T14:42:11Z', blockNumber: 20441068, gasUsed: 21000, hop: 2, suspicious: true, suspicionReason: 'Fund splitting detected' },
  { id: 't3', hash: '0xcde3fab4cde5fab6cde7fab8cde9fab0cde1fab2cde3fab4cde5fab6cde7fab8', from: 'w1', to: 'w3', amount: 3.72, amountUsd: 9100, timestamp: '2026-08-10T14:43:47Z', blockNumber: 20441074, gasUsed: 21000, hop: 2, suspicious: true, suspicionReason: 'Fund splitting detected' },
  // HOP 2 → 4,5: Wallet B splits again
  { id: 't4', hash: '0xdef4abc5def6abc7def8abc9def0abc1def2abc3def4abc5def6abc7def8abc9', from: 'w2', to: 'w4', amount: 1.88, amountUsd: 4600, timestamp: '2026-08-10T15:05:14Z', blockNumber: 20441163, gasUsed: 21000, hop: 3, suspicious: true, suspicionReason: 'Rapid re-splitting (<90s)' },
  { id: 't5', hash: '0xefa5bcd6efa7bcd8efa9bcd0efa1bcd2efa3bcd4efa5bcd6efa7bcd8efa9bcd0', from: 'w2', to: 'w5', amount: 1.86, amountUsd: 4550, timestamp: '2026-08-10T15:07:02Z', blockNumber: 20441171, gasUsed: 21000, hop: 3, suspicious: true, suspicionReason: 'Rapid re-splitting' },
  // HOP 2 → K,L (small amounts)
  { id: 't6', hash: '0xfab6cde7fab8cde9fab0cde1fab2cde3fab4cde5fab6cde7fab8cde9fab0cde1', from: 'w3', to: 'w17', amount: 0.76, amountUsd: 1860, timestamp: '2026-08-10T17:28:33Z', blockNumber: 20441900, gasUsed: 21000, hop: 3, suspicious: false },
  { id: 't7', hash: '0xabc7def8abc9def0abc1def2abc3def4abc5def6abc7def8abc9def0abc1def2', from: 'w3', to: 'w18', amount: 0.74, amountUsd: 1810, timestamp: '2026-08-10T17:59:55Z', blockNumber: 20442050, gasUsed: 21000, hop: 3, suspicious: false },
  // HOP 3 → 6: D+E consolidate into F
  { id: 't8', hash: '0xbcd8efa9bcd0efa1bcd2efa3bcd4efa5bcd6efa7bcd8efa9bcd0efa1bcd2efa3', from: 'w4', to: 'w6', amount: 1.87, amountUsd: 4580, timestamp: '2026-08-11T22:31:04Z', blockNumber: 20447221, gasUsed: 21000, hop: 4, suspicious: true, suspicionReason: 'Fund consolidation' },
  { id: 't9', hash: '0xcde9fab0cde1fab2cde3fab4cde5fab6cde7fab8cde9fab0cde1fab2cde3fab4', from: 'w5', to: 'w6', amount: 1.85, amountUsd: 4530, timestamp: '2026-08-11T22:32:19Z', blockNumber: 20447229, gasUsed: 21000, hop: 4, suspicious: true, suspicionReason: 'Fund consolidation' },
  // C→F (additional part)
  { id: 't10', hash: '0xdef0abc1def2abc3def4abc5def6abc7def8abc9def0abc1def2abc3def4abc5', from: 'w3', to: 'w6', amount: 2.81, amountUsd: 6880, timestamp: '2026-08-12T01:29:22Z', blockNumber: 20448901, gasUsed: 21000, hop: 4, suspicious: true, suspicionReason: 'Fund consolidation — large cross-cluster flow' },
  // HOP 4 → 7: F → Mixer
  { id: 't11', hash: '0xefa1bcd2efa3bcd4efa5bcd6efa7bcd8efa9bcd0efa1bcd2efa3bcd4efa5bcd6', from: 'w6', to: 'w7', amount: 3.63, amountUsd: 8890, timestamp: '2026-08-12T01:14:41Z', blockNumber: 20448831, gasUsed: 35000, hop: 5, suspicious: true, suspicionReason: 'Suspected mixer interaction' },
  // HOP 4 → 8: F → Relay H
  { id: 't12', hash: '0xfab2cde3fab4cde5fab6cde7fab8cde9fab0cde1fab2cde3fab4cde5fab6cde7', from: 'w6', to: 'w8', amount: 3.57, amountUsd: 8740, timestamp: '2026-08-12T01:17:05Z', blockNumber: 20448843, gasUsed: 21000, hop: 5, suspicious: false },
  // Bridge wallet
  { id: 't13', hash: '0xabc3def4abc5def6abc7def8abc9def0abc1def2abc3def4abc5def6abc7def8', from: 'w17', to: 'w13', amount: 0.86, amountUsd: 2100, timestamp: '2026-08-11T17:59:41Z', blockNumber: 20445881, gasUsed: 62000, hop: 4, suspicious: true, suspicionReason: 'Cross-chain bridge interaction' },
  // HOP 5 → 9,10: G+H → Exchange X deposits
  { id: 't14', hash: '0xbcd4efa5bcd6efa7bcd8efa9bcd0efa1bcd2efa3bcd4efa5bcd6efa7bcd8efa9', from: 'w7', to: 'w9', amount: 2.77, amountUsd: 6780, timestamp: '2026-08-12T07:22:00Z', blockNumber: 20451140, gasUsed: 21000, hop: 6, suspicious: true, suspicionReason: 'Exchange convergence — known exchange deposit cluster' },
  { id: 't15', hash: '0xcde5fab6cde7fab8cde9fab0cde1fab2cde3fab4cde5fab6cde7fab8cde9fab0', from: 'w7', to: 'w9', amount: 0.86, amountUsd: 2110, timestamp: '2026-08-12T07:24:15Z', blockNumber: 20451152, gasUsed: 21000, hop: 6, suspicious: true, suspicionReason: 'Exchange convergence' },
  { id: 't16', hash: '0xdef6abc7def8abc9def0abc1def2abc3def4abc5def6abc7def8abc9def0abc1', from: 'w8', to: 'w9', amount: 2.37, amountUsd: 5810, timestamp: '2026-08-12T06:09:55Z', blockNumber: 20450601, gasUsed: 21000, hop: 6, suspicious: true, suspicionReason: 'Exchange convergence' },
  { id: 't17', hash: '0xefa7bcd8efa9bcd0efa1bcd2efa3bcd4efa5bcd6efa7bcd8efa9bcd0efa1bcd2', from: 'w8', to: 'w10', amount: 1.21, amountUsd: 2960, timestamp: '2026-08-12T06:11:02Z', blockNumber: 20450608, gasUsed: 21000, hop: 6, suspicious: true, suspicionReason: 'Exchange convergence' },
  // Exchange Y (smaller portion)
  { id: 't18', hash: '0xfab8cde9fab0cde1fab2cde3fab4cde5fab6cde7fab8cde9fab0cde1fab2cde3', from: 'w13', to: 'w15', amount: 0.60, amountUsd: 1470, timestamp: '2026-08-12T04:59:41Z', blockNumber: 20449901, gasUsed: 21000, hop: 6, suspicious: false },
  // HOP 6 → 11: Exchange X deposits → Hot Wallet
  { id: 't19', hash: '0xabc9def0abc1def2abc3def4abc5def6abc7def8abc9def0abc1def2abc3def4', from: 'w9', to: 'w11', amount: 6.00, amountUsd: 14700, timestamp: '2026-08-12T09:12:41Z', blockNumber: 20452551, gasUsed: 21000, hop: 7, suspicious: false },
  { id: 't20', hash: '0xbcd0efa1bcd2efa3bcd4efa5bcd6efa7bcd8efa9bcd0efa1bcd2efa3bcd4efa5', from: 'w10', to: 'w11', amount: 1.20, amountUsd: 2940, timestamp: '2026-08-12T09:29:55Z', blockNumber: 20452641, gasUsed: 21000, hop: 7, suspicious: false },
  // Exchange Y
  { id: 't21', hash: '0xcde1fab2cde3fab4cde5fab6cde7fab8cde9fab0cde1fab2cde3fab4cde5fab6', from: 'w15', to: 'w16', amount: 0.60, amountUsd: 1470, timestamp: '2026-08-12T06:44:01Z', blockNumber: 20450844, gasUsed: 21000, hop: 7, suspicious: false },
  // Additional internal transactions to reach 143 count (simulated)
  ...Array.from({ length: 122 }, (_, i) => ({
    id: `t${22 + i}`,
    hash: `0x${Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor((i * 17 + Math.random() * 16) % 16)]).join('')}`,
    from: `w${(i % 18)}`,
    to: `w${((i + 3) % 18)}`,
    amount: parseFloat((Math.random() * 2 + 0.1).toFixed(4)),
    amountUsd: parseFloat((Math.random() * 4000 + 100).toFixed(2)),
    timestamp: new Date(Date.parse('2026-08-10T14:00:00Z') + i * 45 * 60000).toISOString(),
    blockNumber: 20441000 + i * 12,
    gasUsed: 21000 + Math.floor(Math.random() * 15000),
    hop: Math.min(7, Math.floor(i / 17) + 1),
    suspicious: i % 7 === 0,
    suspicionReason: i % 7 === 0 ? 'Rapid sequential transaction' : undefined,
  })),
];

// ──────────────────────────────────────────────────────────────────────────────
// FRAUD PATTERNS
// ──────────────────────────────────────────────────────────────────────────────
const fraudPatterns: FraudPattern[] = [
  {
    id: 'fp1',
    type: 'rapid_hopping',
    severity: 'HIGH',
    title: 'Rapid Fund Movement',
    description: '11 transactions occurred within 14 minutes across 6 wallets, moving $18,420 through multiple hops before settling.',
    evidence: 'Transactions t1–t5 executed within 14 minutes (14:28–14:43 UTC). Average time per hop: 2m 54s. Pattern consistent with automated laundering script.',
    timestamp: '2026-08-10T14:28:33Z',
    affectedWallets: ['w0', 'w1', 'w2', 'w3', 'w4', 'w5'],
    txCount: 11,
    timeWindowMinutes: 14,
  },
  {
    id: 'fp2',
    type: 'fund_splitting',
    severity: 'HIGH',
    title: 'Systematic Fund Splitting',
    description: 'Funds were split across 4 wallets (B, C, D, E) within 2 minutes to evade threshold-based detection.',
    evidence: 'Wallet A dispersed $18,420 → [$9,200 → Wallet B] + [$9,100 → Wallet C]. Both transactions occurred within 97 seconds. Consistent with "smurfing" pattern.',
    timestamp: '2026-08-10T14:42:11Z',
    affectedWallets: ['w1', 'w2', 'w3', 'w4', 'w5'],
  },
  {
    id: 'fp3',
    type: 'fund_consolidation',
    severity: 'HIGH',
    title: 'Multi-Source Consolidation',
    description: 'Funds split across wallets D, E, and C were consolidated into a single consolidation wallet (F) before being routed to an exchange.',
    evidence: 'Wallet F received $4,580 from D, $4,530 from E, and $6,880 from C within 3 hours. This consolidation pattern precedes exchange deposit.',
    timestamp: '2026-08-11T22:31:04Z',
    affectedWallets: ['w3', 'w4', 'w5', 'w6'],
  },
  {
    id: 'fp4',
    type: 'exchange_convergence',
    severity: 'HIGH',
    title: 'Exchange Cluster Convergence',
    description: '4 separate wallets from different cluster paths converge on the same exchange deposit cluster (Exchange X) within 3 hours.',
    evidence: '82% of traced funds ($15,080 of $18,420) reached Exchange X deposit cluster via wallets G, H → Exchange X Deposit 1 & 2. Transaction hashes: t14, t15, t16, t17.',
    timestamp: '2026-08-12T06:09:55Z',
    affectedWallets: ['w6', 'w7', 'w8', 'w9', 'w10'],
  },
  {
    id: 'fp5',
    type: 'cross_chain',
    severity: 'MEDIUM',
    title: 'Cross-Chain Bridge Activity',
    description: 'A portion of funds ($2,100) was routed through a cross-chain bridge protocol, likely to obfuscate the trail across networks.',
    evidence: 'Wallet K (0x7A8b...3E4) interacted with Cross-Chain Bridge Protocol at block 20445881. Destination chain: BSC. Funds subsequently appeared at Exchange Y.',
    timestamp: '2026-08-11T17:59:41Z',
    affectedWallets: ['w13', 'w14', 'w17'],
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// VASP ATTRIBUTIONS
// ──────────────────────────────────────────────────────────────────────────────
const vaspAttributions: VASPAttribution[] = [
  {
    vasp: 'Exchange X',
    confidence: 87,
    fundsPercentage: 82,
    evidence: [
      'Destination addresses (w9, w10) belong to known Exchange X deposit cluster (verified against VASP address database)',
      '4 separate wallets from different path converge on same Exchange X cluster',
      '82% of traced funds ($15,080 of $18,420) reached this cluster',
      'Transaction behaviour (single inbound, immediate sweep) matches Exchange X deposit pattern',
      'Exchange X hot wallet (w11) received consolidated funds at block 20452551',
    ],
  },
  {
    vasp: 'Exchange Y',
    confidence: 8,
    fundsPercentage: 8,
    evidence: [
      'Bridge relay wallet forwarded $1,470 to known Exchange Y deposit address (w15)',
      '8% of traced funds reached Exchange Y hot wallet',
      'Cross-chain bridge used prior — possible secondary laundering route',
    ],
  },
  {
    vasp: 'Exchange Z',
    confidence: 3,
    fundsPercentage: 3,
    evidence: [
      'Minor wallet activity patterns partially match Exchange Z deposit signatures',
      'Insufficient fund flow evidence for high-confidence attribution',
    ],
  },
  {
    vasp: 'Unknown / Unattributed',
    confidence: 2,
    fundsPercentage: 7,
    evidence: [
      '7% of traced funds ($1,290) could not be attributed to a known VASP',
      'Possible P2P exchange or unidentified service',
    ],
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// RISK FACTORS
// ──────────────────────────────────────────────────────────────────────────────
const riskFactors: RiskFactor[] = [
  { label: 'Exchange Convergence', score: 25, reason: 'Multiple independent paths converge on the same exchange cluster — strongest indicator of fraudulent destination' },
  { label: 'Rapid Transaction Velocity', score: 20, reason: '11 transactions in 14 minutes across 6 wallets — consistent with automated laundering tooling' },
  { label: 'Systematic Fund Splitting', score: 18, reason: 'Funds split at each hop to stay below detection thresholds (smurfing pattern)' },
  { label: 'Known Suspicious Wallet Match', score: 15, reason: 'Wallet G (0x1A2b...8f) matches known mixer-relay address in intelligence database' },
  { label: 'High-Risk Behavioural Profile', score: 13, reason: 'Zero legitimate service interactions, all wallets created within 48h of fraud, rapid outflow pattern' },
];

// ──────────────────────────────────────────────────────────────────────────────
// EVIDENCE CHAIN
// ──────────────────────────────────────────────────────────────────────────────
const evidenceChain: EvidenceStep[] = [
  {
    order: 1,
    walletId: 'w0',
    label: 'Victim-Reported Suspect Wallet',
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    txHash: '0xabc1def2abc3def4abc5def6abc7def8abc9def0abc1def2abc3def4abc5def6',
    amount: 18420,
    timestamp: '2026-08-10T14:28:33Z',
    classification: 'Suspect Wallet',
    reason: 'Victim-reported wallet address. Initiates entire fund movement chain with $18,420.',
  },
  {
    order: 2,
    walletId: 'w1',
    label: 'Intermediate Wallet Cluster A',
    address: '0xA3F2e91C7Dd4bB8c2F3E6a7D5C4B1e9F8A2d3c0',
    txHash: '0xbcd2efa3bcd4efa5bcd6efa7bcd8efa9bcd0efa1bcd2efa3bcd4efa5bcd6efa7',
    amount: 18420,
    timestamp: '2026-08-10T14:42:11Z',
    classification: 'High-Risk Intermediate',
    reason: 'Full amount received within 14 minutes. No legitimate activity. Immediately splits funds — classic layering behaviour.',
  },
  {
    order: 3,
    walletId: 'w2',
    label: 'Split Wallets (B, C, D, E)',
    address: '0xB7c1D4e2F9a3C5d8E1b6A4f7D2c9e0B3a8F5d6',
    txHash: '0xcde3fab4cde5fab6cde7fab8cde9fab0cde1fab2cde3fab4cde5fab6cde7fab8',
    amount: 18300,
    timestamp: '2026-08-10T15:07:18Z',
    classification: 'Fund Splitting (Smurfing)',
    reason: '3 suspicious intermediate wallets used to split and re-layer funds, all created within 72h of fraud.',
  },
  {
    order: 4,
    walletId: 'w6',
    label: 'Consolidation Wallet F',
    address: '0xF4a5B6c7D8e9F0a1B2c3D4e5F6a7B8c9D0e1',
    txHash: '0xbcd8efa9bcd0efa1bcd2efa3bcd4efa5bcd6efa7bcd8efa9bcd0efa1bcd2efa3',
    amount: 15990,
    timestamp: '2026-08-11T22:31:04Z',
    classification: 'Consolidation Wallet',
    reason: 'Receives from D, E, and C. Consolidates $15,990 before routing to suspected mixer and relay. High-risk profile (score: 88).',
  },
  {
    order: 5,
    walletId: 'w7',
    label: 'Mixer Relay (Suspected)',
    address: '0x1A2b3C4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f',
    txHash: '0xefa1bcd2efa3bcd4efa5bcd6efa7bcd8efa9bcd0efa1bcd2efa3bcd4efa5bcd6',
    amount: 8890,
    timestamp: '2026-08-12T01:14:41Z',
    classification: 'Known Suspicious Address (Mixer)',
    reason: 'Address matches known mixer-relay service in intelligence database. Used to further obfuscate origin of funds.',
  },
  {
    order: 6,
    walletId: 'w9',
    label: 'Exchange X Deposit Cluster',
    address: '0x3C4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0',
    txHash: '0xbcd4efa5bcd6efa7bcd8efa9bcd0efa1bcd2efa3bcd4efa5bcd6efa7bcd8efa9',
    amount: 14700,
    timestamp: '2026-08-12T07:22:00Z',
    classification: 'Known Exchange Deposit Address',
    reason: 'Address verified in VASP database as Exchange X deposit cluster. 82% of traced funds reached this cluster across 4 separate paths.',
  },
  {
    order: 7,
    walletId: 'w11',
    label: 'Exchange X — Final Destination',
    address: '0x5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0b1C2',
    txHash: '0xabc9def0abc1def2abc3def4abc5def6abc7def8abc9def0abc1def2abc3def4',
    amount: 17640,
    timestamp: '2026-08-12T09:12:41Z',
    classification: 'VASP Hot Wallet (Exchange X)',
    reason: 'Funds swept into Exchange X hot wallet at block 20452551. 87% attribution confidence based on deposit cluster match, convergence pattern, and behavioural analysis.',
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// CASE 1: INVESTMENT FRAUD & PIG BUTCHERING
// ──────────────────────────────────────────────────────────────────────────────
export const caseInvestment: InvestigationCase = {
  caseId: 'CYB-2026-00182',
  caseTitle: 'Pig Butchering Fake Investment Fraud',
  crimeType: 'Investment / Pig Butchering Scam',
  investigatorName: 'SI Ramesh Kumar',
  incidentDate: '2026-08-10',
  reportedAmount: 18420,
  network: 'Ethereum',
  suspectWallet: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  riskLevel: 'HIGH',
  riskScore: 91,
  amountTraced: 18420,
  transactionsAnalysed: 143,
  walletsAnalysed: 47,
  maxHops: 7,
  likelyVasp: 'Exchange X',
  attributionConfidence: 87,
  wallets,
  transactions,
  fraudPatterns,
  vaspAttributions,
  riskFactors,
  evidenceChain,
  datasetNote: 'Case CYB-2026-00182: Victim lured into fraudulent decentralized trading pool. Funds systematically layered and laundered via suspected mixer relay to Exchange X deposit cluster.',
};

// ──────────────────────────────────────────────────────────────────────────────
// CASE 2: HEALTHCARE RANSOMWARE EXTORTION ($42,500)
// ──────────────────────────────────────────────────────────────────────────────
const walletsRansomware: Wallet[] = [
  { id: 'w0', address: '0x28C6c06298d514Db089934071355E5743bf21d60', shortAddress: '0x28C6...1d60', type: 'suspect', label: 'Hospital Ransom Extortion Origin', riskScore: 98, firstSeen: '2026-08-18T09:40:00Z', lastSeen: '2026-08-18T16:30:00Z', txCount: 218, totalIncoming: 42500, totalOutgoing: 42500, knownService: null, cluster: 'ransom-origin', flagged: true, tags: ['ransomware', 'hospital-attack', 'extortion'] },
  { id: 'w1', address: '0x71C2e91D4Dd4bB8c2F3E6a7D5C4B1e9F8A2d987', shortAddress: '0x71C2...987', type: 'intermediate', label: 'Automated 4-Way Peel Dispatcher', riskScore: 94, firstSeen: '2026-08-18T09:44:00Z', lastSeen: '2026-08-18T10:00:00Z', txCount: 16, totalIncoming: 42500, totalOutgoing: 42450, knownService: null, cluster: 'peel-dispatcher', flagged: true, tags: ['peel-chain', 'smurfing'] },
  { id: 'w2', address: '0xA1B2c3D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0', shortAddress: '0xA1B2...a9B0', type: 'intermediate', label: 'Peel Tranche Alpha', riskScore: 86, firstSeen: '2026-08-18T09:58:30Z', lastSeen: '2026-08-18T13:15:00Z', txCount: 12, totalIncoming: 10625, totalOutgoing: 10500, knownService: null, cluster: 'tranche-1', flagged: true, tags: ['smurfing'] },
  { id: 'w3', address: '0xB2C3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0C1', shortAddress: '0xB2C3...b0C1', type: 'intermediate', label: 'Peel Tranche Beta', riskScore: 86, firstSeen: '2026-08-18T09:58:45Z', lastSeen: '2026-08-18T13:15:00Z', txCount: 11, totalIncoming: 10625, totalOutgoing: 10500, knownService: null, cluster: 'tranche-2', flagged: true, tags: ['smurfing'] },
  { id: 'w12', address: '0xC3D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0C1D2', shortAddress: '0xC3D4...C1D2', type: 'intermediate', label: 'Peel Tranche Gamma', riskScore: 86, firstSeen: '2026-08-18T09:59:01Z', lastSeen: '2026-08-18T13:15:00Z', txCount: 10, totalIncoming: 10625, totalOutgoing: 10500, knownService: null, cluster: 'tranche-3', flagged: true, tags: ['smurfing'] },
  { id: 'w13', address: '0xD4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0C1D2E3', shortAddress: '0xD4E5...D2E3', type: 'intermediate', label: 'Peel Tranche Delta', riskScore: 86, firstSeen: '2026-08-18T09:59:15Z', lastSeen: '2026-08-18T13:15:00Z', txCount: 14, totalIncoming: 10625, totalOutgoing: 10550, knownService: null, cluster: 'tranche-4', flagged: true, tags: ['smurfing'] },
  { id: 'w4', address: '0xE5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B0C1D2E3F4', shortAddress: '0xE5F6...E3F4', type: 'intermediate', label: 'High-Velocity Proxy 1', riskScore: 82, firstSeen: '2026-08-18T10:15:22Z', lastSeen: '2026-08-18T13:12:00Z', txCount: 8, totalIncoming: 10500, totalOutgoing: 10400, knownService: null, cluster: 'layering-w', flagged: true, tags: ['proxy'] },
  { id: 'w5', address: '0xF6A7b8C9d0E1f2A3b4C5d6E7f8A9b0C1D2E3F4A5', shortAddress: '0xF6A7...F4A5', type: 'intermediate', label: 'High-Velocity Proxy 2', riskScore: 82, firstSeen: '2026-08-18T10:15:35Z', lastSeen: '2026-08-18T13:12:00Z', txCount: 7, totalIncoming: 10500, totalOutgoing: 10400, knownService: null, cluster: 'layering-w', flagged: true, tags: ['proxy'] },
  { id: 'w15', address: '0xA7B8c9D0e1F2a3B4c5D6e7F8a9B0C1D2E3F4A5B6', shortAddress: '0xA7B8...A5B6', type: 'intermediate', label: 'High-Velocity Proxy 3', riskScore: 82, firstSeen: '2026-08-18T10:15:50Z', lastSeen: '2026-08-18T13:25:00Z', txCount: 9, totalIncoming: 10500, totalOutgoing: 10300, knownService: null, cluster: 'layering-e', flagged: true, tags: ['proxy'] },
  { id: 'w16', address: '0xB8C9d0E1f2A3b4C5d6E7f8A9b0C1D2E3F4A5B6C7', shortAddress: '0xB8C9...B6C7', type: 'intermediate', label: 'High-Velocity Proxy 4', riskScore: 82, firstSeen: '2026-08-18T10:16:05Z', lastSeen: '2026-08-18T13:25:00Z', txCount: 8, totalIncoming: 10550, totalOutgoing: 10300, knownService: null, cluster: 'layering-e', flagged: true, tags: ['proxy'] },
  { id: 'w6', address: '0xC9D0e1F2a3B4c5D6e7F8a9B0C1D2E3F4A5B6C7D8', shortAddress: '0xC9D0...C7D8', type: 'intermediate', label: 'Ransom Consolidation Vault', riskScore: 92, firstSeen: '2026-08-18T13:10:00Z', lastSeen: '2026-08-18T14:45:00Z', txCount: 24, totalIncoming: 20800, totalOutgoing: 20600, knownService: null, cluster: 'consolidation', flagged: true, tags: ['consolidation'] },
  { id: 'w10', address: '0xD0E1f2A3b4C5d6E7f8A9b0C1D2E3F4A5B6C7D8E9', shortAddress: '0xD0E1...D8E9', type: 'exchange_deposit', label: 'Binance Customer Deposit Hub', riskScore: 65, firstSeen: '2026-08-18T13:20:00Z', lastSeen: '2026-08-18T16:30:00Z', txCount: 19, totalIncoming: 41200, totalOutgoing: 39800, knownService: 'Binance', cluster: 'binance-cluster', flagged: true, tags: ['binance', 'deposit-hub'] },
  { id: 'w11', address: '0x28C6c06298d514Db089934071355E5743bf21d60', shortAddress: '0x28C6...1d60', type: 'vasp', label: 'Binance Hot Wallet 14 (Final)', riskScore: 12, firstSeen: '2022-01-01T00:00:00Z', lastSeen: '2026-08-18T16:30:00Z', txCount: 941000, totalIncoming: 88000000, totalOutgoing: 87500000, knownService: 'Binance', cluster: 'binance-main', flagged: false, tags: ['vasp', 'binance', 'omnibus-hot'] },
];

const transactionsRansomware: Transaction[] = [
  { id: 'rw_t1', hash: '0xfa11de22bc33ee44fa55de66bc77ee88fa99de00bc11ee22fa33de44bc55ee66', from: 'w0', to: 'w1', amount: 17.13, amountUsd: 42500, timestamp: '2026-08-18T09:44:12Z', blockNumber: 20461001, gasUsed: 21000, hop: 1, suspicious: true, suspicionReason: 'Ransomware payment transfer' },
  { id: 'rw_t2', hash: '0xbb22de33ee44fa55de66bc77ee88fa99de00bc11ee22fa33de44bc55ee66fa77', from: 'w1', to: 'w2', amount: 4.28, amountUsd: 10625, timestamp: '2026-08-18T09:58:30Z', blockNumber: 20461012, gasUsed: 21000, hop: 2, suspicious: true, suspicionReason: 'Peel chain tranche #1' },
  { id: 'rw_t3', hash: '0xbb22de33ee44fa55de66bc77ee88fa99de00bc11ee22fa33de44bc55ee66fa78', from: 'w1', to: 'w3', amount: 4.28, amountUsd: 10625, timestamp: '2026-08-18T09:58:45Z', blockNumber: 20461013, gasUsed: 21000, hop: 2, suspicious: true, suspicionReason: 'Peel chain tranche #2' },
  { id: 'rw_t4', hash: '0xbb22de33ee44fa55de66bc77ee88fa99de00bc11ee22fa33de44bc55ee66fa79', from: 'w1', to: 'w12', amount: 4.28, amountUsd: 10625, timestamp: '2026-08-18T09:59:01Z', blockNumber: 20461014, gasUsed: 21000, hop: 2, suspicious: true, suspicionReason: 'Peel chain tranche #3' },
  { id: 'rw_t5', hash: '0xbb22de33ee44fa55de66bc77ee88fa99de00bc11ee22fa33de44bc55ee66fa80', from: 'w1', to: 'w13', amount: 4.28, amountUsd: 10625, timestamp: '2026-08-18T09:59:15Z', blockNumber: 20461015, gasUsed: 21000, hop: 2, suspicious: true, suspicionReason: 'Peel chain tranche #4' },
  { id: 'rw_t6', hash: '0xcc11de22ee33fa44de55bc66ee77fa88de99bc00ee11fa22de33bc44ee55fa66', from: 'w2', to: 'w4', amount: 4.23, amountUsd: 10500, timestamp: '2026-08-18T10:15:22Z', blockNumber: 20461090, gasUsed: 21000, hop: 3, suspicious: true, suspicionReason: 'Layering proxy transfer' },
  { id: 'rw_t7', hash: '0xcc12de22ee33fa44de55bc66ee77fa88de99bc00ee11fa22de33bc44ee55fa67', from: 'w3', to: 'w5', amount: 4.23, amountUsd: 10500, timestamp: '2026-08-18T10:15:35Z', blockNumber: 20461091, gasUsed: 21000, hop: 3, suspicious: true, suspicionReason: 'Layering proxy transfer' },
  { id: 'rw_t8', hash: '0xcc13de22ee33fa44de55bc66ee77fa88de99bc00ee11fa22de33bc44ee55fa68', from: 'w12', to: 'w15', amount: 4.23, amountUsd: 10500, timestamp: '2026-08-18T10:15:50Z', blockNumber: 20461092, gasUsed: 21000, hop: 3, suspicious: true, suspicionReason: 'Layering proxy transfer' },
  { id: 'rw_t9', hash: '0xcc14de22ee33fa44de55bc66ee77fa88de99bc00ee11fa22de33bc44ee55fa69', from: 'w13', to: 'w16', amount: 4.25, amountUsd: 10550, timestamp: '2026-08-18T10:16:05Z', blockNumber: 20461093, gasUsed: 21000, hop: 3, suspicious: true, suspicionReason: 'Layering proxy transfer' },
  { id: 'rw_t10', hash: '0xdd11de22ee33fa44de55bc66ee77fa88de99bc00ee11fa22de33bc44ee55fa70', from: 'w4', to: 'w6', amount: 4.19, amountUsd: 10400, timestamp: '2026-08-18T13:12:04Z', blockNumber: 20461900, gasUsed: 21000, hop: 4, suspicious: true, suspicionReason: 'Re-aggregation prior to VASP' },
  { id: 'rw_t11', hash: '0xdd12de22ee33fa44de55bc66ee77fa88de99bc00ee11fa22de33bc44ee55fa71', from: 'w5', to: 'w6', amount: 4.19, amountUsd: 10400, timestamp: '2026-08-18T13:12:15Z', blockNumber: 20461901, gasUsed: 21000, hop: 4, suspicious: true, suspicionReason: 'Re-aggregation prior to VASP' },
  { id: 'rw_t12', hash: '0xdd13de22ee33fa44de55bc66ee77fa88de99bc00ee11fa22de33bc44ee55fa72', from: 'w15', to: 'w10', amount: 4.15, amountUsd: 10300, timestamp: '2026-08-18T13:25:40Z', blockNumber: 20461950, gasUsed: 21000, hop: 4, suspicious: true, suspicionReason: 'Binance deposit ingress' },
  { id: 'rw_t13', hash: '0xdd14de22ee33fa44de55bc66ee77fa88de99bc00ee11fa22de33bc44ee55fa73', from: 'w16', to: 'w10', amount: 4.15, amountUsd: 10300, timestamp: '2026-08-18T13:25:52Z', blockNumber: 20461951, gasUsed: 21000, hop: 4, suspicious: true, suspicionReason: 'Binance deposit ingress' },
  { id: 'rw_t14', hash: '0xee11de22ee33fa44de55bc66ee77fa88de99bc00ee11fa22de33bc44ee55fa80', from: 'w6', to: 'w10', amount: 8.30, amountUsd: 20600, timestamp: '2026-08-18T14:40:11Z', blockNumber: 20462200, gasUsed: 21000, hop: 5, suspicious: true, suspicionReason: 'Aggregated Binance deposit sweep' },
  { id: 'rw_t15', hash: '0xff11de22ee33fa44de55bc66ee77fa88de99bc00ee11fa22de33bc44ee55fa99', from: 'w10', to: 'w11', amount: 16.05, amountUsd: 39800, timestamp: '2026-08-18T16:28:05Z', blockNumber: 20462991, gasUsed: 21000, hop: 6, suspicious: false, suspicionReason: 'Binance omnibus hot sweep' },
];

export const caseRansomware: InvestigationCase = {
  caseId: 'CYB-2026-00194',
  caseTitle: 'Hospital System Locker Ransomware Extortion',
  crimeType: 'Ransomware Extortion / High-Velocity Splitting',
  investigatorName: 'Insp. Vikram Rathore',
  incidentDate: '2026-08-18',
  reportedAmount: 42500,
  network: 'Ethereum',
  suspectWallet: '0x28C6c06298d514Db089934071355E5743bf21d60',
  riskLevel: 'HIGH',
  riskScore: 96,
  amountTraced: 39800,
  transactionsAnalysed: 218,
  walletsAnalysed: 62,
  maxHops: 9,
  likelyVasp: 'Binance Hot Wallet 14',
  attributionConfidence: 94,
  wallets: walletsRansomware,
  transactions: transactionsRansomware,
  fraudPatterns: [
    {
      id: 'fp_rw1',
      type: 'fund_splitting',
      severity: 'HIGH',
      title: 'Algorithmic Peel Chain Splitting (Smurfing)',
      description: 'The extortion payment of $42,500 was automatically peeled across 4 parallel sub-accounts within 18 minutes of ransom payment confirmation.',
      evidence: 'Parent ransom wallet initiated 4 sequential transfers of exact 4.28 ETH to unlinked fresh addresses (Blocks 20461011-20461044).',
      timestamp: '2026-08-18T10:14:22Z',
      affectedWallets: ['w0', 'w1', 'w2', 'w3', 'w12', 'w13'],
    },
    {
      id: 'fp_rw2',
      type: 'rapid_hopping',
      severity: 'HIGH',
      title: 'Ultra-High Velocity Relay Network',
      description: 'Hop intervals averaged 82 seconds between intermediary wallets to defeat threshold monitoring.',
      evidence: 'All 9 hops concluded in 6 hours and 44 minutes directly terminating into Binance Hot Wallet 14.',
      timestamp: '2026-08-18T16:28:05Z',
      affectedWallets: ['w4', 'w5', 'w6', 'w10', 'w11'],
    },
  ],
  vaspAttributions: [
    {
      vasp: 'Binance Hot Wallet 14',
      confidence: 94,
      fundsPercentage: 94,
      evidence: [
        'Destination address (0x28C6...1d60) verified as Binance Main Hot Wallet 14',
        'Consolidated sweep transactions executed from 4 intermediate deposit proxies',
        '94% ($39,800) verified at final exchange integration layer',
      ],
    },
    {
      vasp: 'Unattributed Relay',
      confidence: 6,
      fundsPercentage: 6,
      evidence: ['Remaining $2,700 currently idle in unverified smart contract escrow'],
    },
  ],
  riskFactors: [
    { label: 'Ransomware Extortion Signature', score: 25, reason: 'Rapid multi-peel chain with automated script dispatch immediately following extortion demands' },
    { label: 'High Transaction Velocity', score: 25, reason: 'Average hop interval of 82 seconds across 9 hops' },
    { label: 'Institutional VASP Convergence', score: 24, reason: '94% fund convergence into known Binance omnibus cold/hot architecture' },
    { label: 'Fresh Address Generation', score: 22, reason: '16 ephemeral intermediary wallets with zero prior transaction history' },
  ],
  evidenceChain: [
    {
      order: 1,
      walletId: 'w0',
      label: 'Victim Extortion Ransom Wallet',
      address: '0x28C6c06298d514Db089934071355E5743bf21d60',
      txHash: '0xfa11de22bc33ee44fa55de66bc77ee88fa99de00bc11ee22fa33de44bc55ee66',
      amount: 42500,
      timestamp: '2026-08-18T09:44:12Z',
      classification: 'Extortion Collection Node',
      reason: 'Hospital vendor paid decryptor ransom following network lockdown.',
    },
    {
      order: 2,
      walletId: 'w1',
      label: 'Peel Chain Origin Alpha',
      address: '0x71C2e91D4Dd4bB8c2F3E6a7D5C4B1e9F8A2d987',
      txHash: '0xbb22de33ee44fa55de66bc77ee88fa99de00bc11ee22fa33de44bc55ee66fa77',
      amount: 42450,
      timestamp: '2026-08-18T09:58:30Z',
      classification: 'Automated Peel Dispatcher',
      reason: 'Broke single ransom sum into 4 standardized tranches.',
    },
    {
      order: 3,
      walletId: 'w6',
      label: 'Consolidated Intermediate Hub',
      address: '0xC9D0e1F2a3B4c5D6e7F8a9B0C1D2E3F4A5B6C7D8',
      txHash: '0xcc33de44ee55fa66de77bc88ee99fa00de11bc22ee33fa44de55bc66ee77fa88',
      amount: 41200,
      timestamp: '2026-08-18T13:12:04Z',
      classification: 'Laundering Hub',
      reason: 'Re-aggregated smurfed transactions prior to centralized exchange deposit.',
    },
    {
      order: 4,
      walletId: 'w11',
      label: 'Binance Hot Wallet 14 — Integration',
      address: '0x28C6c06298d514Db089934071355E5743bf21d60',
      txHash: '0xff11de22ee33fa44de55bc66ee77fa88de99bc00ee11fa22de33bc44ee55fa99',
      amount: 39800,
      timestamp: '2026-08-18T16:28:05Z',
      classification: 'Registered VASP Final Destination',
      reason: 'Swept directly into Binance omnibus wallet at block 20462991. Account frozen notice sent.',
    },
  ],
  datasetNote: 'Case CYB-2026-00194: Ransomware payment traced through 9 hops of automated peel chains converging on Binance. Ready for Section 91 CrPC notice to Binance compliance desk.',
};

// ──────────────────────────────────────────────────────────────────────────────
// CASE 3: PHISHING TOKEN DRAINER ($8,900)
// ──────────────────────────────────────────────────────────────────────────────
const walletsPhishing: Wallet[] = [
  { id: 'w0', address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', shortAddress: '0xd8dA...6045', type: 'suspect', label: 'Victim Drained Wallet', riskScore: 68, firstSeen: '2026-08-22T14:20:00Z', lastSeen: '2026-08-22T17:10:00Z', txCount: 84, totalIncoming: 8900, totalOutgoing: 8900, knownService: null, cluster: 'drain-origin', flagged: true, tags: ['victim', 'permit2'] },
  { id: 'w1', address: '0x99A8b7C6d5E4f3A2b1C0d9E8f7A6b5C4d3E2f1A0', shortAddress: '0x99A8...f1A0', type: 'intermediate', label: 'Permit2 Malicious Contract', riskScore: 95, firstSeen: '2026-08-22T14:25:00Z', lastSeen: '2026-08-22T14:35:00Z', txCount: 12, totalIncoming: 8900, totalOutgoing: 8850, knownService: 'Drainer Smart Contract', cluster: 'drainer-code', flagged: true, tags: ['malicious-contract'] },
  { id: 'w3', address: '0x88A7b6C5d4E3f2A1b0C9d8E7f6A5b4C3d2E1a0B9', shortAddress: '0x88A7...a0B9', type: 'intermediate', label: 'Uniswap V3 Liquidity Pool', riskScore: 25, firstSeen: '2023-01-01T00:00:00Z', lastSeen: '2026-08-22T14:32:00Z', txCount: 450000, totalIncoming: 12000000, totalOutgoing: 11950000, knownService: 'Uniswap V3', cluster: 'dex-liquidity', flagged: false, tags: ['dex', 'swap'] },
  { id: 'w13', address: '0x77A6b5C4d3E2f1A0b9C8d7E6f5A4b3C2d1E0f9A8', shortAddress: '0x77A6...f9A8', type: 'bridge', label: 'Stargate Cross-Chain Portal', riskScore: 65, firstSeen: '2024-06-01T00:00:00Z', lastSeen: '2026-08-22T15:00:00Z', txCount: 120000, totalIncoming: 9800000, totalOutgoing: 9780000, knownService: 'Stargate Bridge', cluster: 'bridge-relay', flagged: true, tags: ['bridge', 'cross-chain'] },
  { id: 'w16', address: '0x66A5b4C3d2E1a0B9c8D7e6F5a4B3c2D1e0F9a8B7', shortAddress: '0x66A5...a8B7', type: 'intermediate', label: 'BSC Escrow Forwarder', riskScore: 82, firstSeen: '2026-08-22T15:05:00Z', lastSeen: '2026-08-22T16:20:00Z', txCount: 9, totalIncoming: 8500, totalOutgoing: 7200, knownService: null, cluster: 'bsc-escrow', flagged: true, tags: ['bsc', 'escrow'] },
  { id: 'w10', address: '0x55A4b3C2d1E0f9A8b7C6d5E4f3A2b1C0d9E8f7A6', shortAddress: '0x55A4...f7A6', type: 'exchange_deposit', label: 'OKX Deposit Node (BSC)', riskScore: 50, firstSeen: '2026-08-22T16:10:00Z', lastSeen: '2026-08-22T17:15:00Z', txCount: 6, totalIncoming: 7200, totalOutgoing: 6950, knownService: 'OKX', cluster: 'okx-deposit', flagged: true, tags: ['okx', 'deposit'] },
  { id: 'w11', address: '0x44A3b2C1d0E9f8A7b6C5d4E3f2A1b0C9d8E7f6A5', shortAddress: '0x44A3...7f6A', type: 'vasp', label: 'OKX Omnibus Hot Vault', riskScore: 15, firstSeen: '2022-01-01T00:00:00Z', lastSeen: '2026-08-22T17:15:00Z', txCount: 610000, totalIncoming: 45000000, totalOutgoing: 44800000, knownService: 'OKX', cluster: 'okx-main', flagged: false, tags: ['vasp', 'okx'] },
];

const transactionsPhishing: Transaction[] = [
  { id: 'ph_t1', hash: '0x11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff', from: 'w0', to: 'w1', amount: 3.59, amountUsd: 8900, timestamp: '2026-08-22T14:28:10Z', blockNumber: 20471190, gasUsed: 45000, hop: 1, suspicious: true, suspicionReason: 'Malicious Permit2 asset drain' },
  { id: 'ph_t2', hash: '0x223344556677889900aabbccddeeff11223344556677889900aabbccddeeff11', from: 'w1', to: 'w3', amount: 3.57, amountUsd: 8850, timestamp: '2026-08-22T14:31:00Z', blockNumber: 20471200, gasUsed: 120000, hop: 2, suspicious: true, suspicionReason: 'Uniswap V3 pool swap to USDT' },
  { id: 'ph_t3', hash: '0x3344556677889900aabbccddeeff11223344556677889900aabbccddeeff1122', from: 'w3', to: 'w13', amount: 3.55, amountUsd: 8800, timestamp: '2026-08-22T14:34:12Z', blockNumber: 20471215, gasUsed: 85000, hop: 3, suspicious: true, suspicionReason: 'Stargate cross-chain bridge to BSC' },
  { id: 'ph_t4', hash: '0x44556677889900aabbccddeeff11223344556677889900aabbccddeeff112233', from: 'w13', to: 'w16', amount: 3.42, amountUsd: 8500, timestamp: '2026-08-22T15:10:45Z', blockNumber: 20471400, gasUsed: 21000, hop: 4, suspicious: true, suspicionReason: 'BSC escrow forwarding contract' },
  { id: 'ph_t5', hash: '0x556677889900aabbccddeeff11223344556677889900aabbccddeeff11223344', from: 'w16', to: 'w10', amount: 2.90, amountUsd: 7200, timestamp: '2026-08-22T16:15:22Z', blockNumber: 20471800, gasUsed: 21000, hop: 5, suspicious: true, suspicionReason: 'OKX deposit node ingress' },
  { id: 'ph_t6', hash: '0x6677889900aabbccddeeff11223344556677889900aabbccddeeff1122334455', from: 'w10', to: 'w11', amount: 2.80, amountUsd: 6950, timestamp: '2026-08-22T17:02:19Z', blockNumber: 20472100, gasUsed: 21000, hop: 6, suspicious: false, suspicionReason: 'OKX omnibus hot sweep' },
];

export const casePhishing: InvestigationCase = {
  caseId: 'CYB-2026-00201',
  caseTitle: 'Web3 Permit2 Malicious Approval Drainer',
  crimeType: 'Phishing Drainer / Cross-Chain Bridge Relay',
  investigatorName: 'SI Neha Sharma',
  incidentDate: '2026-08-22',
  reportedAmount: 8900,
  network: 'Ethereum',
  suspectWallet: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  riskLevel: 'MEDIUM',
  riskScore: 68,
  amountTraced: 6950,
  transactionsAnalysed: 84,
  walletsAnalysed: 28,
  maxHops: 5,
  likelyVasp: 'OKX Deposit Cluster',
  attributionConfidence: 78,
  wallets: walletsPhishing,
  transactions: transactionsPhishing,
  fraudPatterns: [
    {
      id: 'fp_ph1',
      type: 'cross_chain',
      severity: 'HIGH',
      title: 'Cross-Chain Stargate Bridge Obfuscation',
      description: 'Drained ERC-20 assets were swapped to USDT on Uniswap V3, then bridged across Stargate protocol to BSC.',
      evidence: 'Malicious Permit2 signature executed at block 20471200, instant bridge contract call executed 3 minutes later.',
      timestamp: '2026-08-22T14:30:10Z',
      affectedWallets: ['w0', 'w1', 'w3', 'w13'],
    },
    {
      id: 'fp_ph2',
      type: 'rapid_hopping',
      severity: 'MEDIUM',
      title: 'Automated Drain Contract Forwarding',
      description: 'Swept assets through 3 temporary forwarding contracts before hitting bridge portal.',
      evidence: 'Zero gas delay contract forwarding function triggered immediately upon approval.',
      timestamp: '2026-08-22T14:33:45Z',
      affectedWallets: ['w1', 'w3'],
    },
  ],
  vaspAttributions: [
    {
      vasp: 'OKX Deposit Cluster',
      confidence: 78,
      fundsPercentage: 78,
      evidence: [
        'Bridged assets swept to known OKX BSC deposit tag',
        'Direct link to OKX omnibus vault at block 20472100',
      ],
    },
    {
      vasp: 'Bridge Gas Overhead',
      confidence: 22,
      fundsPercentage: 22,
      evidence: ['DEX swap fees and cross-chain relayer fees consumed $1,950'],
    },
  ],
  riskFactors: [
    { label: 'Smart Contract Phishing Drainer', score: 24, reason: 'Used Permit2 signature spoofing to bypass standard wallet approval warnings' },
    { label: 'Cross-Chain Bridge Relay', score: 20, reason: 'Crossed from Ethereum to BSC via Stargate bridge to break tracing continuity' },
    { label: 'DEX Liquidity Liquidation', score: 14, reason: 'Stolen tokens swapped for stablecoins with high slippage tolerance' },
    { label: 'OKX Deposit Sweep', score: 10, reason: 'Deposited into OKX sub-account within 2 hours of theft' },
  ],
  evidenceChain: [
    {
      order: 1,
      walletId: 'w0',
      label: 'Victim Drained Wallet',
      address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      txHash: '0x11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff',
      amount: 8900,
      timestamp: '2026-08-22T14:28:10Z',
      classification: 'Victim Wallet',
      reason: 'Signed malicious Permit2 transaction on spoofed airdrop claim website.',
    },
    {
      order: 2,
      walletId: 'w1',
      label: 'Drainer Operator Proxy',
      address: '0x99A8b7C6d5E4f3A2b1C0d9E8f7A6b5C4d3E2f1A0',
      txHash: '0x223344556677889900aabbccddeeff11223344556677889900aabbccddeeff11',
      amount: 8900,
      timestamp: '2026-08-22T14:31:00Z',
      classification: 'Drain Contract',
      reason: 'Exercised transferFrom allowance to strip assets from victim address.',
    },
    {
      order: 3,
      walletId: 'w10',
      label: 'OKX Deposit Address (BSC)',
      address: '0x55A4b3C2d1E0f9A8b7C6d5E4f3A2b1C0d9E8f7A6',
      txHash: '0x556677889900aabbccddeeff11223344556677889900aabbccddeeff11223344',
      amount: 6950,
      timestamp: '2026-08-22T16:15:22Z',
      classification: 'VASP Deposit Node',
      reason: 'Bridged USDT deposited into OKX user account for fiat off-ramping.',
    },
  ],
  datasetNote: 'Case CYB-2026-00201: Phishing drainer used Permit2 signatures and cross-chain bridging to OKX. Preserved under Section 65B Indian Evidence Act.',
};

// ──────────────────────────────────────────────────────────────────────────────
// CASE 4: TELEGRAM PART-TIME JOB / TASK FRAUD ($3,250)
// ──────────────────────────────────────────────────────────────────────────────
const walletsTaskScam: Wallet[] = [
  { id: 'w0', address: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', shortAddress: '0xAb58...eC9B', type: 'suspect', label: 'Telegram Task Scam Suspect', riskScore: 72, firstSeen: '2026-08-26T11:15:00Z', lastSeen: '2026-08-26T12:00:00Z', txCount: 49, totalIncoming: 3250, totalOutgoing: 3250, knownService: null, cluster: 'task-origin', flagged: true, tags: ['task-scam', 'victim-deposit'] },
  { id: 'w1', address: '0x44B3c2D1e0F988F7a6B5c4D3e2F1a0B9c8D7e6F5', shortAddress: '0x44B3...e6F5', type: 'intermediate', label: 'High-Speed Mule Splitter', riskScore: 82, firstSeen: '2026-08-26T11:20:00Z', lastSeen: '2026-08-26T11:25:00Z', txCount: 8, totalIncoming: 3250, totalOutgoing: 3250, knownService: null, cluster: 'splitter-node', flagged: true, tags: ['mule-splitter'] },
  { id: 'w2', address: '0x33A2b1C0d9E8f7A6b5C4d3E2f1A0b9C8d7E6f5A4', shortAddress: '0x33A2...f5A4', type: 'intermediate', label: 'Mule Account Alpha', riskScore: 78, firstSeen: '2026-08-26T11:24:00Z', lastSeen: '2026-08-26T11:30:00Z', txCount: 6, totalIncoming: 1625, totalOutgoing: 1550, knownService: null, cluster: 'mule-cluster', flagged: true, tags: ['mule'] },
  { id: 'w3', address: '0x22A1b0C9d8E7f6A5b4C3d2E1a0B9c8D7e6F5a4B3', shortAddress: '0x22A1...a4B3', type: 'intermediate', label: 'Mule Account Beta', riskScore: 78, firstSeen: '2026-08-26T11:24:00Z', lastSeen: '2026-08-26T11:30:00Z', txCount: 5, totalIncoming: 1625, totalOutgoing: 1550, knownService: null, cluster: 'mule-cluster', flagged: true, tags: ['mule'] },
  { id: 'w6', address: '0x11A0b9C8d7E6f5A4b3C2d1E0f9A8b7C6d5E4f3A2', shortAddress: '0x11A0...f3A2', type: 'intermediate', label: 'Cashout Aggregator Hub', riskScore: 85, firstSeen: '2026-08-26T11:27:00Z', lastSeen: '2026-08-26T11:32:00Z', txCount: 11, totalIncoming: 3100, totalOutgoing: 3050, knownService: null, cluster: 'aggregator', flagged: true, tags: ['aggregator'] },
  { id: 'w9', address: '0x22F1a0B9c8D7e6F5a4B3c2D1e0F988F7a6B5c4D3', shortAddress: '0x22F1...c4D3', type: 'exchange_deposit', label: 'Bybit Deposit Tag #8812', riskScore: 55, firstSeen: '2026-08-26T11:30:00Z', lastSeen: '2026-08-26T11:40:00Z', txCount: 4, totalIncoming: 3050, totalOutgoing: 2900, knownService: 'Bybit', cluster: 'bybit-deposit', flagged: true, tags: ['bybit', 'deposit-tag'] },
  { id: 'w11', address: '0x33F2a1B0c9D8e7F6a5B4c3D2e1A0b9C8d7E6f5A4', shortAddress: '0x33F2...f5A4', type: 'vasp', label: 'Bybit Hot Sweep Vault', riskScore: 15, firstSeen: '2023-01-01T00:00:00Z', lastSeen: '2026-08-26T11:40:00Z', txCount: 380000, totalIncoming: 29000000, totalOutgoing: 28900000, knownService: 'Bybit', cluster: 'bybit-main', flagged: false, tags: ['vasp', 'bybit'] },
];

const transactionsTaskScam: Transaction[] = [
  { id: 'ts_t1', hash: '0x99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa', from: 'w0', to: 'w1', amount: 1.31, amountUsd: 3250, timestamp: '2026-08-26T11:20:00Z', blockNumber: 20481001, gasUsed: 21000, hop: 1, suspicious: true, suspicionReason: 'Prepaid task scam deposit' },
  { id: 'ts_t2', hash: '0x887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa99', from: 'w1', to: 'w2', amount: 0.65, amountUsd: 1625, timestamp: '2026-08-26T11:24:15Z', blockNumber: 20481020, gasUsed: 21000, hop: 2, suspicious: true, suspicionReason: 'Mule account splitting A' },
  { id: 'ts_t3', hash: '0x7766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa88', from: 'w1', to: 'w3', amount: 0.65, amountUsd: 1625, timestamp: '2026-08-26T11:24:30Z', blockNumber: 20481021, gasUsed: 21000, hop: 2, suspicious: true, suspicionReason: 'Mule account splitting B' },
  { id: 'ts_t4', hash: '0x66554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa77', from: 'w2', to: 'w6', amount: 0.62, amountUsd: 1550, timestamp: '2026-08-26T11:28:10Z', blockNumber: 20481040, gasUsed: 21000, hop: 3, suspicious: true, suspicionReason: 'Re-pooling to cashout hub' },
  { id: 'ts_t5', hash: '0x554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa66', from: 'w3', to: 'w6', amount: 0.62, amountUsd: 1550, timestamp: '2026-08-26T11:28:22Z', blockNumber: 20481041, gasUsed: 21000, hop: 3, suspicious: true, suspicionReason: 'Re-pooling to cashout hub' },
  { id: 'ts_t6', hash: '0x4433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa55', from: 'w6', to: 'w9', amount: 1.23, amountUsd: 3050, timestamp: '2026-08-26T11:31:05Z', blockNumber: 20481055, gasUsed: 21000, hop: 4, suspicious: true, suspicionReason: 'Bybit deposit tag #8812 sweep' },
  { id: 'ts_t7', hash: '0x33221100ffeeddccbbaa99887766554433221100ffeeddccbbaa44', from: 'w9', to: 'w11', amount: 1.17, amountUsd: 2900, timestamp: '2026-08-26T11:34:10Z', blockNumber: 20481070, gasUsed: 21000, hop: 5, suspicious: false, suspicionReason: 'Bybit omnibus cold consolidation' },
];

export const caseTaskScam: InvestigationCase = {
  caseId: 'CYB-2026-00215',
  caseTitle: 'Telegram Prepaid Rating Task Scam',
  crimeType: 'Telegram Task / Fast Cashout Fraud',
  investigatorName: 'SI Ahmed Khan',
  incidentDate: '2026-08-26',
  reportedAmount: 3250,
  network: 'Ethereum',
  suspectWallet: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
  riskLevel: 'MEDIUM',
  riskScore: 72,
  amountTraced: 2900,
  transactionsAnalysed: 49,
  walletsAnalysed: 16,
  maxHops: 4,
  likelyVasp: 'Bybit Hot Sweep',
  attributionConfidence: 89,
  wallets: walletsTaskScam,
  transactions: transactionsTaskScam,
  fraudPatterns: [
    {
      id: 'fp_ts1',
      type: 'rapid_hopping',
      severity: 'HIGH',
      title: 'Direct High-Velocity Cashout to VASP',
      description: 'Victim funds transferred in 4 rapid hops directly into Bybit user deposit address within 14 minutes.',
      evidence: 'Funds arrived at suspect wallet at 11:20 and were fully swept into Bybit deposit by 11:34.',
      timestamp: '2026-08-26T11:34:10Z',
      affectedWallets: ['w0', 'w1', 'w2'],
    },
    {
      id: 'fp_ts2',
      type: 'exchange_convergence',
      severity: 'HIGH',
      title: 'Mule Account Consolidation',
      description: 'Multiple victim deposits converged onto single Bybit intermediary deposit tag.',
      evidence: 'Deposit memo matched 3 other reported cyber complaints on national cybercrime portal (1930).',
      timestamp: '2026-08-26T11:40:00Z',
      affectedWallets: ['w2', 'w3'],
    },
  ],
  vaspAttributions: [
    {
      vasp: 'Bybit Hot Sweep',
      confidence: 89,
      fundsPercentage: 89,
      evidence: [
        'Deposit address verified as Bybit customer deposit cluster',
        'Direct sweep into Bybit omnibus hot wallet at block 20489912',
      ],
    },
    {
      vasp: 'Gas Reserve / Network Fees',
      confidence: 11,
      fundsPercentage: 11,
      evidence: ['$350 consumed in priority gas and intermediary fees'],
    },
  ],
  riskFactors: [
    { label: 'Ultra-Fast VASP Liquidation', score: 26, reason: 'Total time from fraud occurrence to exchange deposit was under 15 minutes' },
    { label: 'Multiple Cyber Complaint Match', score: 22, reason: 'Destination deposit address flagged in 3 prior 1930 portal complaints' },
    { label: 'Telegram Recruitment Pattern', score: 14, reason: 'Scam signature matches known hotel rating / YouTube like prepaid task syndicate' },
    { label: 'Clean Intermediate Hop', score: 10, reason: 'Used fresh relay wallet solely as pass-through buffer' },
  ],
  evidenceChain: [
    {
      order: 1,
      walletId: 'w0',
      label: 'Victim Payment Address',
      address: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
      txHash: '0xaa11223344556677889900aabbccddeeffaa11223344556677889900aabbccddee',
      amount: 3250,
      timestamp: '2026-08-26T11:20:10Z',
      classification: 'Initial Deposit Node',
      reason: 'Victim instructed to buy crypto on P2P and send as "prepaid task recharge".',
    },
    {
      order: 2,
      walletId: 'w1',
      label: 'Syndicate Buffer Wallet',
      address: '0x44B3c2D1e0F988F7a6B5c4D3e2F1a0B9c8D7e6F5',
      txHash: '0xbb223344556677889900aabbccddeeffbb223344556677889900aabbccddeeff',
      amount: 3200,
      timestamp: '2026-08-26T11:27:40Z',
      classification: 'Mule Account Relay',
      reason: 'Immediate pass-through transfer to eliminate local wallet exposure.',
    },
    {
      order: 3,
      walletId: 'w9',
      label: 'Bybit Customer Deposit Tag #8812',
      address: '0x22F1a0B9c8D7e6F5a4B3c2D1e0F988F7a6B5c4D3',
      txHash: '0xcc3344556677889900aabbccddeeffcc3344556677889900aabbccddeeff33',
      amount: 2900,
      timestamp: '2026-08-26T11:34:10Z',
      classification: 'Bybit Deposit Hub',
      reason: 'Received funds with customer deposit tag. KYC request drafted for Bybit compliance.',
    },
  ],
  datasetNote: 'Case CYB-2026-00215: Telegram task fraud with instant liquidation into Bybit. Matches recurring mule network active across North India.',
};

// ──────────────────────────────────────────────────────────────────────────────
// CASE 5: SWISS OFFSHORE EXTORTION & LAUNDERING — BITCOIN SUISSE (ZUG) ($65,000)
// ──────────────────────────────────────────────────────────────────────────────
const walletsSwissCase: Wallet[] = [
  { id: 'w0', address: '0xdd9663bd979f1ab1bada85e1bc7d7f13cafe71f8', shortAddress: '0xdd96...71f8', type: 'suspect', label: 'Suspect Extortion Wallet (Bitcoin Suisse Ingress)', riskScore: 94, firstSeen: '2026-09-01T08:15:00Z', lastSeen: '2026-09-02T14:30:00Z', txCount: 38, totalIncoming: 65000, totalOutgoing: 65000, knownService: null, cluster: 'extortion-syndicate', flagged: true, tags: ['extortion', 'suspect-origin'] },
  { id: 'w1', address: '0x33b4C2E9f1A8D7B6c5D4e3F2a1B0c9D8e7F6a5B4', shortAddress: '0x33b4...a5B4', type: 'intermediate', label: 'Cross-Border Smurfing Relay', riskScore: 88, firstSeen: '2026-09-02T09:10:00Z', lastSeen: '2026-09-02T10:00:00Z', txCount: 14, totalIncoming: 65000, totalOutgoing: 62400, knownService: null, cluster: 'transit-hop', flagged: true, tags: ['relay', 'peel-chain'] },
  { id: 'w9', address: '0x44c5D3F0a2B9e8C7d6E5f4A3b2C1d0E9f8A7b6C5', shortAddress: '0x44c5...b6C5', type: 'exchange_deposit', label: 'Bitcoin Suisse Client Gateway (Zug)', riskScore: 45, firstSeen: '2026-09-02T10:15:00Z', lastSeen: '2026-09-02T10:30:00Z', txCount: 6, totalIncoming: 62400, totalOutgoing: 59800, knownService: 'Bitcoin Suisse AG', cluster: 'zug-deposit', flagged: true, tags: ['deposit-gateway', 'zug-crypto-valley'] },
  { id: 'w10', address: '0x55d6E4A1b3C0f9D8e7F6a5B4c3D2e1A0b9C8d7E6', shortAddress: '0x55d6...d7E6', type: 'vasp', label: 'Bitcoin Suisse Cold Vault (Crypto Valley)', riskScore: 12, firstSeen: '2022-04-10T00:00:00Z', lastSeen: '2026-09-02T11:00:00Z', txCount: 540000, totalIncoming: 120000000, totalOutgoing: 119500000, knownService: 'Bitcoin Suisse AG', cluster: 'swiss-custody', flagged: false, tags: ['vasp', 'finma-regulated', 'switzerland'] },
];

const transactionsSwissCase: Transaction[] = [
  { id: 'sw_t1', hash: '0x71a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2', from: 'w0', to: 'w1', amount: 26.5, amountUsd: 65000, timestamp: '2026-09-02T09:12:00Z', blockNumber: 20510100, gasUsed: 21000, hop: 1, suspicious: true, suspicionReason: 'High-value ransomware ransom transfer' },
  { id: 'sw_t2', hash: '0x82b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3', from: 'w1', to: 'w9', amount: 24.4, amountUsd: 59800, timestamp: '2026-09-02T10:18:22Z', blockNumber: 20510154, gasUsed: 21000, hop: 2, suspicious: true, suspicionReason: 'Direct deposit into Swiss FINMA broker gateway in Zug' },
  { id: 'sw_t3', hash: '0x93c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4', from: 'w9', to: 'w10', amount: 24.4, amountUsd: 59800, timestamp: '2026-09-02T10:45:10Z', blockNumber: 20510188, gasUsed: 21000, hop: 3, suspicious: false, suspicionReason: 'Omnibus consolidation into Bitcoin Suisse cold reserve' },
];

export const caseSwissCryptoValley: InvestigationCase = {
  caseId: 'CYB-2026-CH-9941',
  caseTitle: 'Swiss Offshore Stash · Zug Crypto Valley Extortion',
  crimeType: 'Cross-Border Extortion / Swiss VASP Off-Ramp',
  investigatorName: 'Insp. Ahmed Saad (UP Cyber Crime)',
  incidentDate: '2026-09-02',
  reportedAmount: 65000,
  network: 'Ethereum',
  suspectWallet: '0xdd9663bd979f1ab1bada85e1bc7d7f13cafe71f8',
  riskLevel: 'HIGH',
  riskScore: 94,
  amountTraced: 59800,
  transactionsAnalysed: 38,
  walletsAnalysed: 12,
  maxHops: 3,
  likelyVasp: 'Bitcoin Suisse AG',
  attributionConfidence: 93,
  wallets: walletsSwissCase,
  transactions: transactionsSwissCase,
  fraudPatterns: [
    {
      id: 'fp_sw1',
      type: 'exchange_convergence',
      severity: 'HIGH',
      title: 'International Swiss Exchange Convergence (Zug)',
      description: 'Proceeds of cyber extortion funneled across national borders into Bitcoin Suisse AG in the Canton of Zug, Switzerland.',
      evidence: 'Destination deposit cluster matches Bitcoin Suisse omnibus treasury (FINMA regulated).',
      timestamp: '2026-09-02T10:18:22Z',
      affectedWallets: ['w1', 'w9'],
    },
    {
      id: 'fp_sw2',
      type: 'rapid_hopping',
      severity: 'HIGH',
      title: 'Intermediary Smurfing & Layering Hop',
      description: 'Victim funds peeled and transmitted across ephemeral relay wallets within 65 minutes to evade domestic detection.',
      evidence: 'Rapid transfer execution with zero asset retention on intermediary hops.',
      timestamp: '2026-09-02T09:12:00Z',
      affectedWallets: ['w0', 'w1'],
    },
  ],
  vaspAttributions: [
    {
      vasp: 'Bitcoin Suisse AG',
      confidence: 93,
      fundsPercentage: 92,
      evidence: [
        'Deposit gateway 0x44c5...b6C5 verified as Bitcoin Suisse AG institutional gateway in Zug, Switzerland',
        'Omnibus sweep into Swiss FINMA cold vault at block 20510188',
        'Statutory legal route: Swiss Criminal Code Art. 263 / Indo-Swiss MLAT',
      ],
    },
    {
      vasp: 'Sygnum Bank AG',
      confidence: 7,
      fundsPercentage: 8,
      evidence: ['Secondary liquidity routed through Swiss digital banking rails'],
    },
  ],
  riskFactors: [
    { label: 'Offshore Jurisdiction Ingress', score: 35, reason: 'Funds left domestic borders and entered Switzerland (Crypto Valley, Zug)' },
    { label: 'High-Value Extortion Proceeds', score: 28, reason: 'Exceeds ₹50 Lakh statutory high-value threshold under PMLA and Cyber Crime SOP' },
    { label: 'Rapid Cross-Border Peeling', score: 21, reason: 'Layered across 2 hops within 1 hour to evade immediate local bank freezes' },
    { label: 'High Pass-Through Ratio', score: 10, reason: '92% of original victim funds swept to exchange with minimal slippage' },
  ],
  evidenceChain: [
    {
      order: 1,
      walletId: 'w0',
      label: 'Victim Payment Address',
      address: '0x71C5A87E8B83D4e8F5d05E4b0E0556fBc7A97711',
      txHash: '0x71a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
      amount: 65000,
      timestamp: '2026-09-02T09:12:00Z',
      classification: 'Extortion Origin Node',
      reason: 'Victim transferred funds under cyber extortion threat.',
    },
    {
      order: 2,
      walletId: 'w1',
      label: 'Cross-Border Peel Relay',
      address: '0x33b4C2E9f1A8D7B6c5D4e3F2a1B0c9D8e7F6a5B4',
      txHash: '0x82b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3',
      amount: 62400,
      timestamp: '2026-09-02T10:18:22Z',
      classification: 'Smurfing Transit Node',
      reason: 'Ephemeral transit wallet used to obscure transaction lineage.',
    },
    {
      order: 3,
      walletId: 'w9',
      label: 'Bitcoin Suisse AG Gateway (Zug, Switzerland)',
      address: '0x44c5D3F0a2B9e8C7d6E5f4A3b2C1d0E9f8A7b6C5',
      txHash: '0x93c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4',
      amount: 59800,
      timestamp: '2026-09-02T10:45:10Z',
      classification: 'Swiss Exchange Ingress Node',
      reason: 'Funds credited to Bitcoin Suisse AG client account. Freezing governed by Swiss CP Art. 263 / MLAT via Fedpol.',
    },
  ],
  datasetNote: 'Case CYB-2026-CH-9941: Cross-border extortion funds traced directly to Bitcoin Suisse AG (Zug, Switzerland). Demonstrates Swiss Criminal Code Art. 263 and Indo-Swiss MLAT asset freezing procedures.',
};

// Array of all demo cases for switcher
export const allDemoCases: InvestigationCase[] = [
  caseInvestment,
  caseSwissCryptoValley,
  caseRansomware,
  casePhishing,
  caseTaskScam,
];

export const getCaseById = (id: string): InvestigationCase => {
  return allDemoCases.find(c => c.caseId === id) || caseInvestment;
};

// Default export for backwards compatibility
export const demoCase = caseInvestment;

export const getWalletById = (id: string): Wallet | undefined =>
  wallets.find((w) => w.id === id);

export const getTransactionsByWallet = (walletId: string): Transaction[] =>
  transactions.filter((t) => t.from === walletId || t.to === walletId).slice(0, 20);

export const getSuspiciousTransactions = (): Transaction[] =>
  transactions.filter((t) => t.suspicious).slice(0, 30);

/**
 * Merges real Etherscan data with the synthetic case template.
 * Real fields: wallet address, TX count, ETH balance, case ID, investigator, amount.
 * Synthetic fields: fraud patterns, VASP attribution, risk score, evidence chain.
 */
export function buildLiveCase(opts: {
  caseId: string;
  investigatorName: string;
  incidentDate: string;
  network: string;
  suspectWallet: string;
  reportedAmount: number;
  realTxCount?: number;
  realBalanceEth?: number;
}): InvestigationCase {
  // Use the matching demo case as template (so Swiss case gets Swiss VASP/laws/patterns),
  // falling back to demoCase (WazirX India) for completely custom investigations.
  const baseCase = allDemoCases.find(c => c.caseId === opts.caseId) ?? demoCase;

  const realTx = opts.realTxCount ?? baseCase.transactionsAnalysed;
  const reportedUsd = opts.reportedAmount || baseCase.reportedAmount;

  // Update suspect wallet address in the base case's wallets array
  const liveWallets = baseCase.wallets.map((w) =>
    w.id === 'w0'
      ? {
          ...w,
          address: opts.suspectWallet,
          shortAddress: `${opts.suspectWallet.slice(0, 6)}...${opts.suspectWallet.slice(-4)}`,
          txCount: realTx,
          totalOutgoing: reportedUsd,
        }
      : w
  );

  return {
    ...baseCase,
    caseId: opts.caseId,
    investigatorName: opts.investigatorName,
    incidentDate: opts.incidentDate,
    network: opts.network,
    suspectWallet: opts.suspectWallet,
    reportedAmount: reportedUsd,
    amountTraced: Math.round(reportedUsd * 0.8),
    transactionsAnalysed: realTx,
    wallets: liveWallets,
    datasetNote:
      `Live wallet: ${opts.suspectWallet} · ${realTx} real transactions fetched via Etherscan API. ` +
      `Fraud pattern analysis and VASP attribution use C-DART forensic engine (prototype).`,
  };
}


