import { useState } from 'react';
import './Input.css';

const Input = ({ label, type = 'text', value, onChange, error, placeholder, name, required, min, max, ...props }) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value !== undefined && value !== '';

  return (
    <div className={`input-group ${error ? 'input-group--error' : ''} ${focused ? 'input-group--focused' : ''}`}>
      {label && (
        <label className={`input-label ${focused || hasValue ? 'input-label--float' : ''}`} htmlFor={name}>
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={focused ? placeholder : ''}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        min={min}
        max={max}
        className="input-field"
        {...props}
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export default Input;
