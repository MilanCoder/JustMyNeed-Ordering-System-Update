const Products=require('../schemas/ProductSchema');
const Admin=require('../schemas/adminLoginSchema');
const logger=require('../../Utils/winstonLogger');
const getproductArray= require('../../Utils/getProducts')
//naveen product push
const ProductCrud={
    
    async uploadProducts(req,res,categorylist){
        try{
            var clear=await Products.Products.remove({});
            if(clear){
            var subcatIndex=0;
            var productIndex=0;
            var objectIndex=0;
            for(let obj of categorylist){
                var halfobj=new Products.Products({categoryId:obj.categoryId,
                            categoryName:obj.categoryName,
                            childIds:obj.childIds,
                            subcategory:[]
                        });
                      //  console.log("we were here");
                var promise=await halfobj.save();
                console.log("we were p1");
                if(promise){               //halting the for loop
                      var record1=await Products.Products.findOne({categoryName:obj.categoryName});
                      if(record1){
                       // console.log(record1);
                          subcatIndex=0;
                          for(let obj1 of obj.subcategory){
                            var halfobj1=new Products.SubCat({
                                          subcategoryId:obj1.subcategoryId,
                                          subcategoryName:obj1.subcategoryName,
                                          childIds:obj1.childIds,
                                          products:[]});
                            record1.subcategory.push(halfobj1);
                            //var promise1=await record1.save();
                            //if(promise1){
                                 //var record2=await Products.Products.findOne({categoryName:obj.categoryName});
                                 //if(record2){
                                      productIndex=0;
                                      for(let obj2 of obj1.products){
                                        var halfobj2=new Products.Product1({
                                                      productId:obj2.productId,
                                                      productName:obj2.productName,
                                                      childIds:obj2.childIds,
                                                      subProducts:[]});
                                                      console.log(subcatIndex);
                                        record1.subcategory[subcatIndex].products.push(halfobj2);
                                        //var promise2=await record2.save();
                                        //if(promise2){
                                            
                                             //var record3=await Products.Products.findOne({categoryName:obj.categoryName});
                                             //if(record3){
                                                 for(let obj3 of obj2.subProducts){
                                                     var priceArray=[];
                                                     if(obj3.info.priceAndAmount){
                                                     for(let obj4 of obj3.info.priceAndAmount){
                                                         priceArray.push(obj4);
                                                     }}
                                                     var imageArray=[];
                                                     if(obj3.imageUrls){
                                                     for(let obj5 of obj3.imageUrls){
                                                         imageArray.push(obj5);
                                                     }}
                                                    var halfobj3=new Products.SubProduct({
                                                                  subproductId:obj3.subproductId,
                                                                  subproductName:obj3.subproductName,
                                                                  info:{
                                                                      description:obj3.info.description,
                                                                      benefitsAndUses:obj3.info.benefitsAndUses,
                                                                      priceAndAmount:priceArray,
                                                                  },
                                                                  imageUrls:imageArray
                                                                  });
                                                    record1.subcategory[subcatIndex].products[productIndex].subProducts.push(halfobj3);
                                                    
                                                }
                                                
                                            //}
                                            
                
                                        //}
                                        productIndex++;
                                    
                                    
                                
                                }
                            
    
                            //}
                        //}
                        subcatIndex++;
                          }
                          var promise3=await record1.save();
                          if(typeof(promise3)=='object'){
                            objectIndex++;
                          }
                        }
                    
                
                }  
          }
          
            if(objectIndex==categorylist.length){
                res.status(200).json({'isPushed':true});
            }
            }
            }catch(error){
                console.log(error)
            } 
    },

    editProducts(req,res){
        console.log('i m  here edit')
        Products.Products.findOne({categoryId:req.body.stackTrace[0]},(error,object)=>{
            if(object!=null){
            for(let subcategory of object.subcategory){
                if(subcategory.subcategoryId==req.body.stackTrace[1]){
                    for(let product of subcategory.products){
                        if(product.productId==req.body.stackTrace[2]){
                            for(let subproduct of product.subProducts){
                                if(subproduct.subproductId==req.body.stackTrace[3]){
                                    subproduct.info.description=req.body.description;
                                    subproduct.info.benefitsAndUses=req.body.benefitsAndUses;
                                    subproduct.info.priceAndAmount=req.body.priceAndAmount;
                                    object.save((err)=>{
                                        if(err){
                                            res.status(403).json(err)
                                         //   console.log("some error occured during database query");
                                        }
                                        else{
                                            res.json({'isPushed':true});
                                           
                                        }
                                    })
                                }
                            }
                        }
                    }
                }
            }
            
        }
    else{
        res.status(403).json('No Such Object Found');
    }
    })
    },
//naveen
    imageUpload(req,res,result){
        console.log(req.body,result)
        //db.inventory.find( { "size.uom": "in" } )   
        Products.Products.findOne({categoryId:req.body.categoryId},(error,object)=>{
            if(object!=null){
            for(let subcategory of object.subcategory){
                if(subcategory.subcategoryId==req.body.subcategoryId){
                    for(let product of subcategory.products){
                        if(product.productId==req.body.productId){
                            for(let subproduct of product.subProducts){
                                if(subproduct.subproductId==req.body.subproductId){
                                    console.log('i here')
                                    
                                    subproduct.imageUrls.push(result);
                                    object.save((err)=>{
                                        if(err){
                                            res.status(409).json('Some Database Error Ocurred')
                                        }
                                        else{
                                            res.json(result);
                                         
                                        }
                                    })
                                }
                            }
                        }
                    }
                }
            }
            
         }else{
             res.status(403).json('Invalid StackTrace')
         } })
    },

    //milan deletebackend
    deleteImageBackend(req,res){
        
        //db.inventory.find( { "size.uom": "in" } )   
        Products.Products.findOne({categoryId:req.body.categoryId},(error,object)=>{
            if(object=null){
            for(let subcategory of object.subcategory){
                if(subcategory.subcategoryId==req.body.subcategoryId){
                    for(let product of subcategory.products){
                        if(product.productId==req.body.productId){
                            for(let subproduct of product.subProducts){
                                if(subproduct.subproductId==req.body.subproductId){
                                    console.log(' i here')
                                    subproduct.imageUrls.splice(req.body.index,1);
                                    object.save((err)=>{
                                        if(err){
                                            res.status(409).json('some error occured during database query')
                                          
                                        }
                                        else{
                                            res.status(200).json({'delete':true});
                                         
                                        }
                                    })
                                }
                            }
                        }
                    }
                }
            }
            
         }else{
            res.status(409).json('Invalid StackTrace');
         } })
    },

    //naveen  get product without id and v

    getProducts(req,res){ 
        Products.Products.find({},(err,products)=>{
            if(err){
                res.json("some error occures");
            }
            else{
                let returnproduct=[];
              returnproduct= getproductArray.getProducts(products);
              
                //console.log(modProducts[0].subcategory[0].products[0].subProducts);
                //logger.debug("hi");
                res.json(returnproduct);
            }
            
        })
    }

    
}

module.exports=ProductCrud; 