const DelivLevSchema= require('../schemas/deliveryLevelSchema');
const config=require('../../Utils/statusconfig');
const DelivDateStatusSchema= require('../schemas/delStatusSchema');
const idgen= require('../../Utils/idGenerator/idGen');
const OrderSchema=require('../schemas/orderSchema');
const delivLevelCrud={
getSingleLevel(id,res,deldoc){
    DelivDateStatusSchema.DelStatus.findOne({deliveryId:id},(err,doc)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:'DB Error'})
        }else if(doc==null){
            res.status(409).json({status:config.EMPTY, message:'No Date Level Crud Found'})
        }else{
               res.status(200).json({status:config.SUCCESS,level:doc,"deldoc":deldoc});
        }})
}
    ,
setDelDateStatus(dellevelobj,res){
    DelivLevSchema.Deliverylevel.findOne({maxLevel:dellevelobj.levelValue},(err,doc)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:'DB Error'})
        }else if(doc==null){
           
            res.status(409).json({status:config.EMPTY, message:'No Level Crud Found'})
        }else{
           let levelArray=[];
           for(let i=0;i<doc.levels.length;i++){
            let datevalue=null;
           let levelobj=doc.levels[i];
           if(i==0){
               datevalue=dellevelobj.placingdate;
           }
               let level = new DelivDateStatusSchema.DeliveryDate({
                levelValue:levelobj.levelIndex,
                date:datevalue,
                levelMessage:levelobj.levelMessage
             
               })
               levelArray.push(level);
           }

           DelivDateStatusSchema.DelStatus.findOneAndUpdate({deliveryId:dellevelobj.deliveryId},{$set:{deliveryDates:levelArray}},{new:true},(err,doc)=>{
            if(err){
                res.status(409).json({status:config.ERROR,message:'DB Error'})
            }else if(doc==null){
                
                res.status(409).json({status:config.EMPTY, message:'No Date Crud Found'})
            }else{
                res.status(200).json({status:config.SUCCESS, isPushed:true})
               }
           })
           
        }
    })
}
    ,
    getDeliveryAndSingleLevel(delobj,res){

        if(delobj.delType=="standardStatus"){
        OrderSchema.StandardDelivery.findOne({deliveryId:delobj.id},(err,deldoc)=>{
            if(err){
                res.status(409).json({status:config.ERROR,message:'DB Error'})
            }else if(deldoc==null){
                res.status(409).json({status:config.EMPTY, message:'No Standard Crud Found'})
            }else{
           delivLevelCrud.getSingleLevel(delobj.id,res,deldoc);
            }
        })

 
    }else if(delobj.delType=="expressStatus"){
        OrderSchema.ExpressDelivery.findOne({deliveryId:delobj.id},(err,deldoc)=>{
            if(err){
                res.status(409).json({status:config.ERROR,message:'DB Error'})
            }else if(deldoc==null){
                res.status(409).json({status:config.EMPTY, message:'No Express Crud Found'})
            }else{
           delivLevelCrud.getSingleLevel(delobj.id,res,deldoc);
            }
        })

}else{
    res.status(409).json({status:config.ERROR,message:'Illegal Parameter'});
}
},

    setOrderLevel(levelobj,res){
       console.log(levelobj);
    if(levelobj.delType=="standardStatus"){
OrderSchema.StandardDelivery.findOneAndUpdate({deliveryId:levelobj.deliveryId},{$set:{maxLevel:levelobj.levelValue}},{new:true},(err,doc)=>{
    if(err){
        res.status(409).json({status:config.ERROR,message:'DB Error'})
    }else if(doc==null){
        res.status(409).json({status:config.OVERRIDE,message:'No Order Exist'});
    }else{
    delivLevelCrud.setDelDateStatus(levelobj,res);
    }
})
    }
    else if(levelobj.delType=="expressStatus"){
        OrderSchema.ExpressDelivery.findOneAndUpdate({deliveryId:levelobj.deliveryId},{$set:{maxLevel:levelobj.levelValue}},{new:true},(err,doc)=>{
            if(err){
                res.status(409).json({status:config.ERROR,message:'DB Error'})
            }else if(doc==null){
                res.status(409).json({status:config.OVERRIDE,message:'No Order Exist'});
            }else{
                delivLevelCrud.setDelDateStatus(levelobj,res);
            }
        })
    
    }else{
        res.status(409).json({status:config.ERROR,message:'Illegal Parameter'})
    }},

getdelivLevels(res){
    DelivLevSchema.Deliverylevel.find({},(err,docs)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:'DB Error'})
        }else if(docs.length==0){
            res.status(409).json({status:config.EMPTY, message:'No Crud Found'})
        }else{
            res.status(200).json({status:config.SUCCESS, dellevels:docs});
        }
    })
},

adddelivLevel(delivlevel,res){
   console.log(delivlevel)
DelivLevSchema.Deliverylevel.findOne({maxLevel:delivlevel.maxLevel},(err,doc)=>{
    if(err){
        res.status(409).json({status:config.ERROR,message:'DB Error'})
    }else if(doc!=null){
        res.status(409).json({status:config.OVERRIDE,message:'Level Already Exist'})
    }else{
        delivlevel.levelId= idgen.idgenerator('JMN');
        DelivLevSchema.Deliverylevel.create(delivlevel,(err,doc)=>{
            if(err){
                res.status(409).json({status:config.ERROR,message:'DB Error'})
            }else{
            res.status(200).json({status:config.SUCCESS, isPushed:true});
        }})
       
    }
})
},

editdelivLevel(delivlevel,res){
    console.log(delivlevel);
    DelivLevSchema.Deliverylevel.findOneAndUpdate({maxLevel:delivlevel.maxLevel},{$set:{maxLevel:delivlevel.maxLevel, levels:delivlevel.levels}},(err,doc)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:'DB Error'})
        }else if(doc==null){
            res.status(409).json({status:config.ERROR,message:'No Such Entry Present'});
          
        }else{
           // console.log(doc) 
           res.status(200).json({status:config.SUCCESS,isPushed:true})
        }
    })
},

deletedelivLevel(delivlevel,res){
DelivLevSchema.Deliverylevel.findOneAndRemove({maxLevel:delivlevel.maxLevel},(err,doc)=>{
    if(err){
        res.status(409).json({status:config.ERROR,message:'DB Error'});
    }else if(doc==null){
        res.status(409).json({status:config.ERROR,message:'File does not exist to be deleted'});
       
    }else{
        res.status(200).json({status:config.SUCCESS,isDeleted:true});
    }

})
}

}

module.exports=delivLevelCrud;