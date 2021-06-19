const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid")
            }
        }
    },
    gender : {
        type : String,
        required : true
    }, 
    date : {
        type : Date, 
        default : Date.now
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;