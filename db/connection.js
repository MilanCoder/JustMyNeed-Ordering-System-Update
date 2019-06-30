const mongoose=require("mongoose");
const db=require("../config/dbconfig");

mongoose.connect(db.url,(err)=>{
    if(err){
        console.log('Database Erro')
    }else{
    console.log('connected to db');
    }
});

module.exports=mongoose;