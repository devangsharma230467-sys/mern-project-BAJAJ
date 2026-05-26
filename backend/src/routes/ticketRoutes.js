const { Router } = require('express');
const ctrl = require('../controllers/ticketController');

const router = Router();

// Stats must be defined before the :id param route
router.get('/stats', ctrl.getStats);

router.route('/').get(ctrl.getTickets).post(ctrl.createTicket);

router.route('/:id').patch(ctrl.updateTicket).delete(ctrl.deleteTicket);

module.exports = router;
