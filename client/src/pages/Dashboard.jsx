import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import Sidebar from '../components/layout/Sidebar';
import Badge from '../components/ui/Badge';
import { scoreAPI, drawAPI, winnerAPI, charityAPI, subscriptionAPI } from '../services/api';
import { formatCurrency, formatDate, getInitials } from '../utils/formatters';
import { Plus, Edit3, Trash2, Upload, ArrowRight, Trophy, Heart, Ticket, Award, Home } from 'lucide-react';
import './Dashboard.css';

const DashboardLayout = ({ children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="dashboard">
      <Sidebar type="user" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="dashboard__main">
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
      <nav className="dashboard__bottom-nav">
        {[
          { to: '/dashboard', icon: Home, label: 'Home' },
          { to: '/dashboard/scores', icon: Ticket, label: 'Scores' },
          { to: '/dashboard/draws', icon: Trophy, label: 'Draws' },
          { to: '/dashboard/charity', icon: Heart, label: 'Charity' },
          { to: '/dashboard/winnings', icon: Award, label: 'Wins' },
        ].map(({ to, icon: Icon, label }) => (
          <a key={to} href={to} className="dashboard__bottom-item">
            <Icon size={20} /><span>{label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
};

const Overview = () => {
  const { user, subscription } = useAuth();
  const [scores, setScores] = useState([]);
  const [drawData, setDrawData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    scoreAPI.getScores().then(r => setScores(r.data.data)).catch(() => {});
    drawAPI.getCurrent().then(r => setDrawData(r.data.data)).catch(() => {});
  }, []);

  return (
    <div className="dash-overview">
      {/* Subscription Status Bar */}
      <div className={`dash-status-bar dash-status-bar--${subscription?.status || 'pending'}`}>
        <div className="dash-status-bar__left">
          <span className="dash-status-bar__label">{subscription?.status === 'active' ? 'ACTIVE SUBSCRIPTION' : 'NO ACTIVE SUBSCRIPTION'}</span>
          <span className="dash-status-bar__detail">
            {subscription ? `${subscription.plan} plan · Renews ${formatDate(subscription.renewalDate)}` : 'Subscribe to access all features'}
          </span>
        </div>
        <button className="dash-status-bar__action" onClick={() => navigate(subscription ? '/dashboard/settings' : '/subscribe')}>
          {subscription ? 'Manage' : 'Subscribe'} <ArrowRight size={14} />
        </button>
      </div>

      {/* Key Stats */}
      <div className="dash-stats">
        <div className="dash-stat dash-stat--large">
          <span className="dash-stat__label">THIS MONTH'S DRAW</span>
          <span className="dash-stat__value font-display">{drawData?.prizePool ? formatCurrency(drawData.prizePool.totalPool) : '—'}</span>
        </div>
        <div className="dash-stat__divider" />
        <div className="dash-stat">
          <span className="dash-stat__label">SCORES ENTERED</span>
          <span className="dash-stat__value font-display">{scores.length}<span className="dash-stat__suffix">/5</span></span>
        </div>
        <div className="dash-stat__divider" />
        <div className="dash-stat">
          <span className="dash-stat__label">TOTAL DONATED</span>
          <span className="dash-stat__value font-display">{user?.charityPercentage || 10}<span className="dash-stat__suffix">%</span></span>
        </div>
      </div>

      {/* Recent Scores */}
      <div className="dash-section">
        <div className="dash-section__header">
          <h2 className="dash-section__title">Recent Scores</h2>
          <button className="dash-text-link" onClick={() => navigate('/dashboard/scores')}>View All <ArrowRight size={14} /></button>
        </div>
        {scores.length === 0 ? (
          <p className="dash-empty">No scores yet. Add your first Stableford score.</p>
        ) : (
          scores.slice(0, 3).map((s, i) => (
            <div key={s._id || i} className="score-strip">
              <span className="score-strip__value font-display">{s.value}</span>
              <span className="score-strip__date">{formatDate(s.date)}</span>
            </div>
          ))
        )}
      </div>

      {/* Draw Section */}
      {drawData?.draw && (
        <div className="dash-draw-panel">
          <span className="dash-draw-panel__label">THIS MONTH'S DRAW</span>
          <div className="dash-draw-panel__numbers">
            {(drawData.draw.drawNumbers || []).map((n, i) => {
              const matched = scores.some(s => s.value === n);
              return <div key={i} className={`draw-ball ${matched ? 'draw-ball--matched' : ''}`}>{n}</div>;
            })}
            {(!drawData.draw.drawNumbers || drawData.draw.drawNumbers.length === 0) && (
              <p className="dash-draw-panel__pending">Draw numbers not yet published</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ScoresSection = () => {
  const { addToast } = useToast();
  const [scores, setScores] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [scoreVal, setScoreVal] = useState('');
  const [scoreDate, setScoreDate] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchScores = async () => {
    try {
      const { data } = await scoreAPI.getScores();
      setScores(data.data);
    } catch (e) {} finally { setLoading(false); }
  };

  useEffect(() => { fetchScores(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await scoreAPI.updateScore(editId, { value: Number(scoreVal), date: scoreDate });
        addToast('Score updated', 'success');
      } else {
        await scoreAPI.addScore({ value: Number(scoreVal), date: scoreDate });
        addToast(scores.length >= 5 ? 'Score added — oldest replaced' : 'Score added!', 'success');
      }
      setScoreVal(''); setScoreDate(''); setEditId(null); setShowForm(false);
      fetchScores();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save score', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await scoreAPI.deleteScore(id);
      addToast('Score removed', 'success');
      fetchScores();
    } catch (err) {
      addToast('Failed to delete', 'error');
    }
  };

  const startEdit = (s) => {
    setEditId(s._id);
    setScoreVal(s.value);
    setScoreDate(new Date(s.date).toISOString().split('T')[0]);
    setShowForm(true);
  };

  return (
    <div className="dash-scores">
      <div className="dash-section__header">
        <h2 className="dash-section__title">Your Scores</h2>
        <button className="dash-add-btn" onClick={() => { setEditId(null); setScoreVal(''); setScoreDate(''); setShowForm(!showForm); }}>
          <Plus size={16} /> Add Score
        </button>
      </div>

      {scores.length >= 5 && <span className="dash-capacity">· Oldest score will be replaced</span>}

      {showForm && (
        <form className="dash-score-form" onSubmit={handleAdd}>
          <input type="number" min="1" max="45" value={scoreVal} onChange={e => setScoreVal(e.target.value)} placeholder="Score (1-45)" required className="dash-score-input" />
          <input type="date" value={scoreDate} onChange={e => setScoreDate(e.target.value)} max={new Date().toISOString().split('T')[0]} required className="dash-score-input" />
          <button type="submit" className="dash-score-submit">{editId ? 'Update' : 'Add'}</button>
        </form>
      )}

      {loading ? (
        <div className="dash-skeletons">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 60, marginBottom: 8 }} />)}
        </div>
      ) : scores.length === 0 ? (
        <p className="dash-empty">No scores yet. Enter your Stableford scores to participate in draws.</p>
      ) : (
        scores.map((s, i) => (
          <div key={s._id || i} className="score-strip">
            <span className="score-strip__value font-display">{s.value}</span>
            <span className="score-strip__date">{formatDate(s.date)}</span>
            <div className="score-strip__actions">
              <button onClick={() => startEdit(s)} className="score-strip__action"><Edit3 size={14} /></button>
              <button onClick={() => handleDelete(s._id)} className="score-strip__action score-strip__action--delete"><Trash2 size={14} /></button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const DrawsSection = () => {
  const [drawData, setDrawData] = useState(null);
  const [history, setHistory] = useState([]);
  const [scores, setScores] = useState([]);

  useEffect(() => {
    drawAPI.getCurrent().then(r => setDrawData(r.data.data)).catch(() => {});
    drawAPI.getHistory().then(r => setHistory(r.data.data)).catch(() => {});
    scoreAPI.getScores().then(r => setScores(r.data.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h2 className="dash-section__title" style={{ marginBottom: 32 }}>Draw Participation</h2>
      {drawData?.draw && (
        <div className="dash-draw-panel">
          <span className="dash-draw-panel__label">CURRENT DRAW — {drawData.draw.month} {drawData.draw.year}</span>
          <div className="dash-draw-panel__numbers">
            {(drawData.draw.drawNumbers || []).map((n, i) => {
              const matched = scores.some(s => s.value === n);
              return <div key={i} className={`draw-ball ${matched ? 'draw-ball--matched' : ''}`}>{n}</div>;
            })}
          </div>
          <div className="dash-draw-panel__status">
            <Badge status={drawData.draw.status}>{drawData.draw.status}</Badge>
            {drawData.prizePool && <span className="dash-draw-panel__pool">Pool: {formatCurrency(drawData.prizePool.totalPool)}</span>}
          </div>
        </div>
      )}

      <h3 className="dash-section__subtitle">Draw History</h3>
      {history.length === 0 ? <p className="dash-empty">No past draws yet.</p> : (
        history.map(d => (
          <div key={d._id} className="score-strip">
            <span className="score-strip__value font-display" style={{ fontSize: 28 }}>{d.month}</span>
            <span className="score-strip__date">{d.year} · {d.type}</span>
            <Badge status={d.status}>{d.status}</Badge>
          </div>
        ))
      )}
    </div>
  );
};

const CharitySection = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const [charities, setCharities] = useState([]);
  const [percentage, setPercentage] = useState(user?.charityPercentage || 10);
  const navigate = useNavigate();

  useEffect(() => { charityAPI.getAll().then(r => setCharities(r.data.data)).catch(() => {}); }, []);

  const handlePercentage = async (val) => {
    setPercentage(val);
    try {
      await updateUser({ charityPercentage: Number(val) });
      addToast(`Charity contribution set to ${val}%`, 'success');
    } catch (e) { addToast('Failed to update', 'error'); }
  };

  const handleSelect = async (id) => {
    try {
      await updateUser({ selectedCharityId: id });
      addToast('Charity updated!', 'success');
    } catch (e) { addToast('Failed to update', 'error'); }
  };

  const selected = charities.find(c => c._id === user?.selectedCharityId?._id || c._id === user?.selectedCharityId);

  return (
    <div>
      <h2 className="dash-section__title" style={{ marginBottom: 32 }}>Your Charity</h2>

      {selected && (
        <div className="dash-charity-selected">
          <div className="dash-charity-initial font-display">{selected.name[0]}</div>
          <div>
            <strong>{selected.name}</strong>
            <span className="dash-charity-cat">{selected.category}</span>
          </div>
          <span className="dash-charity-pct font-display">{percentage}%</span>
        </div>
      )}

      <div className="dash-slider-group">
        <label className="dash-slider-label">CONTRIBUTION PERCENTAGE</label>
        <input type="range" min="10" max="100" value={percentage} onChange={e => handlePercentage(e.target.value)} className="dash-slider" />
        <span className="dash-slider-value">{percentage}%</span>
      </div>

      <button className="dash-text-link" onClick={() => navigate('/charities')} style={{ marginTop: 24 }}>
        Change Charity <ArrowRight size={14} />
      </button>
    </div>
  );
};

const WinningsSection = () => {
  const { addToast } = useToast();
  const [winnings, setWinnings] = useState([]);
  const [uploadingId, setUploadingId] = useState(null);

  const fetchWinnings = () => winnerAPI.getMyWinnings().then(r => setWinnings(r.data.data)).catch(() => {});
  useEffect(() => { fetchWinnings(); }, []);

  const handleFileUpload = async (e, winnerId) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingId(winnerId);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result;
        await winnerAPI.submitProof({ winnerId, proofImageUrl: base64data });
        addToast('Proof uploaded successfully', 'success');
        fetchWinnings();
        setUploadingId(null);
      };
    } catch (err) {
      addToast('Failed to upload proof', 'error');
      setUploadingId(null);
    }
  };

  return (
    <div>
      <h2 className="dash-section__title" style={{ marginBottom: 32 }}>Your Winnings</h2>
      {winnings.length === 0 ? <p className="dash-empty">No winnings yet. Keep entering your scores!</p> : (
        winnings.map(w => (
          <div key={w._id} className="score-strip" style={{ flexWrap: 'wrap' }}>
            <span className="score-strip__value font-display" style={{ color: 'var(--accent-gold)' }}>{formatCurrency(w.prizeAmount)}</span>
            <span className="score-strip__date">{w.matchCount} matches · {formatDate(w.createdAt)}</span>
            <Badge status={w.status}>{w.status}</Badge>
            
            {w.status === 'pending' && (
              <div style={{ width: '100%', marginTop: 16 }}>
                <input 
                  type="file" 
                  id={`proof-${w._id}`} 
                  style={{ display: 'none' }} 
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, w._id)}
                />
                <label htmlFor={`proof-${w._id}`} className="dash-upload-area" style={{ cursor: 'pointer', opacity: uploadingId === w._id ? 0.5 : 1 }}>
                  <Upload size={20} />
                  <span>{uploadingId === w._id ? 'Uploading...' : 'Click to upload proof screenshot'}</span>
                </label>
              </div>
            )}
            {w.proofImageUrl && w.status !== 'pending' && (
              <div style={{ width: '100%', marginTop: 16, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                ✓ Proof submitted and under review.
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

const SettingsSection = () => {
  const { subscription } = useAuth();
  const { addToast } = useToast();

  const handleCancel = async () => {
    try {
      await subscriptionAPI.cancel();
      addToast('Subscription cancelled', 'info');
    } catch (e) { addToast('Failed to cancel', 'error'); }
  };

  return (
    <div>
      <h2 className="dash-section__title" style={{ marginBottom: 32 }}>Settings</h2>
      {subscription && (
        <div className="dash-status-bar dash-status-bar--active" style={{ marginBottom: 32 }}>
          <div className="dash-status-bar__left">
            <span className="dash-status-bar__label">{subscription.plan.toUpperCase()} PLAN</span>
            <span className="dash-status-bar__detail">Renews {formatDate(subscription.renewalDate)}</span>
          </div>
          <button className="dash-cancel-btn" onClick={handleCancel}>Cancel Subscription</button>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => (
  <DashboardLayout>
    <Routes>
      <Route index element={<Overview />} />
      <Route path="scores" element={<ScoresSection />} />
      <Route path="draws" element={<DrawsSection />} />
      <Route path="charity" element={<CharitySection />} />
      <Route path="winnings" element={<WinningsSection />} />
      <Route path="settings" element={<SettingsSection />} />
    </Routes>
  </DashboardLayout>
);

export default Dashboard;
