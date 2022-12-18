const mongoose = require("mongoose")
const db = "mongodb://localhost:27017/project1"
mongoose.connect("mongodb://localhost:27017/project2",{
    useNewUrlParser :true,
}).then(()=>{
    console.log("Connection Successfull")
}).catch(()=>{
    console.log("No connection")
})