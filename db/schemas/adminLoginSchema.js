//const mongoose=require("mongoose");
const mongoose=require("../connection");

const Schema=mongoose.Schema;

const adminLogin=new Schema({
    id:String,
    name:String,
    password:String
})


module.exports=mongoose.model("admin",adminLogin,'admin');