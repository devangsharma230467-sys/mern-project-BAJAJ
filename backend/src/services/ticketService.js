const Ticket = require('../models/Ticket');
const { enrichTicket } = require('../utils/sla');
const { isValidTransition, getTransitionError } = require('../utils/transitions');

class TicketService {
  async create(data) {
    const ticket = await Ticket.create(data);
    return enrichTicket(ticket);
  }

  async getAll(filters = {}) {
    const query = {};
    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;

    let tickets = await Ticket.find(query).sort({ createdAt: -1 });
    let result = tickets.map(enrichTicket);

    // breached is a derived field — filter after enrichment
    if (filters.breached === 'true') {
      result = result.filter((t) => t.slaBreached);
    }
    return result;
  }

  async getById(id) {
    const ticket = await Ticket.findById(id);
    return ticket ? enrichTicket(ticket) : null;
  }

  async update(id, updates) {
    const ticket = await Ticket.findById(id);
    if (!ticket) return { error: 'Ticket not found', status: 404 };

    // Handle status transitions
    if (updates.status && updates.status !== ticket.status) {
      if (!isValidTransition(ticket.status, updates.status)) {
        return {
          error: getTransitionError(ticket.status, updates.status),
          status: 400,
        };
      }

      if (updates.status === 'resolved') {
        ticket.resolvedAt = new Date();
      }

      // Moving backward from resolved clears resolvedAt
      if (ticket.status === 'resolved' && updates.status === 'in_progress') {
        ticket.resolvedAt = null;
      }

      ticket.status = updates.status;
    }

    // Update editable fields
    const editable = ['subject', 'description', 'priority', 'customerEmail'];
    editable.forEach((field) => {
      if (updates[field] !== undefined) ticket[field] = updates[field];
    });

    await ticket.save();
    return { data: enrichTicket(ticket) };
  }

  async remove(id) {
    const ticket = await Ticket.findByIdAndDelete(id);
    return ticket ? enrichTicket(ticket) : null;
  }

  async getStats() {
    const tickets = await Ticket.find();
    const enriched = tickets.map(enrichTicket);

    const stats = {
      total: enriched.length,
      byStatus: { open: 0, in_progress: 0, resolved: 0, closed: 0 },
      byPriority: { low: 0, medium: 0, high: 0, urgent: 0 },
      breached: 0,
      avgResolutionMinutes: null,
    };

    const resTimes = [];

    enriched.forEach((t) => {
      stats.byStatus[t.status]++;
      stats.byPriority[t.priority]++;
      if (t.slaBreached) stats.breached++;
      if (t.resolvedAt) {
        resTimes.push(
          Math.floor((new Date(t.resolvedAt) - new Date(t.createdAt)) / 60000)
        );
      }
    });

    if (resTimes.length) {
      stats.avgResolutionMinutes = Math.round(
        resTimes.reduce((a, b) => a + b, 0) / resTimes.length
      );
    }

    return stats;
  }
}

module.exports = new TicketService();
