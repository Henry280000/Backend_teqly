const mongoose = require('mongoose');
const colors = require('colors');
const { MONGODB_URI } = require('./environment');

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(colors.green(`MongoDB conectado`));
  } catch (error) {
    console.error(colors.red(`Error MongoDB: ${error.message}`));
    process.exit(1);
  }
};

module.exports = connectDB;
