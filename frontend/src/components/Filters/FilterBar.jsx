import { Filter, X } from 'lucide-react';

const priorities = ['all', 'urgent', 'high', 'medium', 'low'];

export default function FilterBar({ filters, onFilterChange }) {
  const activePriority = filters.priority || 'all';
  const breachedActive = filters.breached === 'true';

  const setPriority = (p) => {
    const next = { ...filters };
    if (p === 'all') {
      delete next.priority;
    } else {
      next.priority = p;
    }
    onFilterChange(next);
  };

  const toggleBreached = () => {
    const next = { ...filters };
    if (breachedActive) {
      delete next.breached;
    } else {
      next.breached = 'true';
    }
    onFilterChange(next);
  };

  const hasFilters = filters.priority || filters.breached;

  const clearAll = () => onFilterChange({});

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mr-1">
        <Filter className="w-3.5 h-3.5" />
        <span className="font-medium">Filters</span>
      </div>

      {priorities.map((p) => (
        <button
          key={p}
          onClick={() => setPriority(p)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-150 ${
            activePriority === p
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          {p}
        </button>
      ))}

      <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />

      <button
        onClick={toggleBreached}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
          breachedActive
            ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        SLA Breached
      </button>

      {hasFilters && (
        <button
          onClick={clearAll}
          className="ml-auto flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          <X className="w-3 h-3" />
          Clear
        </button>
      )}
    </div>
  );
}
