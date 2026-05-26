import { Inbox, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

const statItems = [
  { key: 'total', label: 'Total', icon: Inbox, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-500/15' },
  { key: 'open', label: 'Open', icon: Clock, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-500/15' },
  { key: 'resolved', label: 'Resolved', icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/15' },
  { key: 'breached', label: 'SLA Breached', icon: AlertTriangle, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-500/15' },
];

export default function StatsStrip({ stats, loading }) {
  const getValue = (key) => {
    if (!stats) return '—';
    if (key === 'total') return stats.total;
    if (key === 'open') return stats.byStatus?.open ?? 0;
    if (key === 'resolved') return stats.byStatus?.resolved ?? 0;
    if (key === 'breached') return stats.breached ?? 0;
    return 0;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {statItems.map(({ key, label, icon: Icon, color, bg }) => (
        <div key={key} className="glass-card p-4 flex items-center gap-3 animate-fade-in">
          <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {label}
            </p>
            <p className={`text-xl font-bold ${loading ? 'animate-pulse' : ''}`}>
              {loading ? '...' : getValue(key)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
