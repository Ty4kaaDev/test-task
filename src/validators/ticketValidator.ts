import { z } from 'zod';

export const createTicketSchema = z.object({
    topic: z.string().min(1, 'Topic is required'),
    text: z.string().min(1, 'Text is required'),
});

export const completeTicketSchema = z.object({
    solution: z.string().min(1, 'Solution is required'),
});

export const cancelTicketSchema = z.object({
    cancellationReason: z.string().min(1, 'Cancellation reason is required'),
});

export const getTicketsSchema = z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});