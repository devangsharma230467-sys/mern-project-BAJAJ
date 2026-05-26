const ticketService = require('../services/ticketService');

exports.createTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.create(req.body);
    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
};

exports.getTickets = async (req, res, next) => {
  try {
    const { status, priority, breached } = req.query;
    const tickets = await ticketService.getAll({ status, priority, breached });
    res.json({ success: true, count: tickets.length, data: tickets });
  } catch (err) {
    next(err);
  }
};

exports.updateTicket = async (req, res, next) => {
  try {
    const result = await ticketService.update(req.params.id, req.body);
    if (result.error) {
      return res.status(result.status).json({ success: false, error: result.error });
    }
    res.json({ success: true, data: result.data });
  } catch (err) {
    next(err);
  }
};

exports.deleteTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.remove(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }
    res.json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const stats = await ticketService.getStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};
