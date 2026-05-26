import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { useTickets } from './hooks/useTickets';
import Header from './components/Layout/Header';
import StatsStrip from './components/Layout/StatsStrip';
import FilterBar from './components/Filters/FilterBar';
import KanbanBoard from './components/Board/KanbanBoard';
import CreateTicketForm from './components/Forms/CreateTicketForm';
import { AlertCircle } from 'lucide-react';

function Dashboard() {
  const {
    tickets, stats, loading, error,
    filters, setFilters,
    createTicket, updateTicket, deleteTicket,
  } = useTickets();

  const [showForm, setShowForm] = useState(false);

  const handleMove = async (id, newStatus) => {
    try {
      await updateTicket(id, { status: newStatus });
      toast.success(`Ticket moved to ${newStatus.replace('_', ' ')}`, { duration: 2000 });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update ticket');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTicket(id);
      toast.success('Ticket deleted');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete ticket');
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-200">
      <Header onCreateClick={() => setShowForm(true)} />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
        <StatsStrip stats={stats} loading={loading} />
        <FilterBar filters={filters} onFilterChange={setFilters} />

        {error && (
          <div className="flex items-center gap-2 p-4 mb-6 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <KanbanBoard
          tickets={tickets}
          onMove={handleMove}
          onDelete={handleDelete}
          loading={loading}
        />
      </main>

      {showForm && (
        <CreateTicketForm
          onClose={() => setShowForm(false)}
          onCreate={createTicket}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'text-sm',
          style: {
            borderRadius: '12px',
            background: 'var(--toast-bg, #1e293b)',
            color: 'var(--toast-color, #f1f5f9)',
            fontSize: '13px',
          },
        }}
      />
      <Dashboard />
    </ThemeProvider>
  );
}
