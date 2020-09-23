const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

//when using async, use try/catch block
const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        });//returns promise so use await

        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        //exits process w/ failure
        process.exit(1);
    }
}

module.exports = connectDB;