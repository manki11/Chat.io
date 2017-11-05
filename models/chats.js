var mongoose = require("mongoose");

var ChatSchema= new mongoose.Schema({
    username: String,
    message: String
});

module.exports= mongoose.model("Chat", ChatSchema);