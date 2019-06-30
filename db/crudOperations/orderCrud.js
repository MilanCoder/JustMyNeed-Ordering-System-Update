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
const DeliveryDateStatus = require('../schemas/delStatusSchema');
const   DelivLevSchema= require('../schemas/deliveryLevelSchema');
let async= require('async');
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
                    if(customer.addressArray.length==0 && customer.defaultAddId==null && customer.currentAddId==null){
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
                      callback(null,{'addId':addId,'customer':customer,'cart':cartArray})
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
                                OrderSchema.StandardDelivery.create(order.deliverystatus.standardStatus,(err,doc)=>{
                                    if(err){
                                       return cb('error');
                                    }else{
                                       
                                        DelivLevSchema.Deliverylevel.findOne({maxLevel:order.deliverystatus.standardStatus.maxLevel},(err,deldata)=>{
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
                                OrderSchema.ExpressDelivery.create(order.deliverystatus.expressStatus,(err,doc2)=>{
                                    if(err){
                                       return cb('error');
                                    }else{
                                        DelivLevSchema.Deliverylevel.findOne({maxLevel:order.deliverystatus.expressStatus.maxLevel},(err,deldata)=>{
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

    orderSum(userobj,res){     
       
            cartModel.find({customerId:userobj.customerId},(err,cartArray)=>{
                if(err){
                res.status(409).json({status:config.ERROR,message:err})
                    
                }else if(cartArray.length==0){

                res.status(409).json({status:config.ERROR,message:'Empty Cart'})

                   }else{

                    let ordersum = new orderSum();
                  
                    for(let cartitem of cartArray){
                       ordersum.basketValue+=cartitem.subTotal;
                       ordersum.totalSavings+=parseFloat(((cartitem.costprice-cartitem.sellprice)*cartitem.quantity).toFixed(2));
                    }
                    if(ordersum.basketValue>1000){
                        ordersum.deliveryCharges=0;
                    }
                    ordersum.totalAmountToPay=ordersum.basketValue+ordersum.deliveryCharges;
                  //  console.log(ordersum);
               res.status(200).json({status:config.SUCCESS,'orderSum':ordersum ,cartArray:cartArray})
                }
                })
    
        }
   
}

module.exports= orderCrud;