import { useDroppable } from '@dnd-kit/core';
import TicketCard from './TicketCard';
import { STATUS_COLORS } from '../../utils/formatters';
import { STATUS_LABELS } from '../../utils/transitions';

export default function Column({ status, tickets, onMove, onDelete }) {
  const { isOver, setNodeRef } = useDroppable({ id: status });
  const colors = STATUS_COLORS[status];

  return (
    <div className="flex flex-col min-w-[280px] flex-1">
      {/* Column header */}
      <div className={`flex items-center gap-2.5 px-3 py-2.5 mb-3 rounded-xl ${colors.bg} border-l-[3px] ${colors.accent}`}>
        <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
        <h2 className={`text-sm font-bold ${colors.text}`}>
          {STATUS_LABELS[status]}
        </h2>
        <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
          {tickets.length}
        </span>
      </div>

      {/* Droppable area */}
      <div
        ref={setNodeRef}
        className={`column-drop-zone flex-1 ${isOver ? 'column-drop-active' : ''}`}
      >
        {tickets.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-xs text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700/50 rounded-xl">
            No tickets
          </div>
        ) : (
          tickets.map((ticket) => (
            <TicketCard
              key={ticket._id}
              ticket={ticket}
              onMove={onMove}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
