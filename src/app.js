const express = require("express")
const app = express();
const hbs = require("hbs")
const port = process.env.PORT|3000
const bodyParse = require("body-parser")
const multer = require("multer")
const path = require("path")
var formidable = require("formidable");
var fs = require("fs");
app.use("/statics",express.static("public"))
const routes = require("./routes/main")
const fileupload = require("express-fileupload")
require('dotenv').config()
const cloudinary = require("cloudinary").v2;

const Signup = require("./models/signup")

// database
require("./models/database")

// engine tempelete
app.set("view engine","hbs")
app.set("views","views")
hbs.registerPartials("views/partials")


cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_KEY, 
    api_secret: process.env.CLOUD_SECRET_KEY,
    secure:true
});



app.use(bodyParse.urlencoded({
    extended:true
}))
app.use("",routes);

app.listen(port,()=>{
    console.log(`Server started ${port}`);
})