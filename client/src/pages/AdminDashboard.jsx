import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { adminAPI, charityAPI, drawAPI, winnerAPI } from '../services/api';
import { formatCurrency, formatDate, getInitials } from '../utils/formatters';
import { TrendingUp, Users, Trophy, Heart, CheckCircle, XCircle, DollarSign, Search } from 'lucide-react';
import './Admin.css';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="admin">
      <Sidebar type="admin" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="admin__main">
        <div className="dash-mobile-header">
          <button className="dash-hamburger" onClick={() => setSidebarOpen(true)}>
            <div className="dash-hamburger-line" />
            <div className="dash-hamburger-line" />
            <div className="dash-hamburger-line" />
          </button>
          <span className="dash-mobile-logo">Golf<span style={{ color: 'var(--accent-gold)' }}>Charity</span></span>
        </div>
        {children}
      </main>
    </div>
  );
};

const Analytics = () => {
  const [stats, setStats] = useState(null);
  useEffect(() => { adminAPI.getAnalytics().then(r => setStats(r.data.data)).catch(() => {}); }, []);

  if (!stats) return <div className="admin__loading">{[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 80, marginBottom: 16 }} />)}</div>;

  return (
    <div>
      <div className="admin-stat-primary">
        <span className="admin-stat-primary__label">TOTAL ACTIVE MEMBERS</span>
        <span className="admin-stat-primary__value font-display">{stats.activeSubscribers.toLocaleString()}</span>
        <span className="admin-stat-primary__trend"><TrendingUp size={14} /> +12% this month</span>
      </div>
      <div className="admin-stats-row">
        <div className="admin-stat-secondary">
          <span className="admin-stat-secondary__value font-display">{stats.totalUsers}</span>
          <span className="admin-stat-secondary__label">Total Users</span>
        </div>
        <div className="admin-stats-sep" />
        <div className="admin-stat-secondary">
          <span className="admin-stat-secondary__value font-display">{formatCurrency(stats.currentPrizePool)}</span>
          <span className="admin-stat-secondary__label">Current Prize Pool</span>
        </div>
        <div className="admin-stats-sep" />
        <div className="admin-stat-secondary">
          <span className="admin-stat-secondary__value font-display">{formatCurrency(stats.totalCharityAmount)}</span>
          <span className="admin-stat-secondary__label">Total to Charity</span>
        </div>
      </div>
      <div className="admin-tertiary">
        <div className="admin-tertiary__row"><span>Total Prize Distributed</span><span>{formatCurrency(stats.totalPrizeDistributed)}</span></div>
        <div className="admin-tertiary__row"><span>Recent Draws</span><span>{stats.recentDraws?.length || 0}</span></div>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const { addToast } = useToast();

  const fetchUsers = async () => {
    try {
      const { data } = await adminAPI.getUsers({ search });
      setUsers(data.data.users);
      setTotal(data.data.total);
    } catch (e) {}
  };

  useEffect(() => { fetchUsers(); }, [search]);

  const handleDelete = async (id) => {
    try {
      await adminAPI.deleteUser(id);
      addToast('User deleted', 'success');
      fetchUsers();
    } catch (e) { addToast('Failed', 'error'); }
  };

  return (
    <div>
      <div className="admin-table-header">
        <h2 className="admin-title">Users <span className="admin-title__count">{total}</span></h2>
        <div className="admin-search">
          <Search size={14} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="admin-search__input" />
        </div>
      </div>
      <div className="admin-table">
        <div className="admin-table__head">
          <span>Name</span><span>Email</span><span>Role</span><span>Status</span><span>Joined</span><span></span>
        </div>
        {users.map(u => (
          <div key={u._id} className="admin-table__row">
            <span className="admin-table__name"><div className="admin-avatar">{getInitials(u.name)}</div>{u.name}</span>
            <span>{u.email}</span>
            <span><Badge status={u.role === 'admin' ? 'active' : u.role === 'subscriber' ? 'simulated' : 'pending'}>{u.role}</Badge></span>
            <span><Badge status={u.subscriptionId?.status || 'pending'}>{u.subscriptionId?.status || 'none'}</Badge></span>
            <span className="admin-table__date">{formatDate(u.createdAt)}</span>
            <span className="admin-table__actions">
              <button className="admin-action admin-action--delete" onClick={() => handleDelete(u._id)}>Delete</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const DrawManagement = () => {
  const [drawType, setDrawType] = useState('5-number');
  const [logic, setLogic] = useState('random');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState('');
  const [history, setHistory] = useState([]);
  const { addToast } = useToast();

  useEffect(() => { drawAPI.getHistory().then(r => setHistory(r.data.data)).catch(() => {}); }, []);

  const handleSimulate = async () => {
    try {
      setLoading('sim');
      const { data } = await drawAPI.simulate({ type: drawType, logic });
      setResult(data.data);
      addToast('Simulation complete!', 'success');
    } catch (e) { addToast(e.response?.data?.message || 'Failed', 'error'); } finally { setLoading(''); }
  };

  const handlePublish = async () => {
    try {
      setLoading('pub');
      await drawAPI.publish();
      addToast('Draw published!', 'success');
      setResult(null);
    } catch (e) { addToast(e.response?.data?.message || 'Failed', 'error'); } finally { setLoading(''); }
  };

  return (
    <div>
      <div className="admin-draw-panel">
        <h2 className="admin-draw-panel__title">Configure Draw</h2>
        <div className="admin-draw-controls">
          <div className="admin-draw-toggle">
            <button className={`admin-draw-toggle__btn ${logic === 'random' ? 'active' : ''}`} onClick={() => setLogic('random')}>Random</button>
            <button className={`admin-draw-toggle__btn ${logic === 'algorithmic' ? 'active' : ''}`} onClick={() => setLogic('algorithmic')}>Algorithmic</button>
          </div>
          <div className="admin-draw-types">
            {['3-number', '4-number', '5-number'].map(t => (
              <button key={t} className={`admin-draw-type ${drawType === t ? 'admin-draw-type--active' : ''}`} onClick={() => setDrawType(t)}>
                {t.replace('-', ' ').replace('n', 'N')}
              </button>
            ))}
          </div>
        </div>
        <div className="admin-draw-actions">
          <button className="admin-draw-btn admin-draw-btn--sim" onClick={handleSimulate} disabled={!!loading}>
            {loading === 'sim' ? 'Running...' : 'Run Simulation'}
          </button>
          <button className="admin-draw-btn admin-draw-btn--pub" onClick={handlePublish} disabled={!!loading || !result}>
            {loading === 'pub' ? 'Publishing...' : 'Publish Draw'}
          </button>
        </div>
        {result && (
          <div className="admin-draw-result">
            <span className="admin-draw-result__label">SIMULATION RESULT</span>
            <div className="admin-draw-result__numbers">
              {result.draw.drawNumbers.map((n, i) => <div key={i} className="draw-ball draw-ball--matched">{n}</div>)}
            </div>
            <span className="admin-draw-result__info">Pool: {formatCurrency(result.prizePool.totalPool)} · Winners: {result.draw.winners.length}</span>
          </div>
        )}
      </div>

      <h3 className="admin-subtitle">Draw History</h3>
      <div className="admin-table">
        <div className="admin-table__head">
          <span>Month</span><span>Type</span><span>Status</span><span>Pool</span><span>Winners</span>
        </div>
        {history.map(d => (
          <div key={d._id} className="admin-table__row">
            <span>{d.month} {d.year}</span>
            <span>{d.type}</span>
            <span><Badge status={d.status}>{d.status}</Badge></span>
            <span>{formatCurrency(d.prizePool)}</span>
            <span>{d.winners.length}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CharityManagement = () => {
  const [charities, setCharities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', category: '', website: '', featured: false });
  const { addToast } = useToast();

  const fetchCharities = async () => { charityAPI.getAll().then(r => setCharities(r.data.data)).catch(() => {}); };
  useEffect(() => { fetchCharities(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await charityAPI.create(form);
      addToast('Charity added!', 'success');
      setShowModal(false);
      setForm({ name: '', description: '', category: '', website: '', featured: false });
      fetchCharities();
    } catch (e) { addToast(e.response?.data?.message || 'Failed', 'error'); }
  };

  const handleDelete = async (id) => {
    try {
      await charityAPI.delete(id);
      addToast('Charity deleted', 'success');
      fetchCharities();
    } catch (e) { addToast('Failed', 'error'); }
  };

  return (
    <div>
      <div className="admin-table-header">
        <h2 className="admin-title">Charities</h2>
        <button className="admin-add-btn" onClick={() => setShowModal(true)}>+ Add Charity</button>
      </div>
      <div className="admin-table">
        <div className="admin-table__head">
          <span>Name</span><span>Category</span><span>Featured</span><span>Total Received</span><span></span>
        </div>
        {charities.map(c => (
          <div key={c._id} className="admin-table__row">
            <span className="admin-table__name"><div className="admin-avatar" style={{ background: 'var(--accent-green)' }}>{c.name[0]}</div>{c.name}</span>
            <span>{c.category}</span>
            <span>{c.featured ? '★' : '—'}</span>
            <span className="admin-table__gold">{formatCurrency(c.totalReceived || 0)}</span>
            <span className="admin-table__actions">
              <button className="admin-action admin-action--delete" onClick={() => handleDelete(c._id)}>Delete</button>
            </span>
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Charity">
        <form onSubmit={handleAdd}>
          <div className="auth-input-group">
            <input className="auth-input" placeholder=" " value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <label className="auth-label">NAME</label>
          </div>
          <div className="auth-input-group">
            <textarea className="auth-input" placeholder=" " value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required style={{ resize: 'vertical', minHeight: 80 }} />
            <label className="auth-label">DESCRIPTION</label>
          </div>
          <div className="auth-input-group">
            <input className="auth-input" placeholder=" " value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required />
            <label className="auth-label">CATEGORY</label>
          </div>
          <div className="auth-input-group">
            <input className="auth-input" placeholder=" " value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} />
            <label className="auth-label">WEBSITE</label>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 14, color: 'var(--text-secondary)' }}>
            <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} /> Featured charity
          </label>
          <button type="submit" className="auth-submit">Add Charity</button>
        </form>
      </Modal>
    </div>
  );
};

const WinnerVerification = () => {
  const [winners, setWinners] = useState([]);
  const { addToast } = useToast();

  const fetchWinners = async () => { winnerAPI.getAll().then(r => setWinners(r.data.data)).catch(() => {}); };
  useEffect(() => { fetchWinners(); }, []);

  const handleAction = async (id, action) => {
    try {
      if (action === 'approve') await winnerAPI.approve(id, {});
      else if (action === 'reject') await winnerAPI.reject(id, {});
      else if (action === 'paid') await winnerAPI.markPaid(id);
      addToast(`Winner ${action}d`, 'success');
      fetchWinners();
    } catch (e) { addToast('Failed', 'error'); }
  };

  return (
    <div>
      <h2 className="admin-title" style={{ marginBottom: 24 }}>Winner Verification</h2>
      {winners.length === 0 ? <p className="dash-empty">No winners to verify.</p> : (
        winners.map(w => (
          <div key={w._id} className="admin-winner-row">
            <div className="admin-avatar">{getInitials(w.userId?.name)}</div>
            <div className="admin-winner-info">
              <span className="admin-winner-name">{w.userId?.name || 'Unknown'}</span>
              <span className="admin-winner-detail">{w.matchCount} matches · {formatCurrency(w.prizeAmount)}</span>
            </div>
            {w.proofImageUrl && <div className="admin-winner-proof" />}
            <Badge status={w.status}>{w.status}</Badge>
            <div className="admin-winner-actions">
              {w.status === 'pending' && (
                <>
                  <button className="admin-action admin-action--approve" onClick={() => handleAction(w._id, 'approve')}>Approve</button>
                  <button className="admin-action admin-action--delete" onClick={() => handleAction(w._id, 'reject')}>Reject</button>
                </>
              )}
              {w.status === 'approved' && (
                <button className="admin-action admin-action--approve" onClick={() => handleAction(w._id, 'paid')}>Mark Paid</button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const Reports = () => {
  const [data, setData] = useState(null);
  useEffect(() => { adminAPI.getReports().then(r => setData(r.data.data)).catch(() => {}); }, []);

  if (!data) return <div className="skeleton" style={{ height: 200 }} />;

  return (
    <div>
      <h2 className="admin-title" style={{ marginBottom: 24 }}>Reports & Analytics</h2>
      <div className="admin-report-grid">
        <div className="admin-report-card">
          <span className="admin-report-card__value font-display">{data.users?.length || 0}</span>
          <span className="admin-report-card__label">Total Users</span>
        </div>
        <div className="admin-report-card">
          <span className="admin-report-card__value font-display">{data.draws?.length || 0}</span>
          <span className="admin-report-card__label">Total Draws</span>
        </div>
        <div className="admin-report-card">
          <span className="admin-report-card__value font-display">{data.winners?.length || 0}</span>
          <span className="admin-report-card__label">Total Winners</span>
        </div>
        <div className="admin-report-card">
          <span className="admin-report-card__value font-display">{data.charities?.length || 0}</span>
          <span className="admin-report-card__label">Charities</span>
        </div>
      </div>
      <h3 className="admin-subtitle">Draw Statistics</h3>
      <div className="admin-table">
        <div className="admin-table__head">
          <span>Month</span><span>Year</span><span>Type</span><span>Status</span><span>Prize Pool</span><span>Winners</span>
        </div>
        {(data.draws || []).slice(0, 10).map(d => (
          <div key={d._id} className="admin-table__row">
            <span>{d.month}</span><span>{d.year}</span><span>{d.type}</span>
            <span><Badge status={d.status}>{d.status}</Badge></span>
            <span>{formatCurrency(d.prizePool)}</span><span>{d.winners?.length || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard = () => (
  <AdminLayout>
    <Routes>
      <Route index element={<Analytics />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="draws" element={<DrawManagement />} />
      <Route path="charities" element={<CharityManagement />} />
      <Route path="winners" element={<WinnerVerification />} />
      <Route path="reports" element={<Reports />} />
    </Routes>
  </AdminLayout>
);

export default AdminDashboard;
