const mongoose = require('mongoose');
const config = require('../config/index.config');

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(config.MONGO_URI, {});
        console.log(`MongoDB Connected 💽: ${connection.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB Atlas: ${error.message}`);
        process.exit(1); 
    }
};

module.exports = connectDB;
