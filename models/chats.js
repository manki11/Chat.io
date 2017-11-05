var mongoose = require("mongoose");

var ChatSchema= new mongoose.Schema({
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    message: String
});

module.exports= mongoose.model("Chat", ChatSchema);