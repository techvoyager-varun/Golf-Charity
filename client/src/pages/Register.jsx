import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { charityAPI } from '../services/api';
import Navbar from '../components/layout/Navbar';
import './Auth.css';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', selectedCharityId: '', charityPercentage: 10 });
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    charityAPI.getAll().then(res => setCharities(res.data.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await register({ ...form, password: form.password });
      addToast('Account created! Welcome aboard.', 'success');
      navigate('/subscribe');
    } catch (err) {
      addToast(err.response?.data?.message || 'Registration failed', 'error');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-page__left">
          <div className="auth-deco-text font-display">JOIN US</div>
          <div className="auth-page__left-content">
            <div className="auth-page__logo font-display">
              <span>Golf</span><span className="auth-page__logo-gold">Charity</span>
            </div>
            <p className="auth-page__tagline">Play golf, win prizes, change lives.</p>
          </div>
        </div>
        <div className="auth-page__right">
          <form className="auth-form" onSubmit={handleSubmit}>
            <h1 className="auth-form__title">Create Account</h1>
            <p className="auth-form__subtitle">Already have an account? <Link to="/login" className="auth-form__link">Sign in</Link></p>

            <div className="auth-input-group">
              <input type="text" id="reg-name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="auth-input" placeholder=" " />
              <label htmlFor="reg-name" className="auth-label">FULL NAME</label>
            </div>
            <div className="auth-input-group">
              <input type="email" id="reg-email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="auth-input" placeholder=" " />
              <label htmlFor="reg-email" className="auth-label">EMAIL</label>
            </div>
            <div className="auth-input-group">
              <input type="password" id="reg-password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} className="auth-input" placeholder=" " />
              <label htmlFor="reg-password" className="auth-label">PASSWORD</label>
            </div>

            {charities.length > 0 && (
              <div className="auth-input-group">
                <select id="reg-charity" value={form.selectedCharityId} onChange={e => setForm({ ...form, selectedCharityId: e.target.value })} className="auth-input auth-select">
                  <option value="">Select a charity (optional)</option>
                  {charities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                <label htmlFor="reg-charity" className="auth-label auth-label--float">CHARITY</label>
              </div>
            )}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
