import type { ReactNode } from 'react';

// types for sorting
type SortField = 'name' | 'email' | 'phone' | 'score' | 'lastMessageAt' | 'addedBy';

// props for CustomerHeader
interface Props {
  handleSort: (field: SortField) => void;
  getSortIcon: (field: SortField) => ReactNode;
  selectAll: () => void;
}

export default function CustomerHeader({ handleSort, getSortIcon, selectAll }: Props) {
  return (
    <div className="cl-header-row">
      <div className="cl-col-select"><input type="checkbox" aria-label="Select all" onChange={selectAll} /></div>
      <div className="cl-col-name"><button onClick={() => handleSort('name')} className="cl-col-btn">Name <span className="sort-icon">{getSortIcon('name')}</span></button></div>
      <div className="cl-col-score"><button onClick={() => handleSort('score')} className="cl-col-btn">Score <span className="sort-icon">{getSortIcon('score')}</span></button></div>
      <div className="cl-col-email"><button onClick={() => handleSort('email')} className="cl-col-btn">Email <span className="sort-icon">{getSortIcon('email')}</span></button></div>
      <div className="cl-col-gap" />
      <div className="cl-col-gap2" />
      <div className="cl-col-last"><button onClick={() => handleSort('lastMessageAt')} className="cl-col-btn">Last Message <span className="sort-icon">{getSortIcon('lastMessageAt')}</span></button></div>
      <div className="cl-col-added"><button onClick={() => handleSort('addedBy')} className="cl-col-btn">Added By <span className="sort-icon">{getSortIcon('addedBy')}</span></button></div>
    </div>
  );
}
