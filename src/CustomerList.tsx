import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { type Customer } from './lib/data';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import Logo from './assets/Doubletick Logo.png'
import SearchIcon from './assets/test_Search-3.svg'
import FilterIcon from './assets/test_Filter.svg'
import CustomerRow from './CustomerRow';
import CustomerHeader from './CustomerHeader';

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
  const [loadedCount, setLoadedCount] = useState(30); // 30 rows per page
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<Record<number, boolean>>({});

  // reference for the scrollable container
  const parentRef = useRef<HTMLDivElement>(null);
  // debounce search input at 250ms as given in the assign
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // filter and sort customers
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

  // handle sorting when header clicked
  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      if (sortOrder === 'asc') setSortOrder('desc');
      else if (sortOrder === 'desc') { setSortOrder(null); setSortField(null); }
    } else {
      setSortField(field); setSortOrder('asc');
    }
  }, [sortField, sortOrder]);

  // pagination: 30 rows per page, load more on scroll
  useEffect(() => {
    setLoadedCount(30);
  }, [filteredAndSortedCustomers.length]);

  const displayedCustomers = filteredAndSortedCustomers.slice(0, loadedCount);

  // virtualizer setup for displayed items
  const rowVirtualizer = useVirtualizer({
    count: displayedCustomers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 6,
  });

  // load more on scroll (when near bottom of scroll container)
  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;
    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const bottom = el.scrollHeight - el.scrollTop - el.clientHeight;
        if (bottom < 400 && loadedCount < filteredAndSortedCustomers.length) {
          setLoadedCount((c) => Math.min(c + 30, filteredAndSortedCustomers.length));
        }
      });
    };
    el.addEventListener('scroll', onScroll);
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [parentRef, loadedCount, filteredAndSortedCustomers.length]);

  // selection helpers
  const toggleSelect = (id: number) => setSelected((s) => ({ ...s, [id]: !s[id] }));
  const selectAll = () => {
    const allSelected = displayedCustomers.every((c) => selected[c.id]);
    if (allSelected) {
      setSelected((s) => {
        const copy = { ...s };
        displayedCustomers.forEach((c) => delete copy[c.id]);
        return copy;
      });
    } else {
      setSelected((s) => {
        const copy = { ...s };
        displayedCustomers.forEach((c) => (copy[c.id] = true));
        return copy;
      });
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="sort-icon" />;
    if (sortOrder === 'asc') return <ArrowUp className="sort-icon" />;
    return <ArrowDown className="sort-icon" />;
  };

  return (
    <div className="cl-root">
      {/* Header */}
      <div className="cl-header">
        <div className="cl-container">
          <div className="cl-header-grid">
            <div className="cl-logo-col">
              <img src={Logo} alt="DoubleTick" className="cl-logo" />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="cl-all-customers">All Customers</div>
                <span className='score-badge'>
                      {filteredAndSortedCustomers.length.toLocaleString()}
                </span>
                
                {/* <span className="cl-count-pill">{filteredAndSortedCustomers.length.toLocaleString()}</span> */}
              </div>
            </div>
            <div className="cl-title-col">
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

            {/* Filters dropdown (static only) */}
            <div style={{ position: 'relative' }}>
              <button className="cl-filter-btn" onClick={() => setFiltersOpen((s) => !s)}>
                <img src={FilterIcon} alt="filter" style={{ width: 16, height: 16 }} />
                <span style={{ marginLeft: 8 }}>Add Filters</span>
              </button>
              {filtersOpen && (
                <div className="cl-filter-menu" role="menu">
                  <div className="cl-filter-item">Filter 1</div>
                  <div className="cl-filter-item">Filter 2</div>
                  <div className="cl-filter-item">Filter 3</div>
                  <div className="cl-filter-item">Filter 4</div>
                </div>
              )}
            </div>
          </div>

          {/* Results count */}
          <p className="cl-count">Showing {filteredAndSortedCustomers.length.toLocaleString()} customers</p>
        </div>
      </div>

      {/* Table Container with Virtual Scrolling */}
      <div ref={parentRef} className="cl-table-wrap" style={{ contain: 'strict' }}>
        <div className="cl-table-card">
          {/* Header row (sticky) */}
          <CustomerHeader handleSort={handleSort} getSortIcon={getSortIcon} selectAll={selectAll} />

          <div className="cl-table-body">
            {/* Spacer to make scrollbar size match total virtualized height */}
            <div className="cl-spacer" style={{ height: `${rowVirtualizer.getTotalSize()}px` }} />

            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const customer = displayedCustomers[virtualRow.index];
              return (
                <CustomerRow
                  key={customer.id}
                  ref={rowVirtualizer.measureElement}
                  customer={customer}
                  isSelected={!!selected[customer.id]}
                  onToggleSelect={toggleSelect}
                  style={{ transform: `translateY(${virtualRow.start}px)` }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}