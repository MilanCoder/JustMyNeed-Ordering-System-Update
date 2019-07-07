const cartModel=require('../schemas/cartSchema');
const productModel=require('../schemas/ProductSchema');
const customerSchema =require('../schemas/customerSchema')
const config = require('../../Utils/statusconfig');
const comments = require('../../Utils/comments');
const SaveCart =require('../../models/setterGetter/cartSave.model');
const cartPIdgen=require('../../Utils/idGenerator/cartPIdGen');
const SendCart=require('../../models/setterGetter/cartSend.modal');
let async= require('async');

const cartOperations = {

    cartCreate(cartObject,userobj,res){
      //  console.log(cartObject);
      cartModel.create(cartObject,(err)=> {
            if(err) {
                res.status(500).json({"status":config.ERROR,"message":err});
            }
            else {
customerSchema.Customer.findByIdAndUpdate(userobj._id,{$push:{cartProducts:cartObject}},{new:true},(err,doc)=>{
    if(err){
        res.status(409).json({status:config.ERROR,message:err});
    }else{
        res.status(200).json({"status":config.SUCCESS,'isPushed':true, "cartproduct":cartObject});
    }
})
             // console.log('here');
             
            }
        });
    },
    getCartData(customerId,res){
        //console.log(customerId);
        cartModel.find({'customerId':customerId},(err,cart)=>{
            if(err){
                res.status(500).json({"status":config.ERROR,"message":'DB Error'});
         
            }else if(cart.length==0){
                res.status(200).json({status:config.SUCCESS,cartArray:cart,'ineligibleCartArray':[]})
            }
            else{
                let eligibleCartArray=[];
                let ineligibleCartArray=[];
          async.each(cart,(cartelement,cb)=>{
         productModel.SubProduct.findOne({subproductId:cartelement.subproductId},(err,doc)=>{
          if(err){
              return cb('DB Error');
          }else if(doc==null){
              return cb('No Product Found');
          }else{
              console.log(cartelement);
              let sendcartproduct= new SendCart();
               for(let amtprice of doc.info.priceAndAmount){
                   console.log(amtprice);
                   if(amtprice.amount==cartelement.amount && amtprice.suffix==cartelement.suffix){
                       console.log('here');
                       sendcartproduct.amount=amtprice.amount;
                       sendcartproduct.suffix=amtprice.suffix;
                    sendcartproduct.costprice=parseFloat(amtprice.price);
                    sendcartproduct.sellprice = parseFloat((parseFloat(amtprice.price)-(0.01*parseInt(amtprice.discount)*parseFloat(amtprice.price))).toFixed(2));
                    sendcartproduct.subTotal=parseFloat(sendcartproduct.sellprice*cartelement.quantity);
                    sendcartproduct.cartProductId=cartelement.cartProductId;
                    sendcartproduct.customerId=cartelement.customerId;
                    sendcartproduct.isExpress=doc.info.isExpress;
                    sendcartproduct.categoryId=doc.categoryId;
                    sendcartproduct.categoryName = doc.categoryName;
                    sendcartproduct.imageUrl=doc.imageUrls[0];
                    sendcartproduct.subproductId=doc.subproductId;
                    sendcartproduct.subproductName=doc.subproductName;
                    sendcartproduct.brand=doc.info.brand;
                    sendcartproduct.quantity=cartelement.quantity;

                       if(amtprice.instock=='true'){
                           console.log('here');
                       eligibleCartArray.push(sendcartproduct);
                       break;
                       }else{
                       ineligibleCartArray.push(sendcartproduct);
                       break;
                       }
                   }
               }
               cb();

          }
            })

          },(err)=>{
            if(err){

                res.status(409).json({status:config.ERROR,message:err})
            
            }else{
                console.log(eligibleCartArray,'and',ineligibleCartArray);
              res.status(200).json({"status":config.SUCCESS,'cartArray':eligibleCartArray,
              'ineligibleCartArray':ineligibleCartArray});
            }

          })
            }
        })

    }
    ,

    addToCart(stackTrace,cartProduct,authData,res){
      console.log(cartProduct);
        if(cartProduct.cartProductId==null){
            if(stackTrace.length==4){

       productModel.SubProduct.findOne({"categoryId":stackTrace[0],
       "subcategoryId":stackTrace[1],"productId":stackTrace[2],"subproductId":stackTrace[3],
       "info.priceAndAmount":{$elemMatch:{ instock:'true'}}},(err,subproduct)=>{
            if(err) {
                res.status(500).json({"status":config.ERROR,"message":'DB Error'});
            }else if(subproduct==null){
                res.status(500).json({"status":config.ERROR,"message":'No Product Found'});
            }
            else {
                let isFound=false;
              
                let saveCart = new SaveCart();
                    for(let l=0;l<subproduct.info.priceAndAmount.length;l++){
                              
                        let amtprice = subproduct.info.priceAndAmount[l];
                        if(cartProduct.amount==amtprice.amount && cartProduct.suffix==amtprice.suffix){
                            console.log('im prive');        
                              saveCart.customerId=authData.customerId;
                              saveCart.subproductId=subproduct.subproductId;
                              saveCart.subproductName=subproduct.subproductName;
                              saveCart.cartProductId=cartPIdgen.generateId(subproduct.subproductName);
                              saveCart.amount=amtprice.amount;
                              saveCart.quantity=cartProduct.quantity;
                              saveCart.suffix=amtprice.suffix;
                                    isFound=true;
                                    break;
                                
                            } 
            }
           // console.log(isFound);
        if(isFound==true){
          //  console.log('found')
     cartOperations.cartCreate(saveCart,authData,res);
        }else{
            res.status(409).json('No Cart Found');
        }
        }
        })}else{
            res.status(409).json('StackTrace Invalid');
        }
    }else{
            cartOperations.increaseQuantity(cartProduct,cartProduct.quantity,res)
        }
    },
    increaseQuantity(cartProduct,currentQuantity,res) {
       console.log(currentQuantity,cartProduct);
        
        if(currentQuantity>12){
            res.status(500).json({"status":config.ERROR,"message":config.quantityOverflow});
        }
        cartModel.findOneAndUpdate({'cartProductId':cartProduct.cartProductId},
        {$set:{quantity:currentQuantity}},{new:true},(err,updatedObjectOfCart)=> {
            if(err) {
                res.status(500).json({"status":config.ERROR,"message":'DB Error'});
            }
            else {
                console.log('here');
                res.status(200).json({"status":config.SUCCESS,'isPushed':true, "cartproduct":updatedObjectOfCart});
            }
        });
    },
    decreaseQuantity(cartProduct,userobj,currentQuantity,res) {
      //  console.log(cartProduct);
        if(currentQuantity>0){
        cartModel.findOneAndUpdate({'cartProductId':cartProduct.cartProductId},{$set:{quantity:currentQuantity}},{new:true},(err,updatedObjectOfCart)=> {
            if(err) {
                res.status(500).json({"status":config.ERROR,"message":err});
            }
            else {
                res.status(200).json({"status":config.SUCCESS, "isDeleted":true, "cartproduct":updatedObjectOfCart});
            }
        });
    }else{
        this.deleteParticularItem(cartProduct.cartProductId,userobj,res)
    }
},
    deleteParticularItem(cartProductId,userobj,res) {
       // console.log('here delete')
        cartModel.findOneAndDelete({'cartProductId':cartProductId},(err,updatedObjectOfCart)=> {
            if(err) {
                res.status(500).json({"status":config.ERROR,"message":err});
            }
            else if(!updatedObjectOfCart) {
                res.status(404).json({"status":config.NOT_FOUND,"message":updatedObjectOfCart});
            }
            else {

                customerSchema.Customer.findByIdAndUpdate(userobj._id,{$pull:{cartProducts:{'cartProductId':cartProductId}}},{new:true},(err,doc)=>{
                    if(err) {
                        res.status(409).json({status:config.ERROR,message:err});
                    }else if(doc==null){
                        res.status(409).json({status:config.ERROR,message:comments.notUserFound});

                    }else{
                        res.status(200).json({"status":config.SUCCESS,"cartproduct":updatedObjectOfCart ,'isDeleted':true});
                    }
                })
               
            }
        });
    },
    emptyWholeCart(cartProductIdArray,userobj,res) {
        console.log('here',cartProductIdArray)
  
        async.each(cartProductIdArray,function(categoryProductId,callback) {
          //  console.log(categoryProductId);
            cartModel.findOneAndRemove({'cartProductId':categoryProductId},(err,cart)=> {
             
                if(err){
                     return callback('DB Error');   
                }
                else {
                    callback();
                }
            })},function(err) {
                //console.log(values);
                if(err) {
                    //console.log(err);
                    res.status(500).json({"status":config.ERROR,"message":err});
                }
                else{
                    customerSchema.Customer.findByIdAndUpdate(userobj._id,{$set:{cartProducts:[]}},{new:true},(err,doc)=>{
                        if(err){
                            res.status(409).json({status:config.ERROR,message:err});
                        }else if(doc==null){
                            res.status(409).json({status:config.ERROR,message:comments.notUserFound});
                        } else{
                            res.status(200).json({"status":config.EMPTY,"message":config.CARTEMPTYMESSAGE,'isEmpty':true});
                        }
                    })

                   
                }
            
        })
                
        },
        findSubProduct(cartObject,res,next) {
        }
    }
module.exports=cartOperations;