import mongoose from "mongoose";

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("Database is connected")
    } catch (error) {
        console.log(`Error: ${error.message}`)
        process.exit(1)
    }
}

// const closeConnection = async () => {
//     try {
//       await mongoose.connection.close();
//       console.log('MongoDB connection closed');
//     } catch (err) {
//       console.error('Error closing MongoDB connection:', err);
//     }
//   };
  
// process.on('SIGINT', closeConnection);
// process.on('SIGTERM', closeConnection);

export default connectDB;