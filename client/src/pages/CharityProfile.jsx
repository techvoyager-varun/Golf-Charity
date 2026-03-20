import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { charityAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { formatDate } from '../utils/formatters';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import './CharityProfile.css';

const CharityProfile = () => {
  const { slug } = useParams();
  const [charity, setCharity] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, updateUser } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    charityAPI.getBySlug(slug)
      .then(r => setCharity(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSupport = async () => {
    if (!isAuthenticated) { window.location.href = '/register'; return; }
    try {
      await updateUser({ selectedCharityId: charity._id });
      addToast(`Now supporting ${charity.name}!`, 'success');
    } catch (e) {
      addToast('Failed to update', 'error');
    }
  };

  if (loading) return <div className="charity-profile__loading"><div className="skeleton" style={{ height: '70vh' }} /></div>;
  if (!charity) return <div style={{ padding: 120, textAlign: 'center' }}>Charity not found.</div>;

  return (
    <div className="charity-profile">
      <Navbar />

      <section className="charity-profile__hero" style={{ background: 'linear-gradient(135deg, #1A2E2A 0%, #2D6A4F 100%)' }}>
        <div className="charity-profile__hero-overlay" />
        <div className="charity-profile__hero-content">
          <span className="charity-profile__hero-cat">{charity.category}</span>
          <h1 className="charity-profile__hero-name font-display">{charity.name}</h1>
          <p className="charity-profile__hero-tag">Making a difference, one round at a time.</p>
        </div>
      </section>

      <section className="charity-profile__body container">
        <div className="charity-profile__main">
          <p className="charity-profile__desc">{charity.description}</p>

          {charity.upcomingEvents && charity.upcomingEvents.length > 0 && (
            <div className="charity-profile__events">
              <h3 className="charity-profile__section-title">
                <span className="charity-profile__section-bar" />Upcoming Events
              </h3>
              <div className="charity-profile__timeline">
                {charity.upcomingEvents.map((event, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-item__dot" />
                    <div className="timeline-item__content">
                      <span className="timeline-item__date">{formatDate(event.date)}</span>
                      <span className="timeline-item__name">{event.name}</span>
                      {event.description && <p className="timeline-item__desc">{event.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="charity-profile__sidebar">
          <div className="charity-profile__sidebar-stat">
            <span className="charity-profile__sidebar-value font-display">₹{(charity.totalReceived || 0).toLocaleString()}</span>
            <span className="charity-profile__sidebar-label">raised by GolfCharity community</span>
          </div>
          <button className="charity-profile__support-btn" onClick={handleSupport}>
            Support This Charity
          </button>
        </aside>
      </section>

      <Footer />
    </div>
  );
};

export default CharityProfile;
