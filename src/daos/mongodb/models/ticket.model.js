import { Schema, model } from 'mongoose';

export const ticketSchema = new Schema({
  code: { 
    type: String, 
    required: true 
  },
  purchase_datetime: { 
    type: Date, 
    default: Date.now, 
    required: true },
  amount: { 
    type: Number, 
    required: true },
  purchaser: { 
    type: String, 
    required: true },
  products: []
});

export const TicketModel = model(
  'ticket',
  ticketSchema
);