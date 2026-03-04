import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, Trash2, Mail, Phone, Calendar, FileText,
  Briefcase, Clock, Download, Upload, ChevronUp, ChevronDown,
  ChevronsUpDown, Eye, X, Filter, RefreshCw,
  CheckSquare, Square, MinusSquare, ExternalLink, ChevronLeft, ChevronRight,
  UserCheck, UserX, Hourglass,
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { useFirestore } from '../../hooks/useFirestore';

/* ─── Label maps ─────────────────────────────────────────────────────────── */
const CONTRIBUTION_LABELS = {
  community_outreach: 'Community & Outreach',
  emotional_support: 'Emotional & Space Holding Support',
  social_media: 'Social Media & Creative',
  events_ground: 'Events & On-Ground Support',
  administration: 'Administration & Coordination',
  strategy_growth: 'Strategy, Partnerships & Growth',
  research_documentation: 'Research & Documentation',
  fundraising: 'Fundraising & Sponsorship',
  technical_digital: 'Technical & Digital Support',
  other: 'Other',
};

const AVAILABILITY_LABELS = {
  hours_2_3: '2–3 hrs/week',
  hours_4_6: '4–6 hrs/week',
  event_based: 'Event-based',
  short_term: 'Short-term project',
  long_term: 'Long-term',
  flexible: 'Flexible',
};

const EXPERIENCE_LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  experienced: 'Experienced',
  professional: 'Professional',
};

const STATUS_CONFIG = {
  pending:  { label: 'Pending',  color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  reviewed: { label: 'Reviewed', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  accepted: { label: 'Accepted', color: 'bg-green-100 text-green-800 border-green-200' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800 border-red-200' },
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const resolveContributions = (v) => {
  if (Array.isArray(v.contributions) && v.contributions.length > 0) {
    const labels = v.contributions.map(c => CONTRIBUTION_LABELS[c] || c);
    if (v.otherContribution) labels.push(v.otherContribution);
    return labels.join(', ');
  }
  if (v.interests) return Array.isArray(v.interests) ? v.interests.join(', ') : v.interests;
  return '';
};

const resolveAvailability = (v) => {
  if (Array.isArray(v.availability) && v.availability.length > 0)
    return v.availability.map(a => AVAILABILITY_LABELS[a] || a).join(', ');
  if (typeof v.availability === 'string' && v.availability) return v.availability;
  return '';
};

const formatDate = (ts) => {
  if (!ts) return '—';
  const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

/* ─── CSV helpers ────────────────────────────────────────────────────────── */
const escapeCSV = (val) => {
  if (val == null) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n'))
    return `"${str.replace(/"/g, '""')}"`;
  return str;
};

const exportToCSV = (rows) => {
  const headers = ['Name', 'Email', 'Phone', 'Experience Level', 'Availability', 'Contributions', 'Status', 'Message', 'Resume URL', 'Applied On'];
  const lines = [
    headers.join(','),
    ...rows.map(v => [
      v.name, v.email, v.phone,
      EXPERIENCE_LABELS[v.experienceLevel] || v.experienceLevel || '',
      resolveAvailability(v),
      resolveContributions(v),
      v.status || 'pending',
      v.message || '',
      v.resumeUrl || '',
      formatDate(v.createdAt),
    ].map(escapeCSV).join(','))
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `volunteers_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const parseCSV = (text) => {
  const [headerLine, ...dataLines] = text.trim().split('\n');
  const headers = headerLine.split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z_]/g, ''));
  return dataLines
    .filter(l => l.trim())
    .map(line => {
      const vals = [];
      let current = '';
      let inQuotes = false;
      for (const ch of line) {
        if (ch === '"') { inQuotes = !inQuotes; }
        else if (ch === ',' && !inQuotes) { vals.push(current); current = ''; }
        else { current += ch; }
      }
      vals.push(current);
      const obj = {};
      headers.forEach((h, i) => { obj[h] = (vals[i] || '').trim(); });
      return obj;
    });
};

/* ─── Sub-components ─────────────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, iconColor, bg, border }) => (
  <div className={`${bg} ${border} border rounded-xl p-5 flex items-center gap-4`}>
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-white/70 ${iconColor}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
      <p className="text-xs text-gray-500 font-medium mt-1">{label}</p>
    </div>
  </div>
);

const SortIcon = ({ field, sortField, sortDir }) => {
  if (sortField !== field) return <ChevronsUpDown className="w-3.5 h-3.5 text-gray-300 ml-1 flex-shrink-0" />;
  return sortDir === 'asc'
    ? <ChevronUp className="w-3.5 h-3.5 text-primary-500 ml-1 flex-shrink-0" />
    : <ChevronDown className="w-3.5 h-3.5 text-primary-500 ml-1 flex-shrink-0" />;
};

/* ─── Detail Drawer ──────────────────────────────────────────────────────── */
const DetailDrawer = ({ volunteer, onClose, onStatusChange, onDelete }) => {
  if (!volunteer) return null;
  const status = volunteer.status || 'pending';
  return (
    <AnimatePresence>
      <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <motion.aside key="dw"
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg flex-shrink-0">
              {volunteer.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 leading-tight">{volunteer.name}</h2>
              <p className="text-xs text-gray-400">Applied {formatDate(volunteer.createdAt)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Status */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <button key={key} onClick={() => onStatusChange(volunteer.id, key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    status === key ? cfg.color + ' ring-2 ring-offset-1 ring-current shadow-sm' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Contact</p>
            <div className="space-y-2">
              {volunteer.email && (
                <a href={`mailto:${volunteer.email}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-primary-50 group transition-colors">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"><Mail className="w-4 h-4 text-blue-600" /></div>
                  <span className="text-sm text-gray-700 group-hover:text-primary-700 truncate">{volunteer.email}</span>
                </a>
              )}
              {volunteer.phone && (
                <a href={`tel:${volunteer.phone}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-primary-50 group transition-colors">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0"><Phone className="w-4 h-4 text-green-600" /></div>
                  <span className="text-sm text-gray-700 group-hover:text-primary-700">{volunteer.phone}</span>
                </a>
              )}
            </div>
          </div>

          {/* Experience & Availability */}
          <div className="grid grid-cols-2 gap-4">
            {volunteer.experienceLevel && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Experience</p>
                <span className="inline-block px-3 py-1.5 bg-green-50 text-green-800 text-xs font-semibold rounded-lg border border-green-200">
                  {EXPERIENCE_LABELS[volunteer.experienceLevel] || volunteer.experienceLevel}
                </span>
              </div>
            )}
            {resolveAvailability(volunteer) && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Availability</p>
                <div className="flex flex-wrap gap-1">
                  {(Array.isArray(volunteer.availability) ? volunteer.availability : []).map(a => (
                    <span key={a} className="inline-block px-2.5 py-1 bg-blue-50 text-blue-800 text-xs font-medium rounded-lg border border-blue-100">
                      {AVAILABILITY_LABELS[a] || a}
                    </span>
                  ))}
                  {typeof volunteer.availability === 'string' && volunteer.availability && (
                    <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-800 text-xs font-medium rounded-lg border border-blue-100">{volunteer.availability}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Contributions */}
          {resolveContributions(volunteer) && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Can Contribute In</p>
              <div className="flex flex-wrap gap-1.5">
                {(Array.isArray(volunteer.contributions) ? volunteer.contributions : []).map(c => (
                  <span key={c} className="inline-block px-2.5 py-1 bg-primary-50 text-primary-800 text-xs font-medium rounded-lg border border-primary-100">
                    {CONTRIBUTION_LABELS[c] || c}
                  </span>
                ))}
                {volunteer.otherContribution && (
                  <span className="inline-block px-2.5 py-1 bg-primary-50 text-primary-800 text-xs font-medium rounded-lg border border-primary-100">
                    {volunteer.otherContribution}
                  </span>
                )}
                {!Array.isArray(volunteer.contributions) && volunteer.interests && (
                  <span className="inline-block px-2.5 py-1 bg-primary-50 text-primary-800 text-xs font-medium rounded-lg border border-primary-100">
                    {Array.isArray(volunteer.interests) ? volunteer.interests.join(', ') : volunteer.interests}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Message */}
          {volunteer.message && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">About / Message</p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4 leading-relaxed border border-gray-100">{volunteer.message}</p>
            </div>
          )}

          {/* Resume */}
          {volunteer.resumeUrl && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Resume</p>
              <a href={volunteer.resumeUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-50 hover:bg-primary-100 text-primary-700 text-sm font-semibold rounded-lg border border-primary-200 transition-colors">
                <FileText className="w-4 h-4" />Open Resume<ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
          <button onClick={() => { onDelete(volunteer); onClose(); }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded-lg border border-red-200 transition-colors">
            <Trash2 className="w-4 h-4" />Delete
          </button>
          <a href={`mailto:${volunteer.email}`}
            className="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
            <Mail className="w-4 h-4" />Email Volunteer
          </a>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};

/* ─── Import Modal ───────────────────────────────────────────────────────── */
const ImportModal = ({ onClose, onImport }) => {
  const [preview, setPreview] = useState([]);
  const [err, setErr] = useState('');
  const [rawRows, setRawRows] = useState([]);
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) { setErr('Please upload a .csv file'); return; }
    setErr('');
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const rows = parseCSV(ev.target.result);
        setRawRows(rows);
        setPreview(rows.slice(0, 5));
      } catch { setErr('Failed to parse CSV. Ensure it matches the export format.'); }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) { const dt = new DataTransfer(); dt.items.add(file); fileRef.current.files = dt.files; handleFile({ target: { files: dt.files } }); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-900">Import Volunteers from CSV</h2>
            <p className="text-xs text-gray-400 mt-0.5">Use an exported template or match the column format</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div onDrop={handleDrop} onDragOver={e => e.preventDefault()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/20 transition-all"
            onClick={() => fileRef.current?.click()}>
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6 text-primary-500" />
            </div>
            <p className="text-sm font-medium text-gray-700">Click to upload or drag & drop</p>
            <p className="text-xs text-gray-400 mt-1">CSV files only — must match export column format</p>
            <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} className="hidden" />
          </div>

          {err && <p className="text-sm text-red-700 bg-red-50 rounded-lg px-4 py-2.5 border border-red-200">{err}</p>}

          {preview.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Preview — {rawRows.length} record{rawRows.length !== 1 ? 's' : ''} detected
              </p>
              <div className="overflow-x-auto rounded-lg border border-gray-200 max-h-48">
                <table className="text-xs w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>{Object.keys(preview[0]).slice(0, 6).map(k => (
                      <th key={k} className="px-3 py-2 text-left font-semibold text-gray-600 capitalize whitespace-nowrap">{k.replace(/_/g, ' ')}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {preview.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        {Object.values(row).slice(0, 6).map((v, j) => (
                          <td key={j} className="px-3 py-2 text-gray-700 max-w-[140px] truncate">{v || '—'}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button onClick={() => exportToCSV([])}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            <Download className="w-3.5 h-3.5" />Download Template
          </button>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
            <button disabled={rawRows.length === 0} onClick={() => { onImport(rawRows); onClose(); }}
              className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm">
              Import {rawRows.length > 0 ? `${rawRows.length} Record${rawRows.length !== 1 ? 's' : ''}` : ''}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const AdminVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterExperience, setFilterExperience] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Table
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selection
  const [selected, setSelected] = useState(new Set());

  // UI
  const [drawerVolunteer, setDrawerVolunteer] = useState(null);
  const [showImport, setShowImport] = useState(false);

  const { getDocuments, deleteDocument, updateDocument, addDocument } = useFirestore('volunteers');

  /* ── Load ── */
  const loadVolunteers = async () => {
    setLoading(true);
    try {
      const result = await getDocuments();
      setVolunteers(result.success ? result.data : []);
    } catch (err) {
      console.error('Error loading volunteers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadVolunteers(); }, []); // eslint-disable-line

  /* ── Filtered + sorted data ── */
  const filtered = useMemo(() => {
    let rows = [...volunteers];
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(v =>
        v.name?.toLowerCase().includes(q) ||
        v.email?.toLowerCase().includes(q) ||
        v.phone?.includes(q) ||
        resolveContributions(v).toLowerCase().includes(q)
      );
    }
    if (filterStatus !== 'all') rows = rows.filter(v => (v.status || 'pending') === filterStatus);
    if (filterExperience !== 'all') rows = rows.filter(v => v.experienceLevel === filterExperience);
    if (filterAvailability !== 'all') {
      rows = rows.filter(v =>
        Array.isArray(v.availability) ? v.availability.includes(filterAvailability) : v.availability === filterAvailability
      );
    }
    rows.sort((a, b) => {
      let av = a[sortField], bv = b[sortField];
      if (sortField === 'createdAt') { av = a.createdAt?.seconds ?? 0; bv = b.createdAt?.seconds ?? 0; }
      else { av = (av ?? '').toString().toLowerCase(); bv = (bv ?? '').toString().toLowerCase(); }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return rows;
  }, [volunteers, search, filterStatus, filterExperience, filterAvailability, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => { setPage(1); setSelected(new Set()); }, [search, filterStatus, filterExperience, filterAvailability]);

  /* ── Stats ── */
  const stats = useMemo(() => ({
    total:    volunteers.length,
    pending:  volunteers.filter(v => !v.status || v.status === 'pending').length,
    accepted: volunteers.filter(v => v.status === 'accepted').length,
    rejected: volunteers.filter(v => v.status === 'rejected').length,
  }), [volunteers]);

  /* ── Sort ── */
  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  /* ── Selection ── */
  const allPageSelected = paginated.length > 0 && paginated.every(v => selected.has(v.id));
  const somePageSelected = paginated.some(v => selected.has(v.id));
  const toggleSelectAll = () => {
    const next = new Set(selected);
    if (allPageSelected) paginated.forEach(v => next.delete(v.id));
    else paginated.forEach(v => next.add(v.id));
    setSelected(next);
  };
  const toggleSelect = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  /* ── Actions ── */
  const handleDelete = async (volunteer) => {
    if (!window.confirm(`Delete ${volunteer.name}'s application? This cannot be undone.`)) return;
    await deleteDocument(volunteer.id);
    setVolunteers(prev => prev.filter(v => v.id !== volunteer.id));
    if (drawerVolunteer?.id === volunteer.id) setDrawerVolunteer(null);
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selected.size} selected application(s)? This cannot be undone.`)) return;
    await Promise.all([...selected].map(id => deleteDocument(id)));
    setVolunteers(prev => prev.filter(v => !selected.has(v.id)));
    setSelected(new Set());
  };

  const handleStatusChange = async (id, status) => {
    await updateDocument(id, { status });
    setVolunteers(prev => prev.map(v => v.id === id ? { ...v, status } : v));
    if (drawerVolunteer?.id === id) setDrawerVolunteer(prev => ({ ...prev, status }));
  };

  const handleImport = async (rows) => {
    let imported = 0;
    for (const row of rows) {
      const doc = {
        name: row.name || '', email: row.email || '', phone: row.phone || '',
        experienceLevel: Object.keys(EXPERIENCE_LABELS).find(k => EXPERIENCE_LABELS[k].toLowerCase() === (row.experience_level || '').toLowerCase()) || '',
        availability: row.availability ? [row.availability] : [],
        contributions: [], message: row.message || '', resumeUrl: row.resume_url || '',
        status: ['pending','reviewed','accepted','rejected'].includes(row.status) ? row.status : 'pending',
      };
      await addDocument(doc);
      imported++;
    }
    alert(`Successfully imported ${imported} volunteer record${imported !== 1 ? 's' : ''}.`);
    loadVolunteers();
  };

  /* ── Column header ── */
  const Th = ({ field, children, className = '' }) => (
    <th className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap ${field ? 'cursor-pointer select-none hover:bg-gray-100 transition-colors' : ''} ${className}`}
      onClick={() => field && toggleSort(field)}>
      <span className="flex items-center">{children}{field && <SortIcon field={field} sortField={sortField} sortDir={sortDir} />}</span>
    </th>
  );

  const activeFilters = [filterStatus !== 'all', filterExperience !== 'all', filterAvailability !== 'all'].filter(Boolean).length;

  /* ── Render ── */
  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Volunteer Applications</h1>
            <p className="text-sm text-gray-400 mt-0.5">{volunteers.length} total applications</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setShowImport(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              <Upload className="w-4 h-4" />Import CSV
            </button>
            <button onClick={() => exportToCSV(selected.size > 0 ? volunteers.filter(v => selected.has(v.id)) : filtered)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              <Download className="w-4 h-4" />
              {selected.size > 0 ? `Export ${selected.size} Selected` : 'Export CSV'}
            </button>
            <button onClick={loadVolunteers} title="Refresh"
              className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users}     label="Total Applications" value={stats.total}    iconColor="text-primary-600"  bg="bg-primary-50"  border="border-primary-100" />
          <StatCard icon={Hourglass} label="Pending Review"      value={stats.pending}  iconColor="text-yellow-600"  bg="bg-yellow-50"  border="border-yellow-100" />
          <StatCard icon={UserCheck} label="Accepted"            value={stats.accepted} iconColor="text-green-600"   bg="bg-green-50"   border="border-green-100" />
          <StatCard icon={UserX}     label="Rejected"            value={stats.rejected} iconColor="text-red-600"     bg="bg-red-50"     border="border-red-100" />
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 p-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Search by name, email, phone or contribution…"
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button onClick={() => setShowFilters(f => !f)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                showFilters || activeFilters > 0 ? 'bg-primary-50 border-primary-300 text-primary-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}>
              <Filter className="w-4 h-4" />Filters
              {activeFilters > 0 && (
                <span className="w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center font-bold">{activeFilters}</span>
              )}
            </button>
          </div>

          {/* Filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden">
                <div className="px-4 pb-4 pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-gray-100">
                  {[
                    { label: 'Status', val: filterStatus, set: setFilterStatus, options: [['all','All Statuses'], ...Object.entries(STATUS_CONFIG).map(([k,v]) => [k, v.label])] },
                    { label: 'Experience Level', val: filterExperience, set: setFilterExperience, options: [['all','All Levels'], ...Object.entries(EXPERIENCE_LABELS)] },
                    { label: 'Availability', val: filterAvailability, set: setFilterAvailability, options: [['all','All Availability'], ...Object.entries(AVAILABILITY_LABELS)] },
                  ].map(({ label, val, set, options }) => (
                    <div key={label}>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
                      <select value={val} onChange={e => set(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 bg-white">
                        {options.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                {activeFilters > 0 && (
                  <div className="px-4 pb-3">
                    <button onClick={() => { setFilterStatus('all'); setFilterExperience('all'); setFilterAvailability('all'); }}
                      className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                      ✕ Clear all filters
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bulk actions */}
          <AnimatePresence>
            {selected.size > 0 && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-primary-100 bg-primary-50/60">
                <div className="px-4 py-2.5 flex items-center gap-4">
                  <span className="text-sm font-semibold text-primary-800">{selected.size} selected</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => exportToCSV(volunteers.filter(v => selected.has(v.id)))}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors">
                      <Download className="w-3.5 h-3.5" />Export
                    </button>
                    <button onClick={handleBulkDelete}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />Delete
                    </button>
                    <button onClick={() => setSelected(new Set())} className="text-xs text-gray-400 hover:text-gray-600">Clear</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center"><Users className="w-7 h-7 text-gray-400" /></div>
              <p className="text-gray-600 font-medium">No applications found</p>
              <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="w-10 px-4 py-3">
                      <button onClick={toggleSelectAll} className="text-gray-400 hover:text-primary-600 transition-colors">
                        {allPageSelected ? <CheckSquare className="w-4 h-4 text-primary-600" />
                          : somePageSelected ? <MinusSquare className="w-4 h-4 text-primary-400" />
                          : <Square className="w-4 h-4" />}
                      </button>
                    </th>
                    <Th field="name">Name</Th>
                    <Th field="email">Email</Th>
                    <Th field="phone">Phone</Th>
                    <Th field="experienceLevel">Experience</Th>
                    <Th>Availability</Th>
                    <Th>Contributions</Th>
                    <Th field="status">Status</Th>
                    <Th field="createdAt">Applied</Th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginated.map((v) => {
                    const status = v.status || 'pending';
                    const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
                    const isSelected = selected.has(v.id);
                    return (
                      <motion.tr key={v.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className={`group hover:bg-gray-50/80 transition-colors cursor-pointer ${isSelected ? 'bg-primary-50/30' : ''}`}
                        onClick={() => setDrawerVolunteer(v)}>
                        <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                          <button onClick={() => toggleSelect(v.id)} className="text-gray-300 hover:text-primary-600 transition-colors">
                            {isSelected ? <CheckSquare className="w-4 h-4 text-primary-600" /> : <Square className="w-4 h-4" />}
                          </button>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                              {v.name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <span className="font-medium text-gray-900 text-sm whitespace-nowrap">{v.name || '—'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                          <a href={`mailto:${v.email}`} className="text-sm text-gray-500 hover:text-primary-600 transition-colors">{v.email || '—'}</a>
                        </td>
                        <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                          <a href={`tel:${v.phone}`} className="text-sm text-gray-500 hover:text-primary-600 transition-colors whitespace-nowrap">{v.phone || '—'}</a>
                        </td>
                        <td className="px-4 py-3.5">
                          {v.experienceLevel
                            ? <span className="inline-block px-2.5 py-0.5 bg-green-50 text-green-800 text-xs font-medium rounded-md border border-green-100 whitespace-nowrap">{EXPERIENCE_LABELS[v.experienceLevel] || v.experienceLevel}</span>
                            : <span className="text-gray-300 text-sm">—</span>}
                        </td>
                        <td className="px-4 py-3.5 max-w-[150px]">
                          <span className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{resolveAvailability(v) || '—'}</span>
                        </td>
                        <td className="px-4 py-3.5 max-w-[200px]">
                          <span className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{resolveContributions(v) || '—'}</span>
                        </td>
                        <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                          <select value={status} onChange={e => handleStatusChange(v.id, e.target.value)}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-400 ${statusCfg.color}`}>
                            {Object.entries(STATUS_CONFIG).map(([k, cfg]) => <option key={k} value={k}>{cfg.label}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-sm text-gray-400">{formatDate(v.createdAt)}</td>
                        <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {v.resumeUrl && (
                              <a href={v.resumeUrl} target="_blank" rel="noopener noreferrer"
                                className="p-1.5 hover:bg-primary-50 text-primary-400 hover:text-primary-600 rounded-lg transition-colors" title="View Resume">
                                <FileText className="w-4 h-4" />
                              </a>
                            )}
                            <button onClick={() => setDrawerVolunteer(v)}
                              className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg transition-colors" title="View Details">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(v)}
                              className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && filtered.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>Rows per page:</span>
                <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                  className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 bg-white">
                  {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <span className="text-gray-400">
                  {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                  className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let p;
                  if (totalPages <= 5) p = i + 1;
                  else if (page <= 3) p = i + 1;
                  else if (page >= totalPages - 2) p = totalPages - 4 + i;
                  else p = page - 2 + i;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-primary-600 text-white shadow-sm' : 'hover:bg-gray-200 text-gray-600'}`}>
                      {p}
                    </button>
                  );
                })}
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                  className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {drawerVolunteer && (
        <DetailDrawer volunteer={drawerVolunteer} onClose={() => setDrawerVolunteer(null)}
          onStatusChange={handleStatusChange} onDelete={handleDelete} />
      )}
      {showImport && <ImportModal onClose={() => setShowImport(false)} onImport={handleImport} />}
    </AdminLayout>
  );
};

export default AdminVolunteers;
