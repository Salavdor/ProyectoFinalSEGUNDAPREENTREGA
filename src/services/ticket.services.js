import Services from "./class.services.js";
import factory from "../daos/factory.js";
const { prodDao } = factory;
// Repository dependences //
import TicketDTO from "../dtos/ticket.dto.js";

export default class TicketService extends Services {
  constructor() {
    super(prodDao);
  }

  async getTicket() {
    try {
      let result = await prodDao.get()
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async getTicketById(tid) {
    try {
      let result = await prodDao.getById(tid)
      return result
    } catch (error) {
      console.log(error);
    }
  }

  async createTicket(ticket) {
    try {
    let ticketToInsert = new TicketDTO(ticket)
      let result = await prodDao.create(ticketToInsert)
      return result
    } catch (error) {
      console.log(error);
    }
  }

}
