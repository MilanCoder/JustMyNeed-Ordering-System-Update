const OrderSchema = require('../schemas/orderSchema');
const config= require('../../Utils/statusconfig');
const DeliveryCrud={

getStandardDeliveryDetails(id,res){
OrderSchema.StandardDelivery.findOne({deliveryId:id},(err,doc)=>{
    if(err){
res.status(409).json({status:config.ERROR,message:'DB Error'});
    }else if(doc==null){
      res.status(409).json({status:config.EMPTY,message:'No Delivery Details Found'});
    }else{
        res.status(200).json({status:config.SUCCESS, STdelivery:doc});
    }
})

}
,
getExpressDeliveryDetails(id,res){
    OrderSchema.ExpressDelivery.findOne({deliveryId:id},(err,doc)=>{
        if(err){
    res.status(409).json({status:config.ERROR,message:'DB Error'});
        }else if(doc==null){
          res.status(409).json({status:config.EMPTY,message:'No Delivery Details Found'});
        }else{
            res.status(200).json({status:config.SUCCESS, EXPdelivery:doc});
        }
})
}
}

module.exports=DeliveryCrud;