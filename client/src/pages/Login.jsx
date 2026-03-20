import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import Navbar from '../components/layout/Navbar';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await login(email, password);
      addToast('Welcome back!', 'success');
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      addToast(err.response?.data?.message || 'Login failed', 'error');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-page__left">
          <div className="auth-deco-text font-display">WELCOME BACK</div>
          <div className="auth-page__left-content">
            <div className="auth-page__logo font-display">
              <span>Golf</span><span className="auth-page__logo-gold">Charity</span>
            </div>
            <p className="auth-page__tagline">2,400 members winning monthly</p>
          </div>
        </div>
        <div className="auth-page__right">
          <form className="auth-form" onSubmit={handleSubmit}>
            <h1 className="auth-form__title">Sign In</h1>
            <p className="auth-form__subtitle">Don't have an account? <Link to="/register" className="auth-form__link">Join now</Link></p>

            <div className="auth-input-group">
              <input type="email" id="login-email" value={email} onChange={e => setEmail(e.target.value)} required className="auth-input" placeholder=" " />
              <label htmlFor="login-email" className="auth-label">EMAIL</label>
            </div>

            <div className="auth-input-group">
              <input type="password" id="login-password" value={password} onChange={e => setPassword(e.target.value)} required className="auth-input" placeholder=" " />
              <label htmlFor="login-password" className="auth-label">PASSWORD</label>
            </div>

            <div className="auth-form__forgot"><a href="#">Forgot password?</a></div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
