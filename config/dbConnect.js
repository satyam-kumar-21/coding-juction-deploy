const mongoose = require("mongoose");
require('dotenv').config();

const DB_URL = process.env.DB_URL;

const connectToDb = async () => {
    try {
        const conn = await mongoose.connect(DB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("Error in database connection");
        console.log(error.message);
        process.exit();
    }
};


module.exports = connectToDb;
