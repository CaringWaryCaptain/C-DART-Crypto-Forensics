/**
 * C-DART Dual-Layer Case Database Service (Phase 2 — Step 3 + Physical File Engine)
 * ─────────────────────────────────────────────────────────────────────────────────
 * Dual-layer architecture:
 * 1. Physical JSON Database: Server-side persistent storage in `database/cases.json`,
 *    `database/notes.json`, and `database/audit_log.json`. Survives browser clears,
 *    git checkouts, and system restarts.
 * 2. High-speed local cache: Browser localStorage for instant UI response and zero-latency
 *    synchronous renders.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export interface StoredCase {
  id: string;             // Primary key (caseId)
  caseId: string;
  suspectWallet: string;
  network: string;
  investigatorName: string;
  incidentDate: string;
  reportedAmount: number;
  status: 'ACTIVE' | 'CLOSED' | 'PENDING_LEGAL';
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  riskScore: number;
  likelyVasp: string;
  txCount: number;
  walletsFound: number;
  createdAt: string;
  updatedAt: string;
  officerBadge: string;
  officerState: string;
  datasetNote?: string;
}

export interface CaseNote {
  id: string;
  caseId: string;
  content: string;
  author: string;
  timestamp: string;
  type: 'OBSERVATION' | 'LEGAL' | 'EVIDENCE' | 'ACTION';
}

export interface AuditEntry {
  id: string;
  caseId: string;
  action: string;
  officer: string;
  timestamp: string;
}

// ── Storage Keys ──────────────────────────────────────────────────────────────

const KEYS = {
  CASES:     'cdart_cases_v2',
  NOTES:     'cdart_notes_v2',
  AUDIT_LOG: 'cdart_audit_log_v2',
} as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    console.warn('[C-DART DB] localStorage write failed.');
  }
}

function uuid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// ── Background Server Sync Helpers ────────────────────────────────────────────

async function syncToServer(endpoint: string, data: any): Promise<void> {
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch {
    // Non-blocking background sync
  }
}

/** Sync all physical JSON files from disk on application startup */
export async function initDatabaseSync(): Promise<void> {
  try {
    const casesRes = await fetch('/api/cases');
    if (casesRes.ok) {
      const diskCases: StoredCase[] = await casesRes.json();
      if (Array.isArray(diskCases) && diskCases.length > 0) {
        const localCases = read<StoredCase>(KEYS.CASES);
        // Merge: prefer disk cases, preserve any local uncommitted cases
        const merged = [...diskCases];
        for (const lc of localCases) {
          if (!merged.some(dc => dc.id === lc.id)) {
            merged.push(lc);
            // Push uncommitted case to disk
            syncToServer('/api/cases', lc);
          }
        }
        write(KEYS.CASES, merged);
      }
    }

    const notesRes = await fetch('/api/notes');
    if (notesRes.ok) {
      const diskNotes: CaseNote[] = await notesRes.json();
      if (Array.isArray(diskNotes) && diskNotes.length > 0) {
        write(KEYS.NOTES, diskNotes);
      }
    }

    const auditRes = await fetch('/api/audit');
    if (auditRes.ok) {
      const diskAudit: AuditEntry[] = await auditRes.json();
      if (Array.isArray(diskAudit) && diskAudit.length > 0) {
        write(KEYS.AUDIT_LOG, diskAudit);
      }
    }
  } catch {
    // Offline / standalone mode fallback to localStorage
  }
}

// Auto-trigger sync on module load
if (typeof window !== 'undefined') {
  initDatabaseSync();
}

// ── Case CRUD ─────────────────────────────────────────────────────────────────

/** Save or update a case. Persists both to physical disk file and browser storage. */
export function upsertCase(caseData: Omit<StoredCase, 'createdAt' | 'updatedAt'> & { createdAt?: string }): StoredCase {
  const cases = read<StoredCase>(KEYS.CASES);
  const now = new Date().toISOString();
  const existing = cases.findIndex(c => c.id === caseData.id || c.caseId === caseData.caseId);

  const record: StoredCase = {
    ...caseData,
    createdAt: caseData.createdAt ?? now,
    updatedAt: now,
  };

  if (existing >= 0) {
    cases[existing] = record;
  } else {
    cases.unshift(record); // newest first
  }

  write(KEYS.CASES, cases);
  // Asynchronously write to physical database/cases.json on disk
  syncToServer('/api/cases', record);

  addAuditEntry(caseData.id, existing >= 0 ? 'CASE_UPDATED' : 'CASE_CREATED', caseData.investigatorName);
  return record;
}

/** Get all cases, newest first. */
export function getAllCases(): StoredCase[] {
  return read<StoredCase>(KEYS.CASES);
}

/** Get a single case by ID. */
export function getCaseById(id: string): StoredCase | null {
  return read<StoredCase>(KEYS.CASES).find(c => c.id === id) ?? null;
}

/** Update case status. */
export function updateCaseStatus(id: string, status: StoredCase['status'], officer: string): void {
  const cases = read<StoredCase>(KEYS.CASES);
  const idx = cases.findIndex(c => c.id === id);
  if (idx >= 0) {
    cases[idx].status = status;
    cases[idx].updatedAt = new Date().toISOString();
    write(KEYS.CASES, cases);
    syncToServer('/api/cases', cases[idx]);
    addAuditEntry(id, `STATUS_CHANGED_TO_${status}`, officer);
  }
}

/** Delete a case and its notes. */
export function deleteCase(id: string, officer: string): void {
  const cases = read<StoredCase>(KEYS.CASES).filter(c => c.id !== id);
  write(KEYS.CASES, cases);
  const notes = read<CaseNote>(KEYS.NOTES).filter(n => n.caseId !== id);
  write(KEYS.NOTES, notes);
  addAuditEntry(id, 'CASE_DELETED', officer);
}

// ── Notes CRUD ────────────────────────────────────────────────────────────────

/** Add a note to a case. Persists to physical database/notes.json */
export function addNote(
  caseId: string,
  content: string,
  author: string,
  type: CaseNote['type'] = 'OBSERVATION',
): CaseNote {
  const notes = read<CaseNote>(KEYS.NOTES);
  const note: CaseNote = {
    id: uuid(),
    caseId,
    content,
    author,
    timestamp: new Date().toISOString(),
    type,
  };
  notes.unshift(note);
  write(KEYS.NOTES, notes);
  syncToServer('/api/notes', note);
  addAuditEntry(caseId, 'NOTE_ADDED', author);
  return note;
}

/** Get all notes for a case, newest first. */
export function getNotesByCaseId(caseId: string): CaseNote[] {
  return read<CaseNote>(KEYS.NOTES).filter(n => n.caseId === caseId);
}

// ── Audit Log ─────────────────────────────────────────────────────────────────

export function addAuditEntry(caseId: string, action: string, officer: string): void {
  const log = read<AuditEntry>(KEYS.AUDIT_LOG);
  const entry: AuditEntry = { id: uuid(), caseId, action, officer, timestamp: new Date().toISOString() };
  log.unshift(entry);
  write(KEYS.AUDIT_LOG, log.slice(0, 500));
  syncToServer('/api/audit', entry);
}

export function getAuditLog(): AuditEntry[] {
  return read<AuditEntry>(KEYS.AUDIT_LOG);
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export interface DbStats {
  totalCases: number;
  activeCases: number;
  closedCases: number;
  highRiskCases: number;
  totalNotes: number;
}

export function getDbStats(): DbStats {
  const cases = read<StoredCase>(KEYS.CASES);
  const notes  = read<CaseNote>(KEYS.NOTES);
  return {
    totalCases:    cases.length,
    activeCases:   cases.filter(c => c.status === 'ACTIVE').length,
    closedCases:   cases.filter(c => c.status === 'CLOSED').length,
    highRiskCases: cases.filter(c => c.riskLevel === 'HIGH').length,
    totalNotes:    notes.length,
  };
}

// ── Database Info ─────────────────────────────────────────────────────────────

export function getDbInfo(): { engine: string; location: string; size: string } {
  return {
    engine:   'Physical JSON File Engine (database/cases.json)',
    location: 'Disk Directory: ./database/ · Server Synced',
    size:     'Multi-file File System Store',
  };
}
