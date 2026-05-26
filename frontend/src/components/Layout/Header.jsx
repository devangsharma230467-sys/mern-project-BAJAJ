import { Plus, Sun, Moon, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Header({ onCreateClick }) {
  const { dark, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-30 glass-surface border-b border-slate-200/60 dark:border-slate-700/40">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center shadow-md shadow-indigo-500/25">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">DeskFlow</h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
              Helpdesk Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-500" />}
          </button>
          <button onClick={onCreateClick} className="btn-primary">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Ticket</span>
          </button>
        </div>
      </div>
    </header>
  );
}
