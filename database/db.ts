import mongoose from 'mongoose';

// Solucion al error: Agregue esta línea aquí para establecer strictQuery en false
mongoose.set('strictQuery', false);

/**
 * 0 = disconnected
 * 1 = connected
 * 2 = connecting
 * 3 = disconnecting
 */
const mongoConnection = {
  isConnected: 0,
};

export const connect = async () => {
  if (mongoConnection.isConnected) {
    console.log('We were already connected to the database');
    return;
  }

  if (mongoose.connections.length > 0) {
    mongoConnection.isConnected = mongoose.connections[0].readyState;

    if (mongoConnection.isConnected === 1) {
      console.log('Using previous connection');
      return;
    }

    await mongoose.disconnect();
  }

  mongoose.set('strictQuery', false);
  await mongoose.connect(process.env.MONGO_URL || '');
  mongoConnection.isConnected = 1;
  console.log('Connected to MongoDB:');
};

export const disconnect = async () => {
  if (process.env.NODE_ENV === 'development') return;

  if (mongoConnection.isConnected === 0) return;

  await mongoose.disconnect();
  mongoConnection.isConnected = 0;

  console.log('Disconnected from MongoDB');
};
