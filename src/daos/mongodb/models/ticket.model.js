import { Schema, model } from 'mongoose';

export const ticketSchema = new Schema({
    code: Number,
    purchase_datetime: String,
    amount: Number,
    purchaser: String,
    products: []
});

export const TicketModel = model(
  'ticket',
  ticketSchema
);