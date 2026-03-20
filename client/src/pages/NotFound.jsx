import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './NotFound.css';

const NotFound = () => (
  <div className="notfound">
    <div className="notfound__content">
      <span className="notfound__code font-display">404</span>
      <h1 className="notfound__title">Page Not Found</h1>
      <p className="notfound__desc">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="notfound__link">Back to Home <ArrowRight size={16} /></Link>
    </div>
  </div>
);

export default NotFound;
