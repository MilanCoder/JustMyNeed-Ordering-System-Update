const mongoose = require('../connection');
const cartSchema = mongoose.Schema;

const cart = new cartSchema({
    customerId:{type:String}, // used for performing fake join operation to search which cart is owned by which customer
    cartProductId:{type:String},
    subproductId:{type:String},
    subproductName:{type:String},
    amount:{type:Number},
    suffix:{type:String},
    quantity:{type:Number}
    

});
const Cart =mongoose.model('cart',cart);
module.exports=Cart;