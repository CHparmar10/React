const express = require("express");
const cors = require('cors');
const User = require("./db/users");
require("./db/config");
//const mongoose = require("mongoose");
 
const app = express();
app.use(express.json());
app.use(cors());

app.post("/register",async(req,res)=>{
    //res.send(req.body);
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    res.send(result);
});

// const connectDB = async () =>{
//     mongoose.connect("mongodb://localhost:27017/e-commerce");
//     const productSchemas = new mongoose.Schema({});
//     const products = mongoose.model("products",productSchemas);
//     const data = await products.find();
//     console.log(data);
// }

//connectDB();

app.post("/login",async(req,res)=>{
    //res.send(req.body);
    if(req.body.password && req.body.email){
        let user = await User.findOne(req.body).select("-password");
        if(user){
            res.send(user);
        }
        else{
            res.send({result:"No User Found"});
        }
    }
    else{
        res.send({result:"No User Found"});
    }
});

app.get("/",(req,res)=>{
    res.send("app is connected");
});

app.listen(4300)