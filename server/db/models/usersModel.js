const mongoose = require("mongoose");
var mSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true,
        trim: true
    },
    Password: {
        type: String,
        required: true,
        trim: true
    },
    FirstName: {
        type: String,
    },
    LastName: {
        type: String,
    },
    SendBirdId: {
        type: String,
    },
    StatusText: {
        type: String,
    },
    ProfilePic: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
    },
    Channels:{
        type: Array,
    }
}, {
    versionKey: false // You should be aware of the outcome after set to false
});
const mUsers = mongoose.model("Users", mSchema, "Users")

module.exports = mUsers