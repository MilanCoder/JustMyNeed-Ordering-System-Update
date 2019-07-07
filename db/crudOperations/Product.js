const Products=require('../schemas/ProductSchema');
const Admin=require('../schemas/adminLoginSchema');
const logger=require('../../Utils/winstonLogger');
//const getproductArray= require('../../Utils/getProducts');
const s3= require('../../Utils/multer/getImageFiles');
const async=require('async');
const joins= require('../../Utils/productJoins');
const config=require('../../Utils/statusconfig')
//naveen product push
const ProductCrud={
    
    // async uploadProducts(req,res,categorylist){
    //     try{
    //         var clear=await Products.Products.remove({});
    //         if(clear){
    //         var subcatIndex=0;
    //         var productIndex=0;
    //         var objectIndex=0;
    //         for(let obj of categorylist){
    //             var halfobj=new Products.Products({categoryId:obj.categoryId,
    //                         categoryName:obj.categoryName,
    //                         childIds:obj.childIds,
    //                         subcategory:[]
    //                     });
    //                   //  console.log("we were here");
    //             var promise=await halfobj.save();
    //             console.log("we were p1");
    //             if(promise){               //halting the for loop
    //                   var record1=await Products.Products.findOne({categoryName:obj.categoryName});
    //                   if(record1){
    //                    // console.log(record1);
    //                       subcatIndex=0;
    //                       for(let obj1 of obj.subcategory){
    //                         var halfobj1=new Products.SubCat({
    //                                       subcategoryId:obj1.subcategoryId,
    //                                       subcategoryName:obj1.subcategoryName,
    //                                       childIds:obj1.childIds,
    //                                       products:[]});
    //                         record1.subcategory.push(halfobj1);
    //                         //var promise1=await record1.save();
    //                         //if(promise1){
    //                              //var record2=await Products.Products.findOne({categoryName:obj.categoryName});
    //                              //if(record2){
    //                                   productIndex=0;
    //                                   for(let obj2 of obj1.products){
    //                                     var halfobj2=new Products.Product1({
    //                                                   productId:obj2.productId,
    //                                                   productName:obj2.productName,
    //                                                   childIds:obj2.childIds,
    //                                                   subProducts:[]});
    //                                                   console.log(subcatIndex);
    //                                     record1.subcategory[subcatIndex].products.push(halfobj2);
    //                                     //var promise2=await record2.save();
    //                                     //if(promise2){
                                            
    //                                          //var record3=await Products.Products.findOne({categoryName:obj.categoryName});
    //                                          //if(record3){
    //                                              for(let obj3 of obj2.subProducts){
    //                                                  var priceArray=[];
    //                                                  if(obj3.info.priceAndAmount){
    //                                                  for(let obj4 of obj3.info.priceAndAmount){
    //                                                      var priceamount= new Products.PriceAndAmount({
    //                                                         amount:obj4.amount,
    //                                                         suffix:obj4.suffix,
    //                                                         price:obj4.price,
    //                                                         discount:obj4.discount,
    //                                                         instock:obj4.instock
    //                                                      })
    //                                                      priceArray.push(priceamount);
    //                                                  }}
    //                                                  var imageArray=[];
    //                                                  if(obj3.imageUrls){
    //                                                  for(let obj5 of obj3.imageUrls){
    //                                                      imageArray.push(obj5);
    //                                                  }}
    //                                                 var halfobj3=new Products.SubProduct({
    //                                                               subproductId:obj3.subproductId,
    //                                                               subproductName:obj3.subproductName,
    //                                                               info:{
    //                                                                   isExpress:obj3.info.isExpress,
    //                                                                   brand:obj3.info.brand,
    //                                                                   description:obj3.info.description,
    //                                                                   benefitsAndUses:obj3.info.benefitsAndUses,
    //                                                                   priceAndAmount:priceArray,
    //                                                               },
    //                                                               imageUrls:imageArray
    //                                                               });
    //                                                 record1.subcategory[subcatIndex].products[productIndex].subProducts.push(halfobj3);
                                                    
    //                                             }
                                                
    //                                         //}
                                            
                
    //                                     //}
    //                                     productIndex++;
                                    
                                    
                                
    //                             }
                            
    
    //                         //}
    //                     //}
    //                     subcatIndex++;
    //                       }
    //                       var promise3=await record1.save();
    //                       if(typeof(promise3)=='object'){
    //                         objectIndex++;
    //                       }
    //                     }
                    
                
    //             }  
    //       }
          
    //         if(objectIndex==categorylist.length){
    //             res.status(200).json({'isPushed':true});
    //         }
    //         }
    //         }catch(error){
               
    //         } 
    // },

    async commitWithRetry(session) {
        try {
          await session.commitTransaction();
          console.log('Transaction committed.');
        } catch (error) {
          if (
            error.errorLabels &&
            error.errorLabels.indexOf('UnknownTransactionCommitResult') >= 0
          ) {
            console.log('UnknownTransactionCommitResult, retrying commit operation ...');
            //await commitWithRetry(session);
          } else {
            console.log('Error during commit ...');
            await session.abortTransaction();
            throw error;
          }
        }
    },

    async uploadProducts(req,res,categories,subcategories,products,subProducts){
        // try{
        // var session= await Products.Products.startSession();
        // console.log("came hweer")
        // session.startTransaction({
        //     readConcern: { level: 'snapshot' },
        //     writeConcern: { w: 'majority' },
        //     readPreference: 'primary'
        //   });
        // await Products.Products.remove({});
        // await Products.Products.insertMany(categories);

        // await commitWithRetry(session);
        // session.endSession();
        // }
        // catch(error){
        //     console.log(error);
        //     session.endSession();
        // }
        async.parallel([
            function(cb){
                Products.Products.remove({},(err)=>{
                    if(err){
                        return cb('DB Error');
                    }
                    else{
                        Products.Products.insertMany(categories,(err)=>{
                            if(err){
                                return cb('DB Error');
                            }else{
                                cb(null,categories);
                            }
                        });
                    }
                })
            },
            function(cb){
                Products.SubCat.remove({},(err)=>{
                    if(err){
                      return  cb('DB Error');
                    }
                    else{
                        Products.SubCat.insertMany(subcategories,(err)=>{
                            if(err){
                               return cb('DB Error');
                            }else{
                                cb(null,subcategories)
                            }
                        });
                    }
                })
            },function(cb){
                Products.Product1.remove({},(err)=>{
                    if(err){
                     return cb('DB error');
                    }
                    else{
                        Products.Product1.insertMany(products,(err)=>{
                            if(err){
                                return cb('DB error');
                            }else{
                                cb(null,products)
                            }
                        });
                    }
                })
            },function(cb){
                    
            Products.SubProduct.remove({},(err)=>{
                if(err){
                   return cb('DB error');
                }
                else{
                    Products.SubProduct.insertMany(subProducts,(err)=>{
                        if(err){
                           return cb('DB error');
                        }else{
                            cb(null,subProducts);
                        }
                    });
                }
            })
            }
        ],function(err,results){
            if(err){
                res.status(500).json(err);
            }else{
                res.status(200).json({isPushed:true});
            }
        })    

    },
    editProducts(req,res){
      //  console.log(req.body.priceAndAmount);
        Products.SubProduct.findOneAndUpdate({subproductId:req.body.stackTrace[3]},{$set:{

            "info.isExpress":req.body.isExpress,
            "info.brand":req.body.brand,
         "info.description":req.body.description,
        "info.benefitsAndUses":req.body.benefitsAndUses,
        "info.priceAndAmount":req.body.priceAndAmount,

        }},{new:true}, (err,object)=>{
            if(err){
               // console.log(err);
                res.status(500).json('some error')
            }
            else if(object!=null){
                    res.status(200).json({'isPushed':true});
            }
            else{
                res.status(403).json('Product not found');
            }
            
        })
    },

    imageUpload(req,res,result){
      //  console.log(req.body)
      

        Products.SubProduct.findOneAndUpdate({subproductId:req.body.subproductId},
            {$push:{imageUrls:result}},{new:true},(error,object)=>{
            
            if(error){
         
                res.status(500).json('some error')
            }
            else if(object!=null){
                      
                        res.json({'isPushed':true,result:result});
            }
            else{
                res.status(409).json('product not found');
            }
            
        })
    },
    deleteImageBackend(req,res){

        Products.SubProduct.findOne({subproductId:req.body.subproductId},(error,object)=>{
            if(error){
              //  console.log(error);
                res.status(500).json('some error')
            }
            else if(object!=null){
                object.imageUrls.splice(req.body.index,1);
                s3.headObject({
                    Bucket:"big-basket-state-store",
                    Key:req.body.key
                  },(err,data)=>{
                     
                    //  console.log(data);
                    if(data==null){
                      res.status(409).json('No Such Entry Found');
                 }
                
                 else if(data!=null){
                    s3.deleteObject({
                        Bucket:"big-basket-state-store",
                        Key:req.body.key
                      },(err,data)=>{
                         // console.log(req.body.key);
                       if(err){
                        res.status(403).json('Multer Error')
                       }
                       else if(data.DeleteMarker==true){
                       //  console.log('yes')
        
                object.save((err)=>{
                    if(err){
                        res.status(409).json('some error occured during database query')
                      
                    }
                    else{
                        res.status(200).json({'isdelete':true,'index':req.body.index});
                     
                    }
                })
        
                }
                      })}
                  })
            }
      else{
        res.status(409).json('Invalid StackTrace');
     } })
},

getCategoriesArray(){
    return function(cb){
        Products.Products.find({},(err,categories1)=>{
            if(err){
               
              return cb('DB Error');
            }
            else if(categories1.length!=0){
                let categories=[];
                for(let obj of categories1){
                    let obj1={categoryId:obj.categoryId,
                        categoryName:obj.categoryName,
                        childIds:obj.childIds,
                        subcategory:[]
                    };
                    categories.push(obj1);
                
                }
                cb(null,categories);
            }else{
              return cb('No Categories');
            }
        })
    }
}
,
getSubcategoriesArray(){
    return function(cb){
        Products.SubCat.find({},(err,subcategories1)=>{
            if(err){
               // console.log('error');
               return cb('DB Error');
            }
            else if(subcategories1.length!=0){
               // console.log(subcategories1);
                let subcategory=[];
                //subcategory=this.removeIdV(subcategories1);
                for(let obj of subcategories1){
                    let obj1={subcategoryId:obj.subcategoryId,
                        subcategoryName:obj.subcategoryName,
                        childIds:obj.childIds,
                        products:[]
                    };
                    subcategory.push(obj1);
                }
                cb(null,subcategory);
            }else{
              return cb('No Subcategories');
            }
        })
    }
},
getProductsArray(){
   return function(cb){

   Products.Product1.find({},(err,products1)=>{
        if(err){
           // console.log('error');
           return cb('DB Error');
        }
        else if(products1.length!=0){
            let products=[];
            //products=this.removeIdV(products1);
            for(let obj of products1){
                let obj1={productId:obj.productId,
                    productName:obj.productName,
                    childIds:obj.childIds,
                    subProducts:[]
                };
                products.push(obj1);
            }
            cb(null,products);
        }else{
           return cb('No Products')
        }
    })
}
}
,
getSubProductsArray(){
    return function(cb){
    Products.SubProduct.find({},(err,subproducts1)=>{
        if(err){
           // console.log('error');
            return cb('DB Error');
        }
        else if(subproducts1.length!=0){
            let subProducts=[];
            //subProducts=this.removeIdV(subproducts1);
            for(let obj of subproducts1){
                
                
                let priceArray=[];
                        if(obj.info.priceAndAmount){ 
                            for(let obj4 of obj.info.priceAndAmount){
                                 priceArray.push(obj4);
                        }}
                        let imageArray=[];
                        if(obj.imageUrls){
                        for(let obj5 of obj.imageUrls){
                            let obj6={
                                uri: obj5.uri,
                                key: obj5.key
                            }
                            imageArray.push(obj6);
                        }}
                     //   console.log(obj.info.isExpress);
                        let obj1={
                            subproductId:obj.subproductId,
                            subproductName:obj.subproductName,
                            info:{
                                
                                brand:obj.info.brand,
                                isExpress:obj.info.isExpress,
                                description:obj.info.description,
                                benefitsAndUses:obj.info.benefitsAndUses,
                                priceAndAmount:priceArray,
                            },
                            imageUrls:imageArray
                        }
                subProducts.push(obj1);
            }
            cb(null,subProducts)
        }else{
       return cb('No Subproducts');
        }
    })
}
}
,

    getProducts(req,res){ 
       async.parallel([
  ProductCrud.getCategoriesArray(),
  ProductCrud.getSubcategoriesArray(),
  ProductCrud.getProductsArray(),
  ProductCrud.getSubProductsArray()

       ],function(err,results){
      if(err){
   // console.log(err);
    res.status(500).json(err);
      }else{

          
            let categories=[];
          let  products=joins.joinProducts(results[2],results[3]);
          
           let subcategory=joins.joinSubcategory(results[1],products);
         

          categories=joins.joinExcelData(results[0],subcategory); 
          
            res.status(200).json(categories);
        
}    })
            
    

        
        
}
,
searchsp(req,res){

Products.SubProduct.find({"categoryName":req.body.categoryName,
"subcategoryName":req.body.subcategoryName},(err,docs)=>{
if(err){
    res.status(403).json({status:config.ERROR,message:'DB Error'});
}else if(docs.length==0){
    res.status(403).json({status:config.ERROR,message:'No Product Found'});
}else{

    res.status(200).json({status:config.SUCCESS,products:docs})
}
})

}


}


module.exports=ProductCrud; 