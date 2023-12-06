import mongoose from "mongoose";

// const connectionString = "mongodb://127.0.0.1:27017/farmacia";
const connectionString = "mongodb+srv://Admin:5kSTLCIRxPS3kZzS@coderhouse.9tlb0vq.mongodb.net/?retryWrites=true&w=majority";

export const initMongoDB = async () => {
  try {
    await mongoose.connect(connectionString);
    console.log("Conectado a la base de datos de MongoDB");
  } catch (error) {
    console.log(`ERROR => ${error}`);
  }
};
