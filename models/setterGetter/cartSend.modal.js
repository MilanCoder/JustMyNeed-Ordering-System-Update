

class SendCart{
constructor(){
    this.customerId=null, // used for performing fake join operation to search which cart is owned by which customer
    this.brand=null;
    this.isExpress=null;
    this.cartProductId=null;
    this.categoryId=null;
    this.categoryName=null;
    this.subproductId=null;
    this.subproductName=null;
    this.suffix=null;
    this.quantity=null;
    this.amount=null;
    this.costprice=null;
    this.sellprice=null;
    this.subTotal=null;
    this.imageUrl=null;
}
}

module.exports=SendCart;