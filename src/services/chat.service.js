import messageDaoMongoDB from "../daos/mongodb/message.dao.js";

const message = new messageDaoMongoDB();

export const getAll = async () => {
  try {
    const mensajes = await message.getAll();
    return mensajes;
  } catch (error) {
    console.log(error);
  }
};

export const createMessage = async (msg) => {
  try {
    const mensaje = await message.createMessage(msg);
    return mensaje;
  } catch (error) {
    console.log(error);
  }
};
