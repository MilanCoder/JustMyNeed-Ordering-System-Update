const config=require('../statusconfig');

const Order = require('../../models/setterGetter/order.model');
const orderidGen= require('../idGenerator/orderIdGen');
function checkOrderobj(req,res,next) {
  //  console.log(req.body.order);
   let orderobj= new Order.OrderModel();
  
   let giftMessage= new Order.GiftMessage();
  
  if(req.body!=null){
  let order = req.body.order;
    try{
if(order.giftMessage!=null){
    for(let key in order.giftMessage){
      giftMessage[key]= order.giftMessage[key];
    }
}else{
    orderobj.giftMessage=null;
}

orderobj.giftMessage=giftMessage;
 orderobj.transactionId=order.transactionId;
 orderobj.payment=order.payment;
 orderobj.paymentMethod = order.paymentMethod;
 orderobj.placingdate= Date.now();
orderobj.orderId=orderidGen.generateId(order.paymentMethod);
//console.log(orderobj);
req.order=orderobj;
req.timeAndTypeSlot=req.body.order.timeAndTypeSlot;

next();
}

catch(e){
    res.status(500).json({'status':config.ERROR,message:'Invalid Order Object'})


}

}else{
    res.status(500).json({'status':config.ERROR,'message':'Invalid Request'})

}

  
}
module.exports=checkOrderobj;