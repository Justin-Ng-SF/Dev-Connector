//to create model, create schema
const mongoose = require('mongoose');

//takes in object w/ all fields we want
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

//mongoose.model takes in 2 things, the model name, which is user, ands the UserSchema object we made ^^
module.exports = User = mongoose.model('user', UserSchema);