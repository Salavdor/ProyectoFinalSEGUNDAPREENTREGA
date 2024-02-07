import MongoDao from "./mongo.dao.js";
import { TicketModel } from "./models/ticket.model.js";

export default class TicketDaoMongo extends MongoDao {
    constructor() {
        super(TicketModel);
    }

    async get(){
        try {
            let result = await TicketModel.find().populate('products.product')
            return result
        } catch (error) {
          console.log(error)
          throw new Error(error.message);
        }
      }

      async getById(tid){
        try {
            let result = await TicketModel.findOne({_id: tid}).populate('products.product')
            return result
        } catch (error) {
          console.log(error)
          throw new Error(error.message);
        }
      }
};