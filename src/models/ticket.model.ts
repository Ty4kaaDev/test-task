import { model, Schema } from "mongoose";

export enum Status {
    NEW = "NEW",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export interface ITicket extends Document {
    topic: string;
    text: string;
    status: string;
    solution?: string;
    cancellationReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

const TicketSchema = new Schema<ITicket>({
    topic: { type: String, required: true },
    text: { type: String, required: true },
    status: { type: String, required: true, default: Status.NEW },
    solution: { type: String },
    cancellationReason: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export const Ticket = model<ITicket>('Ticket', TicketSchema);