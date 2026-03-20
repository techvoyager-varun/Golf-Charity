import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__gold-line" />
      <div className="footer__inner container--wide">
        <div className="footer__main">
          <div className="footer__brand">
            <h2 className="footer__logo font-display">
              <span>Golf</span><span className="footer__logo-gold">Charity</span>
            </h2>
            <p className="footer__tagline">Play golf, win prizes, change lives.</p>
            <div className="footer__socials">
              <a href="#" aria-label="Twitter" className="footer__social">𝕏</a>
              <a href="#" aria-label="Instagram" className="footer__social">IG</a>
              <a href="#" aria-label="Facebook" className="footer__social">FB</a>
            </div>
          </div>
          <div className="footer__nav-columns">
            <div className="footer__nav-col">
              <h4 className="footer__nav-title">Platform</h4>
              <Link to="/charities">Charities</Link>
              <Link to="/subscribe">Pricing</Link>
              <Link to="/login">Sign In</Link>
              <Link to="/register">Join Now</Link>
            </div>
            <div className="footer__nav-col">
              <h4 className="footer__nav-title">Support</h4>
              <a href="#">Help Centre</a>
              <a href="#">Contact Us</a>
              <a href="#">FAQs</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© 2026 GolfCharity</span>
          <div className="footer__legal">
            <a href="#">Privacy</a>
            <span>·</span>
            <a href="#">Terms</a>
            <span>·</span>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
