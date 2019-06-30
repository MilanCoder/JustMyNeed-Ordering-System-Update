const cartObject=require('../../models/setterGetter/cartmodel');
const config= require('../statusconfig')
function addToObject(req,res,next) {
    let cartProduct = req.body.cartProduct;
    try{
        for(let key in cartProduct) {
          cartObject[key]=cartProduct[key];
        }
        cartOperations.findSubProduct(cartObject,res,next);
    }
    catch(err) {
          res.status(500).json({"status":config.ERROR,"message":err});
        }
}
module.exports=addToObject;