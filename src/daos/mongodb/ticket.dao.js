import MongoDao from "./mongo.dao.js";
import { ticketModel } from "./models/ticket.model.js";

export default class TicketDaoMongo extends MongoDao {
    constructor() {
        super(ticketModel);
    }

    async get(){
        try {
            let result = await ticketModel.find().populate('products.product')
            return result
        } catch (error) {
          console.log(error)
          throw new Error(error)
        }
      }

      async getById(tid){
        try {
            let result = await ticketModel.findOne({_id: tid}).populate('products.product')
            return result
        } catch (error) {
          console.log(error)
          throw new Error(error)
        }
      }
};