import React from 'react';
import { type Customer } from './lib/data';
import AvatarFallbackAsset from './assets/test_user-3 3.svg';

interface Props {
  customer: Customer;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
  style?: React.CSSProperties;
}

const CustomerRow = React.forwardRef<HTMLDivElement, Props>(function CustomerRow(
  { customer, isSelected, onToggleSelect, style },
  ref
) {
  return (
    <div
      ref={ref}
      className="cl-row"
      data-index={customer.id}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', ...(style || {}) }}
    >
      <div className="cl-col-select cl-cell">
        <input type="checkbox" checked={!!isSelected} onChange={() => onToggleSelect(customer.id)} />
      </div>

      <div className="cl-col-name cl-cell">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="avatar">
            <img
              src={customer.avatar}
              alt={customer.name}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = AvatarFallbackAsset; }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{customer.name}</span>
            <span style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{customer.phone}</span>
          </div>
        </div>
      </div>

      <div className="cl-col-score cl-cell">
        <span className={`score-badge ${customer.score >= 80 ? 'score-high' : customer.score >= 50 ? 'score-mid' : 'score-low'}`}>
          {customer.score}
        </span>
      </div>

      <div className="cl-col-email cl-cell">{customer.email}</div>
      <div className="cl-col-last cl-cell">{new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(customer.lastMessageAt)}</div>
      <div className="cl-col-added cl-cell">{customer.addedBy}</div>
    </div>
  );
});

export default CustomerRow;
