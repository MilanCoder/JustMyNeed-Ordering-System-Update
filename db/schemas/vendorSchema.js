const mongoose=require("mongoose");
const connection=require("../connection");

var Schema=mongoose.Schema;

var vendorProductSchema=new Schema({
    name:{
        type:String
    },
    price:{
        type:String
    },
    type:{
        type:String
    },
    amount:{
        type:String
    }

})


module.exports=mongoose.model("tempProducts",vendorProductSchema);