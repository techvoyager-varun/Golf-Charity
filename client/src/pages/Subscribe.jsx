import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { subscriptionAPI } from '../services/api';
import { useToast } from '../components/ui/Toast';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import './Subscribe.css';

const Subscribe = () => {
  const [loading, setLoading] = useState(null);
  const { isAuthenticated, fetchUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubscribe = async (plan) => {
    if (!isAuthenticated) { navigate('/register'); return; }
    try {
      setLoading(plan);
      await subscriptionAPI.create({ plan });
      await fetchUser();
      addToast('Subscription activated!', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.response?.data?.message || 'Subscription failed', 'error');
    } finally { setLoading(null); }
  };

  const monthlyFeatures = ['Monthly draw entry', 'Score tracking (5 scores)', 'Charity contribution (min 10%)', 'Winner prize pool access', 'Community membership'];
  const yearlyFeatures = ['All Monthly features', '2 months free', 'Priority support', 'Annual charity gala invite', 'Exclusive member events', 'Early draw notifications'];

  return (
    <div className="subscribe-page">
      <Navbar />
      <section className="subscribe-hero">
        <div className="container">
          <h1 className="subscribe-hero__title font-display">Choose Your Plan</h1>
          <p className="subscribe-hero__sub">Join thousands of golfers making a difference every month.</p>
        </div>
      </section>

      <section className="subscribe-plans container">
        <div className="plan plan--monthly">
          <div className="plan__price">
            <span className="plan__amount font-display">₹2,499</span>
            <span className="plan__interval">/mo</span>
          </div>
          <h3 className="plan__name">Monthly Plan</h3>
          <ul className="plan__features">
            {monthlyFeatures.map((f, i) => <li key={i}><span className="plan__bullet">·</span> {f}</li>)}
          </ul>
          <button className="plan__cta plan__cta--monthly" onClick={() => handleSubscribe('monthly')} disabled={loading === 'monthly'}>
            {loading === 'monthly' ? 'Processing...' : 'Get Started'} <ArrowRight size={16} />
          </button>
        </div>

        <div className="plan plan--yearly">
          <span className="plan__best-value">BEST VALUE</span>
          <div className="plan__price">
            <span className="plan__amount font-display plan__amount--white">₹24,999</span>
            <span className="plan__interval plan__interval--gold">/yr</span>
          </div>
          <h3 className="plan__name plan__name--white">Yearly Plan</h3>
          <div className="plan__savings">Save ₹4,989 per year</div>
          <ul className="plan__features plan__features--light">
            {yearlyFeatures.map((f, i) => <li key={i}><span className="plan__bullet">·</span> {f}</li>)}
          </ul>
          <button className="plan__cta plan__cta--yearly" onClick={() => handleSubscribe('yearly')} disabled={loading === 'yearly'}>
            {loading === 'yearly' ? 'Processing...' : 'Get Started'} <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <div className="subscribe-trust container">
        <Shield size={14} />
        <span>Secure payment via Stripe</span>
        <span>·</span>
        <span>Cancel anytime</span>
        <span>·</span>
        <span>Full access immediately</span>
      </div>

      <Footer />
    </div>
  );
};

export default Subscribe;
