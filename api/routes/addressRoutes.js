const express=require('express');
const addressRoutes=express.Router();
const addressCrud=require('../../db/crudOperations/addressCrud');


addressRoutes.get('/getAllAdresses',(req,res)=>{
    addressCrud.getAllAddresses(res);
})



module.exports=addressRoutes;