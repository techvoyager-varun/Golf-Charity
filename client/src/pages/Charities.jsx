import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { charityAPI } from '../services/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import './Charities.css';

const Charities = () => {
  const [charities, setCharities] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Youth', 'Health', 'Education', 'Environment', 'Community', 'Sports'];

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (category && category !== 'All') params.category = category;
    charityAPI.getAll(params).then(r => {
      setCharities(r.data.data);
      if (!featured) setFeatured(r.data.data.find(c => c.featured) || r.data.data[0]);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [search, category]);

  return (
    <div className="charities-page">
      <Navbar />

      {/* Header Banner */}
      <section className="charities-header">
        <div className="container--wide">
          <h1 className="charities-header__title font-display">Our Charities</h1>
          <span className="charities-header__stat">₹52,000+ <span>raised by our community</span></span>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="charities-filter container--wide">
        <div className="charities-search">
          <Search size={16} className="charities-search__icon" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search charities..." className="charities-search__input" />
        </div>
        <div className="charities-categories">
          {categories.map(cat => (
            <button key={cat} className={`charities-cat ${(category === cat || (!category && cat === 'All')) ? 'charities-cat--active' : ''}`} onClick={() => setCategory(cat === 'All' ? '' : cat)}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Charity List */}
      <section className="charities-list container--wide">
        {loading ? (
          <div className="dash-skeletons">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 200, marginBottom: 16 }} />)}
          </div>
        ) : charities.length === 0 ? (
          <p className="dash-empty" style={{ textAlign: 'center', padding: 80 }}>No charities found. Try a different search.</p>
        ) : (
          charities.map((charity, i) => (
            <div key={charity._id} className={`charity-row ${i % 2 === 1 ? 'charity-row--reverse' : ''}`}>
              <div className="charity-row__image">
                <div className="charity-row__image-inner" style={{ background: `linear-gradient(135deg, #1A2E2A 0%, #2D6A4F 100%)` }}>
                  <span className="font-display">{charity.name[0]}</span>
                </div>
              </div>
              <div className="charity-row__content">
                <span className="charity-row__category">{charity.category}</span>
                <h2 className="charity-row__name font-display">{charity.name}</h2>
                <p className="charity-row__desc">{charity.description?.slice(0, 150)}...</p>
                <span className="charity-row__raised font-display">₹{(charity.totalReceived || 0).toLocaleString()} <span>raised</span></span>
                <Link to={`/charities/${charity.slug}`} className="charity-row__link">Learn More <ArrowRight size={14} /></Link>
              </div>
            </div>
          ))
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Charities;
