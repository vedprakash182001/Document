const mongoose = require("mongoose")
const validator = require("validator");
const Signup = mongoose.Schema({
    username:String,
    useremail:{
        type : String,
        required :true,
        unique : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email");
            }
        }
    },
    userpassword:String,
    imageurl :[
        {
            imagename:String,
            imagelink:String
        }
    ]
})

module.exports = mongoose.model("signup",Signup);