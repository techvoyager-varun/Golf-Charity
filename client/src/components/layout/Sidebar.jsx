import { NavLink, Link } from 'react-router-dom';
import { BarChart3, Trophy, Heart, Users, Settings, Ticket, Award, FileText, Home, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ type = 'user', isOpen, onClose }) => {
  const { logout, user } = useAuth();

  const userLinks = [
    { to: '/dashboard', icon: Home, label: 'Overview' },
    { to: '/dashboard/scores', icon: Ticket, label: 'My Scores' },
    { to: '/dashboard/draws', icon: Trophy, label: 'Draws' },
    { to: '/dashboard/charity', icon: Heart, label: 'Charity' },
    { to: '/dashboard/winnings', icon: Award, label: 'Winnings' },
    { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  const adminLinks = [
    { to: '/admin', icon: BarChart3, label: 'Analytics' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/draws', icon: Trophy, label: 'Draws' },
    { to: '/admin/charities', icon: Heart, label: 'Charities' },
    { to: '/admin/winners', icon: Award, label: 'Winners' },
    { to: '/admin/reports', icon: FileText, label: 'Reports' },
  ];

  const links = type === 'admin' ? adminLinks : userLinks;

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <Link to="/" className="sidebar__logo" style={{ textDecoration: 'none' }}>
            <span className="sidebar__logo-golf">Golf</span>
            <span className="sidebar__logo-charity">Charity</span>
          </Link>
          <button className="sidebar__close" onClick={onClose}><X size={20} /></button>
        </div>
      <div className="sidebar__divider" />
      <nav className="sidebar__nav">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end onClick={onClose} className={({ isActive }) => `sidebar__item ${isActive ? 'sidebar__item--active' : ''}`}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar__divider" />
      <button className="sidebar__item sidebar__logout" onClick={logout}>
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
    </>
  );
};

export default Sidebar;
