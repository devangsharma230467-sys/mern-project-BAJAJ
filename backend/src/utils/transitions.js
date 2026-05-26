// Defines the ticket state machine.
// Each key maps to an array of statuses it can transition to.
const ALLOWED_TRANSITIONS = {
  open: ['in_progress'],
  in_progress: ['resolved', 'open'],
  resolved: ['closed', 'in_progress'],
  closed: [],
};

function isValidTransition(from, to) {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

function getTransitionError(from, to) {
  if (from === to) return `Ticket is already "${from}"`;
  if (from === 'closed') return 'Closed tickets cannot be modified';
  if (from === 'open' && to === 'resolved')
    return 'Cannot resolve directly — move to in_progress first';
  if (from === 'open' && to === 'closed')
    return 'Cannot close directly from open';
  if (from === 'in_progress' && to === 'closed')
    return 'Cannot close from in_progress — resolve it first';
  return `Transition from "${from}" to "${to}" is not allowed`;
}

module.exports = { ALLOWED_TRANSITIONS, isValidTransition, getTransitionError };
