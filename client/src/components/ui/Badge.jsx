import './Badge.css';

const Badge = ({ status, children }) => {
  return (
    <span className={`badge badge--${status}`}>
      {children || status}
    </span>
  );
};

export default Badge;
