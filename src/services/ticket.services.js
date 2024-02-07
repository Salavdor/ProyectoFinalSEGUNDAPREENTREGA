import Services from "./class.services.js";
import factory from "../daos/factory.js";
const { ticketDao } = factory;
// Repository dependences //
import TicketDTO from "../dtos/ticket.dto.js";

export default class TicketService extends Services {
  constructor() {
    super(ticketDao);
  }

  async getTicket() {
    try {
      let result = await ticketDao.get();
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getTicketById(tid) {
    try {
      let result = await ticketDao.getById(tid);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createTicket(ticket) {
    try {
      let result = await ticketDao.create(ticket);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
