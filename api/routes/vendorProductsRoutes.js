//--milan
const express=require('express');
const vendorproductRoutes=express.Router();
const multer=require('multer');
const xlstojson = require("xls-to-json-lc");
const xlsxtojson = require("xlsx-to-json-lc");

const upload=require('../../Utils/multer/commonExcelUpload');
const singleUpload=upload.single('name');

const productCrud=require('../../db/crudOperations/vendorProduct'); 

vendorproductRoutes.get('/manualUpload',(req,res)=>{

})

vendorproductRoutes.post('/searchProduct',(req,res)=>{
   console.log(req.body);
      productCrud.searchProduct(req,res,req.body.compareString);

})


vendorproductRoutes.post('/excelUpload',(req,res)=>{

    singleUpload(req,res,function(err){
        if(err instanceof multer.MulterError){
            console.log(err);
        }else if(err){
            //console.log(req.file)
            res.json(err);    
        }
        //console.log(req);
        if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
            exceltojson = xlsxtojson;
        } else {
            exceltojson = xlstojson;
        }

        try {
            exceltojson({
                input: req.file.path,
                output: null, //since we don't need output.json
                lowerCaseHeaders:true
            }, function(err,result){
                if(err) {
                    return res.json({error_code:1,err_desc:err, data: null});
                } 
                console.log(result);
                //do whatever you want
                res.json({error_code:0,err_desc:null, data: result});
            });
        } catch (e){
            res.json({error_code:1,err_desc:"Corupted excel file"});
        }
    })
})



module.exports=vendorproductRoutes;