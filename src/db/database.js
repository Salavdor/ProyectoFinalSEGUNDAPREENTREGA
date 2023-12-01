import mongoose from 'mongoose';

const connectionString = 'mongodb://127.0.0.1:27017/farmacia';

  try {
    await mongoose.connect(connectionString);
    console.log('Conectado a la base de datos de MongoDB');
  } catch (error) {
    console.log(`ERROR => ${error}`);
  }
