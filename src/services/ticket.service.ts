import { Ticket, ITicket, Status } from '../models/ticket.model';
import logger from '../utils/logger';

/**
 * Создает новое обращение.
 * @param topic - Тема обращения.
 * @param text - Текст обращения.
 * @returns Созданное обращение.
 * @throws Ошибка, если не удалось создать обращение.
 */
export const createTicket = async (topic: string, text: string): Promise<ITicket> => {
    try {
        const ticket = new Ticket({ topic, text });
        await ticket.save();
        logger.info(`Ticket created: ${ticket._id}`);
        return ticket;
    } catch (err: any) {
        logger.error(`Failed to create ticket: ${err.message}`);
        throw new Error('Failed to create ticket');
    }
};

/**
 * Берет обращение в работу.
 * @param id - ID обращения.
 * @returns Обновленное обращение.
 * @throws Ошибка, если обращение не найдено.
 */
export const takeTicketToWork = async (id: string): Promise<ITicket | null> => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(
            id,
            { status: Status.IN_PROGRESS },
            { new: true }
        );
        if (!ticket) {
            logger.warn(`Ticket not found: ${id}`);
            throw new Error('Ticket not found');
        }
        logger.info(`Ticket taken to work: ${id}`);
        return ticket;
    } catch (err: any) {
        logger.error(`Failed to take ticket to work: ${err.message}`);
        throw new Error('Failed to take ticket to work');
    }
};

/**
 * Завершает обработку обращения.
 * @param id - ID обращения.
 * @param solution - Текст решения проблемы.
 * @returns Обновленное обращение.
 * @throws Ошибка, если обращение не найдено.
 */
export const completeTicket = async (id: string, solution: string): Promise<ITicket | null> => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(
            id,
            { status: Status.COMPLETED, solution },
            { new: true }
        );
        if (!ticket) {
            logger.warn(`Ticket not found: ${id}`);
            throw new Error('Ticket not found');
        }
        logger.info(`Ticket completed: ${id}`);
        return ticket;
    } catch (err: any) {
        logger.error(`Failed to complete ticket: ${err.message}`);
        throw new Error('Failed to complete ticket');
    }
};

/**
 * Отменяет обращение.
 * @param id - ID обращения.
 * @param cancellationReason - Причина отмены.
 * @returns Обновленное обращение.
 * @throws Ошибка, если обращение не найдено.
 */
export const cancelTicket = async (id: string, cancellationReason: string): Promise<ITicket | null> => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(
            id,
            { status: Status.CANCELLED, cancellationReason },
            { new: true }
        );
        if (!ticket) {
            logger.warn(`Ticket not found: ${id}`);
            throw new Error('Ticket not found');
        }
        logger.info(`Ticket canceled: ${id}`);
        return ticket;
    } catch (err: any) {
        logger.error(`Failed to cancel ticket: ${err.message}`);
        throw new Error('Failed to cancel ticket');
    }
};

/**
 * Получает список обращений с возможностью фильтрации по дате.
 * @param startDate - Начальная дата фильтрации (опционально).
 * @param endDate - Конечная дата фильтрации (опционально).
 * @returns Список обращений.
 * @throws Ошибка, если не удалось получить обращения.
 */
export const getTickets = async (startDate?: Date, endDate?: Date): Promise<ITicket[]> => {
    try {
        const filter: any = {};
        if (startDate && endDate) {
            filter.createdAt = { $gte: startDate, $lte: endDate };
        } else if (startDate) {
            filter.createdAt = { $gte: startDate };
        } else if (endDate) {
            filter.createdAt = { $lte: endDate };
        }
        const tickets = await Ticket.find(filter);
        logger.info(`Fetched ${tickets.length} tickets`);
        return tickets;
    } catch (err: any) {
        logger.error(`Failed to fetch tickets: ${err.message}`);
        throw new Error('Failed to fetch tickets');
    }
};

/**
 * Отменяет все обращения, которые находятся в статусе "В работе".
 * @throws Ошибка, если не удалось отменить обращения.
 */
export const cancelAllInProgressTickets = async (): Promise<void> => {
    try {
        const result = await Ticket.updateMany(
            { status: Status.IN_PROGRESS },
            { status: Status.CANCELLED }
        );
        logger.info(`Canceled ${result.modifiedCount} in-progress tickets`);
    } catch (err: any) {
        logger.error(`Failed to cancel in-progress tickets: ${err.message}`);
        throw new Error('Failed to cancel in-progress tickets');
    }
};