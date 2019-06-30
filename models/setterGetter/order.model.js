const Customer= require('./customer.model')
class OrderedProducts{
    constructor(){
    this.opId=null;
    this.orderId=null;
    this.subproductId=null;
    this.subproductName=null;
    this.sellprice=null;
    this.amount=null;
    this.suffix=null;
    this.quantity=null;
    this.subTotal=null;
    this.deliveryId=null;
    this.deliveryType='ST';
    this.timeSlot=null;
    this.imageUrl=null;
}}

class pending{
  constructor(){
    this.pendingStatus=true,
    this.pendingMessage='Order Placed',
    this.pendingLevel=0;
  }
}

class standardDelivery{
    constructor(){
        this.deliveryId=null;
        this.type=null;
this.orderId=null;
this.pending=null;
this.maxLevel=4;
this.orderProducts=[]
}}

class expressDelivery{
    constructor(){
        this.type=null;
        this.deliveryId=null;
        this.orderId=null;
this.pending=null;
this.maxLevel=3;
this.orderProducts=[]
}
}


class status{
    constructor(){
this.standardStatus=null,
this.expressStatus=null,
this.completed=false
}
}

 class TimeSlot{
    constructor(){
        this.startTimeSlot=null,
            this.endTimeSlot=null,
            this.date=null;
                 }
}
class dateobj{
    constructor(){
    this.FullDate=null;
    this.Day=null;
    this.Date=null;
    this.Month=null;
}
}

class GiftMessage{
   constructor(){
    this.senderName=null,
    this.recieverName=null,
    this.message=null
}}


class OrderModel{
    constructor(){
  this.giftMessage=new GiftMessage();
        this.delieveryId=null;
        this.allocatedEmpId=null;
        this.orderId=null;
        this.placingdate=null;
       this.delievAddress=null;
       this.transactionId=null;
       this.deliverystatus=null;
        this.payment=null;
        this.customerId=null;
    this.paymentMethod=null;
     
    }
}

module.exports={'OrderModel':OrderModel,
'OrderProduct':OrderedProducts,
'GiftMessage':GiftMessage,
'StandardDelivery':standardDelivery,
'ExpressDelivery':expressDelivery,
'Pending':pending,
'Status':status,
'TimeSlot':TimeSlot,
'dateobj':dateobj

}