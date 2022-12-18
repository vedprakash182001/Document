const express = require("express")
const Signup = require("../models/signup")
const multer = require("multer")
const path = require("path")
const signup = require("../models/signup")
const { findOne } = require("../models/signup")
const { Sign } = require("crypto")
const bcrypt = require("bcryptjs")
const cloudinary = require("cloudinary").v2
var formidable = require("formidable");
var fs = require("fs");
const fileupload = require("express-fileupload")



var stat = false
var user = "login"
var userid = "222";
var success = ""
var upload1 = false


const routes = express.Router();
routes.get("",(req,res)=>{
    res.render("index",{
        stat : stat,
        username: user
    })
})

routes.use(fileupload({
    useTempFiles:true,
    tempFileDir:path.join(__dirname,("./temp"))
}))


routes.post("/upload", async (req,res)=>{
    try{
        const filename = req.files.foo
        const result = await cloudinary.uploader.upload(filename.tempFilePath,{
            folder:"Doc Images",
        })
        const name = req.body.fileName;
        const filelink = result.url;
        success = `Document ${name} uploaded successfully.`
        const temp = await Signup.findOneAndUpdate(
            { _id: userid}, 
            { $push: { imageurl: {
                imagename : name,
                imagelink : filelink
             } } },
            {
                new:true
            });
        upload1 = true;
        res.redirect("/document")
    }catch(err){
        res.send(err);
    }
})

// login action 

routes.get("/login",(req,res)=>{
    res.render("login",{
        error:"visually-hidden"
    })
})

routes.post("/login",async(req,res)=>{
    try{
        const inputemail = req.body.useremail;
        const inputpassword = req.body.userpassword;
        const data = await Signup.findOne({useremail:inputemail})
        const status = await bcrypt.compare(inputpassword,data.userpassword);
        if(status){
            stat = true;
            user = data.username;
            userid = data._id;
            res.render("index",{
                stat : stat,
                username: data.username
            })
        }else{
            const err = Object.create(error)
            res.render("login",{
                err:"visible",
                data :data
            })
        }
    }catch(err){
        res.render("login",{
            error:"visible"
        })
    }
})


// Logout Action

routes.get("/logout",(req,res)=>{
    stat = false
    username = "login";
    res.render("index",{
        stat : stat,
        username: "login"
    })
})

// sign up action 

routes.get("/signup",(req,res)=>{
    const error = false
    const error1 = false
    res.render("signup",{
        error : error
    })
})

routes.post("/signup",async(req,res)=>{
    try{
        const temp = req.body
        var pass = await bcrypt.hash(temp.userpassword,10);
        const data = await Signup.create({
            username : temp.username,
            useremail : temp.useremail,
            userpassword : pass
        })
        data.save();
        res.redirect("/login")
    }catch(err){
        const error = true
        const error1 = false
        res.render("signup",{
            error : error,
            error1:error1
        })
    }
})

// document action

routes.get("/document",async(req,res)=>{
    try{
        if(stat){
            var totalimg = await Signup.findOne({_id:userid})
        }else{
            var totalimg = ""
        }
        if(!upload1){
            success = ""
        }
        upload1 = false
        // console.log(success)
        res.render("document",{
            stat:stat,
            username:user,
            totalimg:totalimg,
            success:success
        })
    }catch(err){
        console.log(err)
        res.send(err)
    }
})

routes.post("/delete",async(req,res)=>{
        const deleid = req.body.imgid;
        const delnam = req.body.imgnam;
        success = `Document ${delnam} deleted successfully.`;
        upload1 = true;
        try{
            Signup.findOneAndUpdate(
                { _id: userid}, 
                { $pull: { imageurl: { imagelink: deleid} } },
                {
                    new:true
                },
                (err,data)=>{
                    if(err){
                        console.log(err)  
                        res.send(err)
                    }
                });
            const totalimg = await Signup.findOne({_id:userid})
            res.redirect("/document")
        }catch(err){
            res.send(err);
        }
    
})


module.exports = routes