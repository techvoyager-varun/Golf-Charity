import './Button.css';
import { Loader2 } from 'lucide-react';

const Button = ({ children, variant = 'primary', size = 'md', loading = false, disabled = false, fullWidth = false, onClick, type = 'button', className = '', ...props }) => {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <Loader2 className="btn__spinner" size={16} />}
      {children}
    </button>
  );
};

export default Button;
