const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://alihacker8ballpool2:4uX5LlmbRonHmDLf@cluster0.sa4di5e.mongodb.net/?retryWrites=true&w=majority', {
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
