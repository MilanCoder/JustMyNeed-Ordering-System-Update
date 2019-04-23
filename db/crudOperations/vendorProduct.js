const Products=require('../schemas/vendorSchema');
const stringCompare = require('../../Utils/stringCompare');
const categorylist = require('../schemas/ProductSchema');
 
const vendorProductCrud={
    
    searchProduct(req,res,string){
        console.log(string);
        let selectedProducts = [];
             categorylist.Products.find({},(err,categorylist)=>{
                 if(err){
                   res.json({'err':'No Entry found'});
                 }else{
                    categorylist.map(category=>{
                        category.subcategory.forEach(subcategory => {
                            subcategory.products.forEach(products=>{
                                if(stringCompare(string,products.productName)=='equal'){
                                      selectedProducts.push(products.subproducts);
                                }
                            })
                        })
                    })
                }}
             )
                res.json({'selectedProducts':selectedProducts});


            },

    uploadProducts(req,res,obj){
        Products.create(obj,function(err){
            if(err){
                console.log('some error occures');
            }
        })
    },

}

module.exports=vendorProductCrud;