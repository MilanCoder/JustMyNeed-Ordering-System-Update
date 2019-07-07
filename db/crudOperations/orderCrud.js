const cartModel=require('../schemas/cartSchema');
const OrderSchema =require('../schemas/orderSchema')
const customerModel = require('../schemas/customerSchema');
const orderSum = require('../../models/setterGetter/orderSum')
const config = require('../../Utils/statusconfig');
const cartPIdgen=require('../../Utils/idGenerator/cartPIdGen');
const comments = require('../../Utils/comments');
const custmodel= require('../../models/setterGetter/customer.model')
const orderModel= require('../../models/setterGetter/order.model');
const idgen = require('../../Utils/idGenerator/idGen');
const voucherCrud = require('../schemas/voucherSchema');
const DeliveryDateStatus = require('../schemas/delStatusSchema');
const   DelivLevSchema= require('../schemas/deliveryLevelSchema');
let async= require('async');
const productSchema =require('../schemas/ProductSchema');
const SendCart= require('../../models/setterGetter/cartSend.modal');
const orderCrud={


getCurrentOrders(dateobj,res){
 
OrderSchema.OrderSchema.find({placingdate:{$gte:dateobj.beginDate,$lte:dateobj.endDate}},(err,docs)=>{
    console.log(err,docs)
    if(err){
        res.status(409).json({status:config.ERROR,message:'DB Error'})
    }else if(docs.length==0){
        res.status(409).json({status:config.ERROR,message:'No New Order Found'});
    }else{
        res.status(200).json({status:config.SUCCESS,orders:docs});
    }
})
},

    getSingleOrder(orderid,userobj,res){
    
    OrderSchema.OrderSchema.findOne({orderId:orderid ,customerId:userobj.customerId,"deliverystatus.completed":false},(err,order)=>{
if(err){
    res.status(409).json({status:config.ERROR,message:err})
}else if(order==null){
    res.status(409).json({status:config.ERROR,message:'No Order Found'});

}else{


    res.status(200).json({status:config.SUCCESS,order:order});
}

    })
    

    },
    getOrder(userobj,completed,res){
     async.waterfall([
         function(callback){
    customerModel.Customer.findOne({_id:userobj._id},{'orders':1},(err,order)=>{
        if(err){
           return callback(err);
        }else if(order==null){
           return callback(err);
        }else{
         
            callback(null,order.orders)
        }
    })
         },function(order,callback){
           
             let orderArray=[];
            async.each(order,function(orderobj,callback2){
                if(orderobj.completed==completed){
                  OrderSchema.OrderSchema.findOne({'orderId':orderobj.orderId},(err,doc)=>{
                   
                   if(err) return callback2(err);
                
               else if(doc!=null){
                    orderArray.push(doc);
                 }
                 callback2();
               })}
            },function(err){
              //  console.log(orderArray)
                if(err) return callback(err);
                else if(orderArray.length==0){
                return callback('No Order Found')
                }else{
                   
                    callback(null,orderArray)
                }
            })
    
         }],function(err,results){
           //  console.log(results,err)
if(err){
    res.status(409).json({status:config.ERROR,message:err})
}

            else{
                res.status(200).json({status:config.SUCCESS,orders:results});
            }
         }
     )
    },


   setTimeSlot(type,dateobj,timeSlot,timeAndTypeSlot){
    for(let key in dateobj){
        dateobj[key]=timeAndTypeSlot[type].date[key];
    }
 for(let key in timeSlot){
     if(key!='date'){
     timeSlot[key]=timeAndTypeSlot[type][key];
     }
 }
 timeSlot.date=dateobj;  
}
    ,

setDelivStatus(order,standarddelArray,expressdelArray){
   // console.log(standarddelArray,expressdelArray)
    let status = new orderModel.Status();
    let expDelivery= new orderModel.ExpressDelivery();
    let stdDelivery= new orderModel.StandardDelivery();
    let pending= new orderModel.Pending();
    pending.pendingLevel=0;
    pending.pendingMessage='Order Recived';
    pending.pendingStatus=true;
    if(expressdelArray.length!=0){
        expDelivery.orderId=order.orderId;
        expDelivery.type='EXP';
        expDelivery.deliveryId=idgen.idgenerator('EXP');
           expDelivery.maxLevel=3;
for(let element of expressdelArray){
    element.deliveryId=expDelivery.deliveryId;
}
           expDelivery.orderProducts=expressdelArray;

           expDelivery.pending=pending;

       
    }
    if(standarddelArray.length!=0){
        stdDelivery.orderId=order.orderId;
        stdDelivery.type='ST';

        stdDelivery.deliveryId=idgen.idgenerator('ST');
      stdDelivery.maxLevel=3;
      for(let element of standarddelArray){
        element.deliveryId=stdDelivery.deliveryId;
    }
      stdDelivery.orderProducts=standarddelArray;
      stdDelivery.pending=pending;

    }
    if(expressdelArray.length==0){
    expDelivery=null;
    }
    if(standarddelArray.length==0){
        stdDelivery=null;
    }

    status.expressStatus=expDelivery;
    status.standardStatus=stdDelivery;

return status;

}

    ,
    setdelivTime(result,order,standarddelArray,expressdelArray,timeAndTypeSlot,orderProductArray){
        for(let cartitem of result.cart){
            let orderProduct = new  orderModel.OrderProduct();
          for(let key in orderProduct){
              if(key!='timeSlot' && key!='deliveryType'){
                orderProduct[key]=cartitem[key];
              }
          }
          orderProduct.opId=idgen.idgenerator(orderProduct.subproductId);
          orderProduct.orderId=order.orderId
    
          if(timeAndTypeSlot.type=='EXP'){   
          if(cartitem.isExpress==true){
        let timeSlot= new orderModel.TimeSlot();         //set the time slot according to express availabiliy and 
                                                         //timeslot and type of delivery chosen
        let dateobj = new orderModel.dateobj();

       orderProduct.deliveryType=timeAndTypeSlot.type;
       orderCrud.setTimeSlot('EXP',dateobj,timeSlot,timeAndTypeSlot);
     //  console.log(timeSlot,timeAndTypeSlot);
         orderProduct.timeSlot=timeSlot;
         expressdelArray.push(orderProduct);
          
        }else if(cartitem.isExpress==false){
            let timeSlot= new orderModel.TimeSlot();
            let dateobj = new orderModel.dateobj();
           orderProduct.deliveryType='ST';
           orderCrud.setTimeSlot('ST',dateobj,timeSlot,timeAndTypeSlot);
        orderProduct.timeSlot=timeSlot;
        standarddelArray.push(orderProduct)
          }
        }else if(timeAndTypeSlot.type=='ST'){
            let timeSlot= new orderModel.TimeSlot();
            let dateobj = new orderModel.dateobj();
           orderProduct.deliveryType='ST';
           orderCrud.setTimeSlot('ST',dateobj,timeSlot,timeAndTypeSlot);
        orderProduct.timeSlot=timeSlot;
        standarddelArray.push(orderProduct)
        }

         orderProductArray.push(orderProduct);
        }


    }
    ,


    addOrder(order,timeAndTypeSlot,userobj,res){
      //  console.log(timeAndTypeSlot);
        async.waterfall([
            function(callback) {
                customerModel.Customer.findById(userobj._id,(err,customer)=>{
                 if(err) return callback(err);
                 else if(customer==null){
                 callback(comments.notUserFound);
                }else {
                    if(customer.addressArray.length==0 && customer.defaultAddId==null 
                        && customer.currentAddId==null){
                      return  callback('No Address Exist');
                    }else if(customer.currentAddId==null){
                    callback(null,customer.defaultAddId,customer)
                }else{
                    callback(null,customer.currentAddId,customer);
                }
                }
                })
                
            },
            function(addId, customer,callback) {
              cartModel.find({'customerId':customer.customerId},(err,cartArray)=>{
                  if(err) return callback(err);
                  else if(cartArray.length==0){
                    return callback('Empty Cart');
                  }else{
                    let eligibleCartArray=[];
                    let ineligibleCartArray=[];
              async.each(cartArray,(cartelement,cbinner)=>{
             productSchema.SubProduct.findOne({subproductId:cartelement.subproductId},(err,doc)=>{
              if(err){
                  return cbinner('DB Error');
              }else if(doc==null){
                  return cbinner('No Product Found');
              }else{
                 // console.log(cartelement);
                  let sendcartproduct= new SendCart();
                   for(let amtprice of doc.info.priceAndAmount){
                     //  console.log(amtprice);
                       if(amtprice.amount==cartelement.amount && amtprice.suffix==cartelement.suffix){
                         //  console.log('here');
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
                           eligibleCartArray.push(sendcartproduct);
                           break;
                           }else{
                           ineligibleCartArray.push(sendcartproduct);
                           break;
                           }
                       }
                   }
                   cbinner();
        
              }
                })
        
              },(err)=>{
                if(err){
        
                   callback(err);
                
                }else{
                  //  console.log(eligibleCartArray,'and',ineligibleCartArray);
                 callback(null,{'cart':eligibleCartArray,
                  'ineligibleCartArray':ineligibleCartArray,'addId':addId,'customer':customer});
                }
        
              })

                  }
              })
             
            }, function(result,callback){

                let orderProductArray=[];
                let standarddelArray=[];
                 let expressdelArray=[];
               orderCrud.setdelivTime(result,order ,standarddelArray,expressdelArray,timeAndTypeSlot,orderProductArray);
            
                if(orderProductArray.length==0){
                  return callback('Error Ocurred')
                }
                else{
                    order.deliverystatus= orderCrud.setDelivStatus(order,standarddelArray,expressdelArray);

                    async.series([
                        function(cb){
                            if(order.deliverystatus.standardStatus!=null){
                                OrderSchema.StandardDelivery.create(order.deliverystatus.standardStatus,
                                    (err,doc)=>{
                                    if(err){
                                       return cb('error');
                                    }else{
                                       
                                        DelivLevSchema.Deliverylevel.findOne(
                                            {maxLevel:order.deliverystatus.standardStatus.maxLevel},
                                            (err,deldata)=>{
                                            if(err){
                                              cb('DB Error');
                                            }else if(deldata==null){
                                               cb('No Crud Found');
                                            }else{
                                                let dateArray=[];
                                        
                                                for(let i=0;i<deldata.maxLevel;i++){
                                                    let datevalue=null;
                                                    if(i==0){
                                                       datevalue=order.placingdate;
                                                    }
                                               let dateLevel= new DeliveryDateStatus.DeliveryDate({
                                                   levelValue:deldata.levels[i].levelIndex,
                                                   date:datevalue,
                                                   levelMessage:deldata.levels[i].levelMessage
                                               })
                                               dateArray.push(dateLevel)
                                                }
                                                
        
                                                let DelDateStatus=new DeliveryDateStatus.DelStatus({
                                                    deliveryId:doc.deliveryId,
                                              deliveryDates:dateArray
                                                })
        
        
        
                                                DelDateStatus.save((err)=>{
                                                    if(err){
                                                      return cb('Error');
                                                    }else{
                                                        order.deliverystatus.standardStatus=doc.deliveryId;
                                                        cb(null,doc);
                                                    }
                                                })
                                       
                                                  
                                            }})


                                      
            
                                    }
                                })
                            }else{
                                cb(null,null);
                            }
                        },
                        function(cb){
                            if(order.deliverystatus.expressStatus!=null){
                                OrderSchema.ExpressDelivery.create(order.deliverystatus.expressStatus,
                                    (err,doc2)=>{
                                    if(err){
                                       return cb('error');
                                    }else{
                                        DelivLevSchema.Deliverylevel.findOne(
                                            {maxLevel:order.deliverystatus.expressStatus.maxLevel},
                                            (err,deldata)=>{
                                            if(err){
                                              cb('DB Error');
                                            }else if(deldata==null){
                                               cb('No Crud Found');
                                            }else{
                                                let dateArray=[];
                                        
                                                for(let i=0;i<deldata.maxLevel;i++){
                                                    let datevalue=null;
                                                    if(i==0){
                                                       datevalue=order.placingdate;
                                                    }
                                               let dateLevel= new DeliveryDateStatus.DeliveryDate({
                                                   levelValue:deldata.levels[i].levelIndex,
                                                   date:datevalue,
                                                   levelMessage:deldata.levels[i].levelMessage
                                               })
                                               dateArray.push(dateLevel)
                                                }
                                                
        
                                                let DelDateStatus=new DeliveryDateStatus.DelStatus({
                                                    deliveryId:doc2.deliveryId,
                                              deliveryDates:dateArray
                                                })
    
        
                                                DelDateStatus.save((err)=>{
                                                    if(err){
                                                      return cb('Error');
                                                    }else{
                                                        order.deliverystatus.expressStatus=doc2.deliveryId;
                                                        cb(null,doc2);
                                                    }
                                                })
                                                
                                            }})
                                       
                                   
                               
                             
            
                                    }
                                })
                            }else{
                                cb(null,null)
                            }
                        }
                        
                    ],function(err,results){
 if(err){
     callback(err);
 }else{
    order.customerId=result.customer.customerId;
    for(let address of result.customer.addressArray){
        if(address.addId==result.addId){
            let addressobj = new custmodel.address();
           for(let key in addressobj){
               addressobj[key]=address[key]
           }
           order.delievAddress=addressobj;
          
        }
    }
    if(order.delievAddress.addId==null){
    return callback('No Address Found');
   }

    else{
        callback(null,result);
    }
 }
})
 }
               } 
           ,function (result,callback){
           
                   // console.log(order);
                      OrderSchema.OrderSchema.create(order,(err,doc)=>{
                          if(err){
                             // console.log(err);
                         return callback('DB Error');

                          }
                          else{
                      let setCustOrder=customerModel.Order({
                          'orderId':order.orderId,
                          'completed':false
                      })

                      customerModel.Customer.findOneAndUpdate({customerId:result.customer.customerId},
                        {$push:{orders:setCustOrder},$set:{currentAddId:null,cartProducts:[]}},
                        {new:true},(err,cust)=>{
                          if(err) {
                             return callback('DB ERROR');
                          }else if(cust!=null){     
                           callback(null,result,doc);
                          }else{
                           return  callback('Unknown Error Occurred');
                          }
                      })
                          }

                      })
                      
                
        }   
            ,function(obj,doc,callback){

                async.each(obj.cart,function(cartitem,callbackinner){
                  
                    cartModel.findOneAndRemove({cartProductId:cartitem.cartProductId},(err,cart)=>{
               if(err) return callbackinner(err);
              else if(cart==null){

              return callbackinner('Cart Empty Error')
                    
               }else{
                callbackinner();
               }
                  })
                },function(err){
               if(err){
                return callback();
               }else{
                callback(null,doc)
               }})

            }
               ], function (err, result) {
            if(err){
                res.status(409).json({status:config.ERROR,message:err})

            }else{

                res.status(200).json({status:config.SUCCESS,isPushed:true,order:result});
                

                }
            })
        }
            // result now equals 'done'
 ,

checkVoucherData(voucherCode){
return function(cb){
    if(voucherCode!=null){
    voucherCrud.findOne({"allVouchers.voucherCode":voucherCode},{'allVouchers.$': 1 },(err,res)=>{
    if(err) return cb('DB Error');
    else if(res==null){
        cb(null,null);
    }else{
        cb(null,res);
    }
})
}else{
    cb(null,null);
}
}},

getCartData(userobj){
return function(cb){
//     cartModel.find({customerId:userobj.customerId},(err,cartArray)=>{
//         if(err){
//    return  cb('DB Error');
            
//         }else if(cartArray.length==0){

//     return  cb('Empty Cart');

//            }else{
//                cb(null,cartArray)
//            }
// })}

    //console.log(customerId);
    cartModel.find({'customerId':userobj.customerId},(err,cart)=>{
        if(err){
          cb('DB Error');
     
        }else if(cart.length==0){
           cb('Empty Cart');
        }
        else{
            let eligibleCartArray=[];
            let ineligibleCartArray=[];
      async.each(cart,(cartelement,cbinner)=>{
     productSchema.SubProduct.findOne({subproductId:cartelement.subproductId},(err,doc)=>{
      if(err){
          return cbinner('DB Error');
      }else if(doc==null){
          return cbinner('No Product Found');
      }else{
         // console.log(cartelement);
          let sendcartproduct= new SendCart();
           for(let amtprice of doc.info.priceAndAmount){
             //  console.log(amtprice);
               if(amtprice.amount==cartelement.amount && amtprice.suffix==cartelement.suffix){
                 //  console.log('here');
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
                   eligibleCartArray.push(sendcartproduct);
                   break;
                   }else{
                   ineligibleCartArray.push(sendcartproduct);
                   break;
                   }
               }
           }
           cbinner();

      }
        })

      },(err)=>{
        if(err){

           cb(err);
        
        }else{
          //  console.log(eligibleCartArray,'and',ineligibleCartArray);
         cb(null,{'cartArray':eligibleCartArray,
          'ineligibleCartArray':ineligibleCartArray});
        }

      })
        }
    })
}
}
,
getAllVouchers(res){
   voucherCrud.find({},{allVouchers:1},(err,vouchers)=>{
if(err){
    res.status(409).json({status:config.ERROR,message:'DB Error'});
}else if(vouchers.length==0){
    res.status(409).json({status:config.ERROR,message:'No Vouchers Present' });
}else{
    res.status(200).json({status:config.SUCCESS,vouchers:vouchers});
}
   })
}
 ,
    orderSum(userobj,voucherCode,res){ 
        console.log(voucherCode);
                      async.parallel([
                       orderCrud.getCartData(userobj),
                        orderCrud.checkVoucherData(voucherCode),
                    ],function(err,results){
                        console.log(results);
                      if(err){

                  res.status(409).json({status:config.ERROR,message:err})
                      }else{
                          let voucherDis=null;
                          let cartArray=results[0].cartArray;
                        let ordersum = new orderSum();
                  
                        for(let cartitem of cartArray){
                           ordersum.basketValue+=cartitem.subTotal;
                            ordersum.totalSavings+=parseFloat((cartitem.costprice-cartitem.sellprice)*cartitem.quantity);
                    }
                    ordersum.totalAmountToPay=ordersum.basketValue;
                     if(ordersum.basketValue>100){
                         if(results[1]!=null){
                
                             if(results[1].allVouchers[0].isPercent=='true'){
                                 voucherDis=parseFloat(ordersum.basketValue*parseFloat(results[1].allVouchers[0].voucherDiscount)*0.01).toFixed(2);
                                 ordersum.totalAmountToPay=ordersum.basketValue-parseFloat(ordersum.basketValue*parseFloat(results[1].allVouchers[0].voucherDiscount)*0.01);
                                 ordersum.totalSavings=ordersum.totalSavings+(parseInt(ordersum.basketValue*parseFloat(results[1].allVouchers[0].voucherDiscount)*0.01));
                             }else if(results[1].allVouchers[0].isPercent=='false'){
                                 voucherDis=results[1].allVouchers[0].voucherDiscount;
                                 ordersum.totalAmountToPay=ordersum.basketValue-parseFloat(results[1].allVouchers[0].voucherDiscount);
                                 ordersum.totalSavings=ordersum.totalSavings+parseFloat(results[1].allVouchers[0].voucherDiscount);
                             }
                            
                         }
                            ordersum.deliveryCharges=0;
                       }
                       ordersum.totalAmountToPay=ordersum.totalAmountToPay+ordersum.deliveryCharges;
                         console.log(ordersum);
                        res.status(200).json({status:config.SUCCESS,'orderSum':ordersum ,cartArray:cartArray ,
                        'ineligibleCartArray':results[0].ineligibleCartArray,
                        voucherDiscount:voucherDis, voucherApplied:results[1]})
    
                      }
                    })
                
        }
   
}

module.exports= orderCrud;