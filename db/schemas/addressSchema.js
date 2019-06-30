const mongoose=require("mongoose");
const connection=require("../connection");

const Schema=mongoose.Schema;

const addSchema=new Schema({
    city:String,
    areaId:String,
    areaName:String,
    pincode:String,
    status:String
})

module.exports=mongoose.model("addresses",addSchema)