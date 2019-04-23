const mongoose=require("mongoose");
const db=require("../config/dbconfig");

mongoose.connect(db.url,()=>{
    console.log('connected to db');
});