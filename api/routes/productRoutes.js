const express=require('express');
const ProductRoutes=express.Router();
const productCrud = require('../../db/crudOperations/Product');
//milan
ProductRoutes.get('/getProducts',(req,res)=>{
            //nullChecker.check(req.body.products,res);
            productCrud.getProducts(req,res);
})

ProductRoutes.post('/searchquery',(req,res)=>{

    productCrud.searchsp(req,res);
})


     
module.exports=ProductRoutes;
    