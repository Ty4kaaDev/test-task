import { model, Schema } from "mongoose";

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
    status: { type: String, required: true, default: 'New' },
    solution: { type: String },
    cancellationReason: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export const Appeal = model<ITicket>('Ticket', TicketSchema);