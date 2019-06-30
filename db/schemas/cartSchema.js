const mongoose = require('../connection');
const cartSchema = mongoose.Schema;

const cart = new cartSchema({
    customerId:{type:String}, // used for performing fake join operation to search which cart is owned by which customer
    brand:{type:String},
    isExpress:{type:Boolean},
    cartProductId:{type:String},
    categoryId:{type:String},
    categoryName:{type:String},
    subproductId:{type:String},
    subproductName:{type:String},
    suffix:{type:String},
    quantity:{type:Number},
    amount:{type:Number},
    costprice:{type:Number},
    sellprice:{type:Number},
    subTotal:{type:Number},
    imageUrl:{
        uri:{type:String},
        key:{type:String}
    }

});
const Cart =mongoose.model('cart',cart);
module.exports=Cart;