export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatDateLong = (date) => {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const getStatusColor = (status) => {
  const map = { active: 'var(--status-success)', approved: 'var(--status-success)', paid: 'var(--status-success)', pending: 'var(--status-pending)', cancelled: 'var(--status-error)', rejected: 'var(--status-error)', lapsed: 'var(--status-pending)', draft: 'var(--status-pending)', simulated: 'var(--status-warning)', published: 'var(--status-success)' };
  return map[status] || 'var(--text-muted)';
};

export const getStatusBg = (status) => {
  const map = { active: 'rgba(45,106,79,0.1)', approved: 'rgba(45,106,79,0.1)', paid: 'rgba(45,106,79,0.1)', pending: 'rgba(138,138,138,0.1)', cancelled: 'rgba(192,57,43,0.1)', rejected: 'rgba(192,57,43,0.1)', lapsed: 'rgba(138,138,138,0.1)', draft: 'rgba(138,138,138,0.1)', simulated: 'rgba(200,169,81,0.1)', published: 'rgba(45,106,79,0.1)' };
  return map[status] || 'rgba(138,138,138,0.1)';
};
