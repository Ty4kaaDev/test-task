import { Request, Response } from 'express';
import * as ticketService from '../services/ticket.service';
import { createTicketSchema, completeTicketSchema, cancelTicketSchema, getTicketsSchema } from '../validators/ticketValidator';
import { ErrorHandlerDecorator } from '../decorators/errorHandler.decorator';

class TicketController {
    @ErrorHandlerDecorator
    async createTicket(req: Request, res: Response): Promise<void> {
        const { topic, text } = createTicketSchema.parse(req.body);
        const ticket = await ticketService.createTicket(topic, text);
        res.status(201).json(ticket);
    }

    @ErrorHandlerDecorator
    async takeTicketToWork(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const ticket = await ticketService.takeTicketToWork(id);
        if (ticket) {
            res.status(200).json(ticket);
        } else {
            res.status(404).json({ message: 'Ticket not found' });
        }
    }

    @ErrorHandlerDecorator
    async completeTicket(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { solution } = completeTicketSchema.parse(req.body);
        const ticket = await ticketService.completeTicket(id, solution);
        if (ticket) {
            res.status(200).json(ticket);
        } else {
            res.status(404).json({ message: 'Ticket not found' });
        }
    }

    @ErrorHandlerDecorator
    async cancelTicket(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { cancellationReason } = cancelTicketSchema.parse(req.body);
        const ticket = await ticketService.cancelTicket(id, cancellationReason);
        if (ticket) {
            res.status(200).json(ticket);
        } else {
            res.status(404).json({ message: 'Ticket not found' });
        }
    }

    @ErrorHandlerDecorator
    async getTickets(req: Request, res: Response): Promise<void> {
        const { startDate, endDate } = getTicketsSchema.parse(req.query);
        const tickets = await ticketService.getTickets(
            startDate ? new Date(startDate as string) : undefined,
            endDate ? new Date(endDate as string) : undefined
        );
        res.status(200).json(tickets);
    }

    @ErrorHandlerDecorator
    async cancelAllInProgressTickets(req: Request, res: Response): Promise<void> {
        await ticketService.cancelAllInProgressTickets();
        res.status(200).json({ message: 'All in-progress tickets have been canceled' });
    }
}

export default new TicketController();