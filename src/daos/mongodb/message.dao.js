import { messageModel } from "./models/message.model.js";

export default class messageDaoMongoDB {
  async getAll() {
    try {
      const response = await messageModel.find();
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  async createMessage(msg) {
    try {
      const response = await messageModel.create(msg)
      return response;
    } catch (error) {
        console.log(error)
    }
  }
}
