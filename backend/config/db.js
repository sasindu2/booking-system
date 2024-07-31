// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://sasindu:Sasindu1234@cluster1.gbslery.mongodb.net/service?retryWrites=true&w=majority&appName=Cluster1');
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
