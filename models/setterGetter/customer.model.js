
class order{
    constructor(){
    orderId=null,
    completed=false;
}
}
class cart{
    constructor()
    {cartProductId=null
}
}
class voucher{
    constructor(){
        this.voucherId=null,
        this.usedQty=null
    }
}
class address{
    constructor(){
    this.type=null;
    this.addId=null;
    this.house_no=null;
    this.fulladdress=null;
   this.area=null;
    this.city=null;
    this.pincode=null;
    this.mobile_no=null;
    }
}


class CustomerModel{
    constructor(){
    this.firstName=null;
    this.lastName=null;
    this.dob=null;
    this.email=null;
    this.voucher=[];
    this.currentAddId=null;
    this.addressArray=[];
    this.password=null;
    this.customerId=null;
   this.defaultAddId=null;
this.orders=[

];
this.cartProducts=[
  
];
this.loggedOnce=false
;

this.createdAt=null
}
}


module.exports={
 'customerModel':CustomerModel,
 'order':order,
 'cart':cart,
 'address':address,
 'voucher':voucher
}
