const Products=require('../schemas/ProductSchema');
const Admin=require('../schemas/adminLoginSchema');
const logger=require('../../Utils/winstonLogger');
//const getproductArray= require('../../Utils/getProducts');
const s3= require('../../Utils/multer/getImageFiles');
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
                                                         var priceamount= new Products.PriceAndAmount({
                                                            amount:obj4.amount,
                                                            suffix:obj4.suffix,
                                                            price:obj4.price,
                                                            discount:obj4.discount,
                                                            instock:obj4.instock
                                                         })
                                                         priceArray.push(priceamount);
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
                                                                      isExpress:obj3.info.isExpress,
                                                                      brand:obj3.info.brand,
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
               
            } 
    },

    editProducts(req,res){
        let isFound=false;
        console.log('i m  here edit',req.body)
        Products.Products.findOne({categoryId:req.body.stackTrace[0]},(error,object)=>{
            if(object!=null){
            for(let subcategory of object.subcategory){
                if(subcategory.subcategoryId==req.body.stackTrace[1]){
                    for(let product of subcategory.products){
                        if(product.productId==req.body.stackTrace[2]){
                            for(let subproduct of product.subProducts){
                                if(subproduct.subproductId==req.body.stackTrace[3]){
                                    subproduct.info.isExpress=req.body.isExpress;
                                    subproduct.info.brand=req.body.brand;
                                    subproduct.info.description=req.body.description;
                                    subproduct.info.benefitsAndUses=req.body.benefitsAndUses;
                                    subproduct.info.priceAndAmount=req.body.priceAndAmount;
                                   console.log(subproduct.info.priceAndAmount)
                                   isFound=true;
                                }
                            }
                        }
                    }
                }
            }
            if(isFound==true){
            object.save((err)=>{
                if(err){
                    res.status(403).json(err)
                 //   console.log("some error occured during database query");
                }
                else{
                    res.json({'isPushed':true});
                   
                }
            })
            
        }else{
            res.status(409).json('Invalid Stack Trace');
        }}
    else{
        res.status(403).json('No Such Object Found');
    }
    })
    },
//naveen
    imageUpload(req,res,result){
        console.log(req.body,result)
        //db.inventory.find( { "size.uom": "in" } )  
        let isFound=false; 
        Products.Products.findOne({categoryId:req.body.categoryId},(error,object)=>{
            if(object!=null){
            for(let subcategory of object.subcategory){
                if(subcategory.subcategoryId==req.body.subcategoryId){
                    for(let product of subcategory.products){
                        if(product.productId==req.body.productId){
                            for(let subproduct of product.subProducts){
                                if(subproduct.subproductId==req.body.subproductId){    
                                    subproduct.imageUrls.push(result);
                                    isFound=true;
                                  
                                }
                            }
                        }
                    }
                }
            }
if(isFound==true){
            object.save((err)=>{
                if(err){
                    res.status(409).json('Some Database Error Ocurred')
                }
                else{
                    res.json(result);
                 
                }
            })
            
        }else{
            res.status(403).json('Invalid StackTrace');
        } }else{
             res.status(403).json('Invalid StackTrace')
         } })
    },

    //milan deletebackend
    deleteImageBackend(req,res){
        
        //db.inventory.find( { "size.uom": "in" } )   
        Products.Products.findOne({categoryId:req.body.categoryId},(error,object)=>{
            if(object!=null){
            for(let subcategory of object.subcategory){
                if(subcategory.subcategoryId==req.body.subcategoryId){
                    for(let product of subcategory.products){
                        if(product.productId==req.body.productId){
                            for(let subproduct of product.subProducts){
                                if(subproduct.subproductId==req.body.subproductId){
                                   
                                    subproduct.imageUrls.splice(req.body.index,1);
                                  

                                    
                                }
                            }
                        }
                    }
                }
            
           }

          // console.log(req.body)
            s3.headObject({
                Bucket:"big-basket-state-store",
                Key:req.body.key
              },(err,data)=>{
                 
                  console.log(data);
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
                    // console.log('yes')

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

            
         }else{
            res.status(409).json('Invalid StackTrace');
         } })
    },

    //naveen  get product without id and v

    getProducts(req,res){ 
        Products.Products.find({},(err,products)=>{
            if(err){
                res.status(500).json("some error occured");
            }
            else{
            //     let returnproduct=[];
            //   returnproduct= getproductArray.getProducts(products);
              
                //console.log(modProducts[0].subcategory[0].products[0].subProducts);
                //logger.debug("hi");
               res.status(200).json(products);
            // res.status(200).json([]);
            }
            
        })
    },
    filterParam(obj,category,subcategoryName){
       
        let subcategory=[];
for(let i=0;i<category.subcategory.length;i++){
    if(subcategoryName==category.subcategory[i].subcategoryName){
       let subC= category.subcategory[i];
      let productArray=[];
       for(let j=0;j<subC.products.length;j++){
        ////   console.log('yes here')
        let isFound=false;
           let prod= subC.products[j];
           let subproductArray=[];
           for(let k=0;k<prod.subProducts.length;k++){
              // console.log('inside subproducts')
               let inSubprod=false;
               let subprod=prod.subProducts[k];
               let valuesArray=[];
               for(let l=0;l<subprod.info.priceAndAmount.length;l++){
                 //  console.log(subprod.info.priceAndAmount[l])
                if(subprod.info.priceAndAmount[l].instock=='true'){
                    let matchedValueIndex;
                    let keyindex;
                   let values=subprod.info.priceAndAmount[l];
                   for(let key in obj){
                       keyindex=0;
                        matchedValueIndex=0;
                    //    console.log(obj[key],values[key])
                       if(values[key]==obj[key]){
                      //     console.log('inside');        //main filtering logic later changed
                        matchedValueIndex++;
                        inSubprod=true;
                       }
                       keyindex++;
                   }
                 //  console.log(matchedValueIndex,keyindex);
              if(matchedValueIndex==keyindex){
                  isFound=true;
                  valuesArray.push(values);
              }

                }  
                

               }
               
               subprod.info.priceAndAmount=valuesArray;    //new filtered priceAndAmount
       if(inSubprod==true){
    subproductArray.push(subprod);
     }
   


           }  
           prod.subProducts=subproductArray  //new subarray with new PriceAndAmount
           if(isFound==true){
productArray.push(prod)
           }

       }
subC.products=productArray;
subcategory.push(subC); // subcategory New
    }
    
}

category.subcategory=subcategory;


    }
,
searchsp(req,res){
    let subcategoryName=req.body.subcategory;
    
Products.Products.findOne({'categoryName':req.body.category,'subcategory.subcategoryName':subcategoryName},(err,products)=>{
    if(err){
        res.status(409).json('Some Error Occured');
    }
    else{
       // console.log(req.body.params)
        if(req.body.params!=null){
           if(Object.keys(req.body.params).length!=0){
        this.filterParam(req.body.params,products,subcategoryName); }}
// let returnproductarray=[];
// let samplearray=[];
// samplearray.push(products);
// returnproductarray = getproductArray.getProducts(samplearray);
     res.status(200).json(products);
    
    }
})
}


}


module.exports=ProductCrud; 