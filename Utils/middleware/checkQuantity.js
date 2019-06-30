const config=require('../statusconfig');
function checkQuantity(req,res,next) {
  
    let quantity=req.body.cartProduct.quantity;
  
    if(quantity<=0) {
       
        res.status(500).json({"status":config.ERROR});
    }
    else {
        next();
    }
}
module.exports=checkQuantity;