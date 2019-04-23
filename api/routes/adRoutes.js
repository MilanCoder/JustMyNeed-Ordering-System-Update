const adcrud = require('../../db/crudOperations/adCrud');
const express=require('express');
const adRoutes=express.Router();


adRoutes.get('/getAds',(req,res)=>{
   
    adcrud.getads(res);
})

adRoutes.get('/getAllAds',(req,res)=>{
    console.log('i m here')
    adcrud.getAllAds(res);
})

module.exports=adRoutes;