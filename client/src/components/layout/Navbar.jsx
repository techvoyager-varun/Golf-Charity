import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <nav className={`navbar ${scrolled || !isHome ? 'navbar--solid' : ''}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-golf">Golf</span>
          <span className="navbar__logo-charity">Charity</span>
        </Link>
        <div className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          <Link to="/charities" className="navbar__link">Charities</Link>
          <Link to="/subscribe" className="navbar__link">Pricing</Link>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="navbar__link">Login</Link>
              <Link to="/subscribe" className="navbar__cta">Subscribe</Link>
            </>
          ) : (
            <>
              <Link to={isAdmin ? '/admin' : '/dashboard'} className="navbar__link">Dashboard</Link>
              <button onClick={() => { logout(); navigate('/'); }} className="navbar__link navbar__link--btn">Logout</button>
            </>
          )}
        </div>
        <button className="navbar__hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {menuOpen && <div className="navbar__overlay" onClick={() => setMenuOpen(false)} />}
    </nav>
  );
};

export default Navbar;
