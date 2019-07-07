const address=require('../schemas/addressSchema')
const logger=require('../../Utils/winstonLogger');

const addressCrud={
    //all the searches will be done through elastic search
    getAllAddresses(res){
        address.find({},(err,docs)=>{
            if(err){
                logger.debug('some error occured during retrival of all addresses');
                res.status(500).json('some error occured');
            }
            else{
                //console.log('we were here',docs);
                var modDocs=[];
                for(let doc of docs){
                    let obj={
                        city:doc.city,
                        areaId:doc.areaId,
                        areaName:doc.areaName,
                        pincode:doc.pincode,
                        status:doc.status
                    }

                    modDocs.push(obj);
                }
                res.json(modDocs);
            }
        })
    },

    addBulkAddress(res,data){
        address.insertMany(data,(err)=>{
            if(err){
                logger.debug('some error occured during adding new address');
                res.status(500).json('some error occured');
            }
            else{
                console.log('address added successfully');
                res.json({added:true});
            }
        })
    },

    addAddress(res,data){
        address.findOne({areaId:data.areaId},(err,doc)=>{
            if(err){
                logger.debug('some error occured during adding new address');
            }
            else if(doc==null){
                address.create(data,(err)=>{
                    if(err){
                        logger.debug('some error occured during adding new address');
                        res.status(500).json('some error occured');
                    }
                    else{
                        console.log('address added successfully');
                        res.json({added:true});
                    }
                })
            }
        })
    },

    deleteAddress(res,data){
        address.findOneAndDelete({areaId:data.areaId,areaName:data.areaName},(err)=>{
            if(err){
                logger.debug('some error occured during deletion of address');
                res.status(500).json('some error occured');
            }
            else{
                res.json({deleted:true});
            }
        })
    },
     
    updateAddress(res,data){
        console.log(data.areaName)
        address.findOneAndRemove({areaId:data.areaId,areaName:data.areaName},(err,doc)=>{
            if(err){
                console.log(err);
                logger.debug('some error occured during updation of address');
                res.status(500).json('some error occured');
            }
            else if(doc!=null){
                address.create(data,(err)=>{
                    if(err){
                        logger.debug('some error occured during updation of address');
                        res.status(500).json('some error occured'); 
                    }
                    else{
                        res.json({edited:true})
                    }
                })
            }
        })
    }

    

}

module.exports=addressCrud;