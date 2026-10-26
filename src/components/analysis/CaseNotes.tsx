import { useState, useEffect } from 'react';
import { MessageSquare, Clock, Plus, Trash2, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import type { InvestigationCase } from '../../data/syntheticCase';

interface Props { caseData: InvestigationCase; }

interface Note {
  id: string;
  text: string;
  wallet?: string;
  createdAt: string;
  author: string;
  type: 'observation' | 'action' | 'intel';
}

interface TimelineEvent {
  time: string;
  label: string;
  detail: string;
  type: 'system' | 'alert' | 'action';
}

const STORAGE_KEY = (caseId: string) => `cdart_notes_${caseId}`;

const NOTE_TYPES = [
  { value: 'observation', label: 'OBSERVATION', color: 'var(--cyan)' },
  { value: 'action',      label: 'ACTION TAKEN', color: 'var(--green)' },
  { value: 'intel',       label: 'INTEL',        color: 'var(--orange)' },
] as const;

export default function CaseNotes({ caseData }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [text, setText] = useState('');
  const [wallet, setWallet] = useState('');
  const [noteType, setNoteType] = useState<Note['type']>('observation');
  const [tab, setTab] = useState<'notes' | 'timeline'>('timeline');

  const timelineEvents: TimelineEvent[] = [
    { time: '10:15:02', label: 'Investigation opened',         detail: `Case ${caseData.caseId} registered · Investigator: ${caseData.investigatorName}`, type: 'system' },
    { time: '10:15:33', label: 'Blockchain query initiated',   detail: `${caseData.transactionsAnalysed} transactions fetched across ${caseData.walletsAnalysed} wallets on ${caseData.network}`, type: 'system' },
    { time: '10:15:41', label: 'Transaction graph built',      detail: `${caseData.walletsAnalysed} nodes, ${caseData.transactions.length} active edges · ${caseData.maxHops}-hop trail identified`, type: 'system' },
    { time: '10:15:49', label: 'Fraud pattern analysis',       detail: `${caseData.fraudPatterns.length} patterns detected: ${caseData.fraudPatterns.map(p => p.title).slice(0, 3).join(', ')}`, type: 'alert' },
    { time: '10:15:52', label: 'VASP attribution completed',   detail: `${caseData.likelyVasp} identified at ${caseData.attributionConfidence}% confidence · $${caseData.amountTraced.toLocaleString()} traced`, type: 'system' },
    { time: '10:15:55', label: 'Risk score calculated',        detail: `Score: ${caseData.riskScore}/100 (${caseData.riskLevel}) · ${caseData.riskFactors.length} contributing factors`, type: 'alert' },
    { time: '10:16:01', label: 'Evidence chain generated',     detail: `${caseData.evidenceChain.length}-step blockchain trail with verifiable TX hashes`, type: 'system' },
    { time: '10:18:22', label: 'Section 91 CrPC notice ready', detail: `Formal requisition draft prepared for ${caseData.likelyVasp} compliance desk`, type: 'action' },
  ];

  /* Load from localStorage */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY(caseData.caseId));
      if (raw) setNotes(JSON.parse(raw));
    } catch {}
  }, [caseData.caseId]);

  const saveNotes = (updated: Note[]) => {
    setNotes(updated);
    localStorage.setItem(STORAGE_KEY(caseData.caseId), JSON.stringify(updated));
  };

  const addNote = () => {
    if (!text.trim()) return;
    const note: Note = {
      id: Date.now().toString(),
      text: text.trim(),
      wallet: wallet.trim() || undefined,
      createdAt: new Date().toISOString(),
      author: caseData.investigatorName,
      type: noteType,
    };
    saveNotes([note, ...notes]);
    setText('');
    setWallet('');
  };

  const deleteNote = (id: string) => saveNotes(notes.filter(n => n.id !== id));

  const typeColor = (t: Note['type']) =>
    t === 'action' ? 'var(--green)' : t === 'intel' ? 'var(--orange)' : 'var(--cyan)';
  const typeIcon = (t: Note['type']) =>
    t === 'action' ? <CheckCircle size={11} /> : t === 'intel' ? <AlertTriangle size={11} /> : <Shield size={11} />;
  const eventColor = (t: TimelineEvent['type']) =>
    t === 'alert' ? 'var(--orange)' : t === 'action' ? 'var(--green)' : 'var(--text-muted)';

  return (
    <div className="p-5 h-full overflow-auto">
      {/* Header + sub-tabs */}
      <div className="flex items-center gap-3 mb-4">
        <MessageSquare size={16} style={{ color: 'var(--cyan)' }} />
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
            CASE MANAGEMENT
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-white)' }}>
            Notes & Investigation Timeline
          </div>
        </div>
        <div className="ml-auto flex">
          {(['timeline', 'notes'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '5px 14px', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
                background: tab === t ? 'rgba(0,212,255,0.1)' : 'transparent',
                color: tab === t ? 'var(--cyan)' : 'var(--text-muted)',
                border: '1px solid',
                borderColor: tab === t ? 'rgba(0,212,255,0.3)' : 'var(--border)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {t === 'timeline' ? 'TIMELINE' : `NOTES (${notes.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* TIMELINE TAB */}
      {tab === 'timeline' && (
        <div className="animate-fade-in-up">
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
            Auto-generated chronological log of all investigation steps.
            System events, alerts, and manual actions are recorded here.
          </div>

          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute', left: 71, top: 0, bottom: 0,
              width: 1, background: 'var(--border)',
            }} />

            {timelineEvents.map((ev, i) => (
              <div key={i} className="flex gap-4 mb-5 animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                {/* Timestamp */}
                <div style={{
                  fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-muted)',
                  width: 60, flexShrink: 0, paddingTop: 3, textAlign: 'right',
                }}>{ev.time}</div>

                {/* Dot */}
                <div style={{
                  width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                  background: ev.type === 'alert' ? 'var(--orange)' : ev.type === 'action' ? 'var(--green)' : 'var(--border-lit)',
                  border: `2px solid ${eventColor(ev.type)}`,
                  marginTop: 3, zIndex: 1,
                }} />

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-white)', marginBottom: 2 }}>
                    {ev.label}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono', lineHeight: 1.6 }}>
                    {ev.detail}
                  </div>
                </div>
              </div>
            ))}

            {/* Notes in timeline */}
            {notes.map(note => (
              <div key={note.id} className="flex gap-4 mb-5">
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-muted)', width: 60, flexShrink: 0, textAlign: 'right', paddingTop: 3 }}>
                  {new Date(note.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                </div>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: typeColor(note.type), flexShrink: 0, marginTop: 3, zIndex: 1, border: `2px solid ${typeColor(note.type)}` }} />
                <div style={{ flex: 1, background: 'var(--bg-surface)', border: `1px solid var(--border)`, borderLeft: `3px solid ${typeColor(note.type)}`, padding: '8px 12px' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: typeColor(note.type), marginBottom: 4 }}>
                    MANUAL NOTE — {note.type.toUpperCase()} · {note.author}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-primary)' }}>{note.text}</div>
                  {note.wallet && (
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                      Wallet: {note.wallet}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NOTES TAB */}
      {tab === 'notes' && (
        <div className="animate-fade-in-up">
          {/* Add note form */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', padding: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 12 }}>
              ADD INVESTIGATOR NOTE
            </div>

            {/* Type selector */}
            <div className="flex gap-2 mb-3">
              {NOTE_TYPES.map(nt => (
                <button
                  key={nt.value}
                  onClick={() => setNoteType(nt.value)}
                  style={{
                    padding: '3px 10px', fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
                    background: noteType === nt.value ? `${nt.color}15` : 'transparent',
                    color: noteType === nt.value ? nt.color : 'var(--text-muted)',
                    border: `1px solid ${noteType === nt.value ? nt.color + '50' : 'var(--border)'}`,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {nt.label}
                </button>
              ))}
            </div>

            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Add your investigation note... (e.g. 'Wallet B confirmed as mule account per informant tip')"
              className="field-input"
              style={{ fontFamily: 'Inter', fontSize: 12, minHeight: 72, resize: 'vertical', marginBottom: 10 }}
            />
            <div className="flex items-center gap-3">
              <input
                value={wallet}
                onChange={e => setWallet(e.target.value)}
                placeholder="Linked wallet (optional) — 0x..."
                className="field-input"
                style={{ flex: 1, fontSize: 11 }}
              />
              <button
                className="btn-primary"
                onClick={addNote}
                disabled={!text.trim()}
                style={{ opacity: text.trim() ? 1 : 0.4, flexShrink: 0 }}
              >
                <Plus size={12} />
                ADD NOTE
              </button>
            </div>
          </div>

          {/* Notes list */}
          {notes.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
              <MessageSquare size={28} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
              <div style={{ fontSize: 12 }}>No notes yet. Add your first investigation note above.</div>
              <div style={{ fontSize: 10, marginTop: 6, color: 'var(--text-muted)' }}>Notes are saved to your browser and persist across refreshes.</div>
            </div>
          )}

          <div className="space-y-3">
            {notes.map(note => (
              <div
                key={note.id}
                className="animate-fade-in-up"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderLeft: `3px solid ${typeColor(note.type)}`,
                  padding: '12px 16px',
                }}
              >
                <div className="flex items-start gap-3">
                  <div style={{ color: typeColor(note.type), marginTop: 1 }}>{typeIcon(note.type)}</div>
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center gap-3 mb-2">
                      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: typeColor(note.type) }}>
                        {note.type.toUpperCase()}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                        {new Date(note.createdAt).toLocaleString('en-IN')}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>· {note.author}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.6 }}>{note.text}</div>
                    {note.wallet && (
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--cyan)', marginTop: 6 }}>
                        ▸ {note.wallet}
                      </div>
                    )}
                  </div>
                  <button onClick={() => deleteNote(note.id)} style={{ color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none', padding: 2, flexShrink: 0 }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
