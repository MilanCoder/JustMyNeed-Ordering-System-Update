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
                console.log('we were here',docs)
                res.json(docs);
            }
        })
    },

    addAddress(data){
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
                    }
                })
            }
        })
    },

    deleteAddress(data){
        address.findOneAndDelete({areaId:data.areaId,areaName:data.areaName},(err)=>{
            if(err){
                logger.debug('some error occured during deletion of address');
                res.status(500).json('some error occured');
            }
        })
    },
     
    updateAddress(data){
        adddress.findOneAndUpdate({areaId:data.areaId,areaName:data.areaName},(err)=>{
            if(err){
                logger.debug('some error occured during updation of address');
                res.status(500).json('some error occured');
            }
        })
    }

    

}

module.exports=addressCrud;