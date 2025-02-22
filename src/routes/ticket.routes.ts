import { Router } from 'express';
import TicketController from '../controllers/ticket.controller';

const router = Router();

router.post('/tickets', TicketController.createTicket);
router.put('/tickets/:id/take-to-work', TicketController.takeTicketToWork);
router.put('/tickets/:id/complete', TicketController.completeTicket);
router.put('/tickets/:id/cancel', TicketController.cancelTicket);
router.get('/tickets', TicketController.getTickets);
router.post('/tickets/cancel-all-in-progress', TicketController.cancelAllInProgressTickets);

export default router;