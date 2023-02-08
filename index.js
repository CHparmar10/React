const express = require("express");
const cors = require('cors');
const User = require("./db/users");
require("./db/config");
const Products = require("./db/Product");
const Product = require("./db/Product");
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


/// Products APIS

app.post("/add-product",async(req,res)=>{
    let product = new Products(req.body);
    let result = await product.save();
    res.send(result);
});


app.get("/products",async (req,res)=>{
    let products = await Products.find({});
    if(products.length > 0){
        res.send(products);
    }
    else{
        res.send({result:"Products Not Found"});
    }
});

app.delete("/product/:id",async(req,res)=>{
    console.warn("id : ",req.params.id);
    let result = await Product.deleteOne({_id:req.params.id});
    res.send(result);
});


app.get("/product/:id",async(req,res)=>{
    let result = await Product.findOne({_id:req.params.id});
    if(result){
        res.send(result);
    }
    else{
        res.send({result: "No Records Found"});
    }
});


app.put("/product/:id",async(req,res)=>{
    let result = await Product.updateOne(
        {_id:req.params.id},
        {
            $set:req.body
        }
    );
    res.send(result);
});


app.get("/search/:key",async(req,res)=>{
    let result = await Product.find({
        "$or":[
            {name:{$regex:req.params.key}},
            {price:{$regex:req.params.key}},
            {category:{$regex:req.params.key}},
            {company:{$regex:req.params.key}},
        ]
    });
    res.send(result);
});

app.listen(4300);