// SLA thresholds in minutes per priority
const SLA_LIMITS = {
  urgent: 60,    // 1 hour
  high: 240,     // 4 hours
  medium: 1440,  // 24 hours
  low: 4320,     // 72 hours
};

/**
 * Calculates age in minutes.
 * For resolved/closed tickets, age stops at resolvedAt.
 */
function getAgeMinutes(ticket) {
  const start = new Date(ticket.createdAt);
  const end = ticket.resolvedAt ? new Date(ticket.resolvedAt) : new Date();
  return Math.floor((end - start) / 60000);
}

function isSlaBreached(ticket) {
  return getAgeMinutes(ticket) > SLA_LIMITS[ticket.priority];
}

/** Attaches derived ageMinutes and slaBreached to a ticket object */
function enrichTicket(ticket) {
  const obj = ticket.toObject ? ticket.toObject() : { ...ticket };
  obj.ageMinutes = getAgeMinutes(obj);
  obj.slaBreached = isSlaBreached(obj);
  return obj;
}

module.exports = { SLA_LIMITS, getAgeMinutes, isSlaBreached, enrichTicket };
