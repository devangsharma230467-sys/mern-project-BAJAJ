import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, ArrowRight, ArrowLeft, AlertTriangle, Clock } from 'lucide-react';
import { formatAge, PRIORITY_CONFIG } from '../../utils/formatters';
import { ALLOWED_TRANSITIONS, STATUS_LABELS } from '../../utils/transitions';

export default function TicketCard({ ticket, onMove, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: ticket._id,
    data: { status: ticket.status },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const pri = PRIORITY_CONFIG[ticket.priority];
  const transitions = ALLOWED_TRANSITIONS[ticket.status] || [];

  // Figure out which transitions are forward vs backward
  const statusOrder = ['open', 'in_progress', 'resolved', 'closed'];
  const currentIdx = statusOrder.indexOf(ticket.status);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`glass-surface p-3.5 group hover:shadow-md transition-all duration-200 ${
        isDragging ? 'shadow-xl ring-2 ring-indigo-400/40 z-50' : ''
      }`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            {...listeners}
            {...attributes}
            className="touch-none p-0.5 -ml-1 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
          <h3 className="text-sm font-semibold truncate">{ticket.subject}</h3>
        </div>
        <button
          onClick={() => onDelete(ticket._id)}
          className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* Priority + Age + SLA row */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${pri.bg} ${pri.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${pri.dot}`} />
          {pri.label}
        </span>

        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
          <Clock className="w-3 h-3" />
          {formatAge(ticket.ageMinutes)}
        </span>

        {ticket.slaBreached && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-semibold bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 animate-pulse-slow">
            <AlertTriangle className="w-3 h-3" />
            SLA
          </span>
        )}
      </div>

      {/* Transition buttons */}
      {transitions.length > 0 && (
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-700/40">
          {transitions.map((target) => {
            const targetIdx = statusOrder.indexOf(target);
            const isForward = targetIdx > currentIdx;
            return (
              <button
                key={target}
                onClick={() => onMove(ticket._id, target)}
                className={`btn-ghost ${
                  isForward
                    ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                    : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10'
                }`}
              >
                {isForward ? <ArrowRight className="w-3 h-3" /> : <ArrowLeft className="w-3 h-3" />}
                {STATUS_LABELS[target]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
