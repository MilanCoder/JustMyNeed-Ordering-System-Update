const express=require('express');
const ProductRoutes=express.Router();
const productCrud = require('../../db/crudOperations/Product');
//milan
ProductRoutes.get('/getProducts',(req,res)=>{
            //nullChecker.check(req.body.products,res);
            productCrud.getProducts(req,res);
})


     
module.exports=ProductRoutes;
    