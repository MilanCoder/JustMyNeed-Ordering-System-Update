const mongoose = require('../connection');
const Customer = mongoose.Schema;
const orderSchema= new mongoose.Schema({
    orderId:String,
    completed:{type:Boolean,default:false}
})
const cartSchema = new mongoose.Schema({
cartProductId:String
})

const voucher = new mongoose.Schema({
    voucherId:String,
    usedQty:Number
})
const address=new mongoose.Schema({
    type:String,
    addId:String,
    house_no:String,
    fulladdress:String,
    area:String,
    city:String,
    pincode:String,
    mobile_no:String,
   
})

const CustomerSchema = new Customer({
firstName:String,
lastName:String,
vouchers:[voucher],
dob:String,
email:String,
currentAddId:{type:String,default:null},
defaultAddId:{type:String,default:null},
addressArray:[
address]
,
password:String,

customerId:String,
orders:[
    orderSchema
],
cartProducts:[
    cartSchema
],
loggedOnce:{
    type:Boolean,
    default:false
},

createdAt:{
    type:Date,

}

})

module.exports={
    Customer:mongoose.model('Customers',CustomerSchema),
    Address:mongoose.model('Address',address),
    Order:mongoose.model('Orders',orderSchema),
    cart:mongoose.model('Carts',cartSchema),
}