import mongoose from 'mongoose';

let isConnected = false;
// to track the connection status

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if(!process.env.MONGODB_URI) return console.log('mongodb uri is not defined');

  if(isConnected) return console.log('=> using existing db connection');

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    isConnected = true;
    console.log('mongodb connected');
    // using aaryank098@gmail.com for this site as a mongodb atlas cluster0

  } catch (error) {

  }
}