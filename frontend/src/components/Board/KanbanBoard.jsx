import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Column from './Column';
import { STATUS_ORDER, canTransition, STATUS_LABELS } from '../../utils/transitions';
import { Loader2 } from 'lucide-react';

export default function KanbanBoard({ tickets, onMove, onDelete, loading }) {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const grouped = {};
  STATUS_ORDER.forEach((s) => (grouped[s] = []));
  tickets.forEach((t) => {
    if (grouped[t.status]) grouped[t.status].push(t);
  });

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const ticketId = active.id;
    const fromStatus = active.data.current?.status;
    const toStatus = over.id;

    if (fromStatus === toStatus) return;

    if (!canTransition(fromStatus, toStatus)) {
      toast.error(
        `Cannot move from ${STATUS_LABELS[fromStatus]} to ${STATUS_LABELS[toStatus]}`,
        { duration: 2500, style: { fontSize: '13px' } }
      );
      return;
    }

    onMove(ticketId, toStatus);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATUS_ORDER.map((status) => (
          <Column
            key={status}
            status={status}
            tickets={grouped[status]}
            onMove={onMove}
            onDelete={onDelete}
          />
        ))}
      </div>
      <DragOverlay dropAnimation={null}>
        {activeId ? (
          <div className="glass-card p-3 shadow-2xl rotate-2 opacity-90 max-w-[280px]">
            <p className="text-sm font-semibold truncate">
              {tickets.find((t) => t._id === activeId)?.subject || 'Ticket'}
            </p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
