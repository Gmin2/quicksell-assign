import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { type Customer } from './lib/data';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import Logo from './assets/Doubletick Logo.png'
import SearchIcon from './assets/test_Search-3.svg'
import FilterIcon from './assets/test_Filter.svg'
import AvatarFallbackAsset from './assets/test_user-3 3.svg'
import './index.css'

type SortField = 'name' | 'email' | 'phone' | 'score' | 'lastMessageAt' | 'addedBy';
type SortOrder = 'asc' | 'desc' | null;

interface CustomerListProps {
  customers: Customer[];
}

export default function CustomersList({ customers }: CustomerListProps) {
  
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  // reference for the scrollable container
  const parentRef = useRef<HTMLDivElement>(null);
  // debounce search input at 250ms as given in the assign
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter and sort customers
  const filteredAndSortedCustomers = useMemo(() => {
    let result = [...customers];

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((c) =>
        c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q)
      );
    }

    if (sortField && sortOrder) {
      result.sort((a, b) => {
        let aValue: any = a[sortField];
        let bValue: any = b[sortField];

        if (sortField === 'lastMessageAt') {
          aValue = (aValue as Date).getTime();
          bValue = (bValue as Date).getTime();
        }

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [customers, debouncedSearch, sortField, sortOrder]);

  // Handle sorting when header clicked
  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      if (sortOrder === 'asc') setSortOrder('desc');
      else if (sortOrder === 'desc') { setSortOrder(null); setSortField(null); }
    } else {
      setSortField(field); setSortOrder('asc');
    }
  }, [sortField, sortOrder]);

  // Virtualizer setup
  const rowVirtualizer = useVirtualizer({
    count: filteredAndSortedCustomers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 10,
  });

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="sort-icon" />;
    if (sortOrder === 'asc') return <ArrowUp className="sort-icon" />;
    return <ArrowDown className="sort-icon" />;
  };

  const formatDate = (date: Date) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
  return (
    <div className="cl-root">
      {/* Header */}
      <div className="cl-header">
        <div className="cl-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={Logo} alt="DoubleTick" className="cl-logo" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 className="cl-title">DoubleTick</h1>
                <span className="cl-count-pill">{filteredAndSortedCustomers.length.toLocaleString()}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>All Customers</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="cl-controls">
            <div className="cl-search-wrap">
              <img src={SearchIcon} alt="search" className="cl-search-icon" />
              <input
                className="cl-input"
                type="text"
                placeholder="Search Customers"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Simple select-based filters (placeholder) */}
            <button className="cl-filter-btn">
              <img src={FilterIcon} alt="filter" style={{ width: 16, height: 16, marginRight: 8 }} />
              Add Filters
            </button>
          </div>

          {/* Results count */}
          <p className="cl-count">Showing {filteredAndSortedCustomers.length.toLocaleString()} customers</p>
        </div>
      </div>

      {/* Table Container with Virtual Scrolling */}
      <div ref={parentRef} className="cl-table-wrap" style={{ contain: 'strict' }}>
        <div className="cl-table-card">
          {/* Header row (sticky) */}
          <div className="cl-header-row">
            <div className="cl-col-id"><span className="cl-col-btn">ID</span></div>
            <div className="cl-col-name"><button onClick={() => handleSort('name')} className="cl-col-btn">Name <span className="sort-icon">{getSortIcon('name')}</span></button></div>
            <div className="cl-col-email"><button onClick={() => handleSort('email')} className="cl-col-btn">Email <span className="sort-icon">{getSortIcon('email')}</span></button></div>
            <div className="cl-col-phone"><button onClick={() => handleSort('phone')} className="cl-col-btn">Phone <span className="sort-icon">{getSortIcon('phone')}</span></button></div>
            <div className="cl-col-score"><button onClick={() => handleSort('score')} className="cl-col-btn">Score <span className="sort-icon">{getSortIcon('score')}</span></button></div>
            <div className="cl-col-last"><button onClick={() => handleSort('lastMessageAt')} className="cl-col-btn">Last Message <span className="sort-icon">{getSortIcon('lastMessageAt')}</span></button></div>
            <div className="cl-col-added"><button onClick={() => handleSort('addedBy')} className="cl-col-btn">Added By <span className="sort-icon">{getSortIcon('addedBy')}</span></button></div>
          </div>

          <div className="cl-table-body">
            {/* Spacer to make scrollbar size match total virtualized height */}
            <div className="cl-spacer" style={{ height: `${rowVirtualizer.getTotalSize()}px` }} />

            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const customer = filteredAndSortedCustomers[virtualRow.index];
              return (
                <div
                  key={customer.id}
                  ref={rowVirtualizer.measureElement}
                  className="cl-row"
                  data-index={virtualRow.index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div className="cl-col-id cl-cell">#{customer.id}</div>
                  <div className="cl-col-name cl-cell">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="avatar">
                        <img
                          src={customer.avatar}
                          alt={customer.name}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = AvatarFallbackAsset }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{customer.name}</span>
                        <span style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{customer.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="cl-col-email cl-cell">{customer.email}</div>
                  <div className="cl-col-phone cl-cell">{customer.phone}</div>
                  <div className="cl-col-score cl-cell">
                    <span className={`score-badge ${customer.score >= 80 ? 'score-high' : customer.score >= 50 ? 'score-mid' : 'score-low'}`}>
                      {customer.score}
                    </span>
                  </div>
                  <div className="cl-col-last cl-cell">{formatDate(customer.lastMessageAt)}</div>
                  <div className="cl-col-added cl-cell">{customer.addedBy}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}