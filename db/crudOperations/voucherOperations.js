const voucherModel=require('../schemas/voucherSchema');
const templateSchema=require('../schemas/templateSchema');
const config = require('../../utils/statusconfig');
const voucherOperations = {
    uploadDatavouch(allVouchers,res) {
        voucherModel.findOne({},(err,docs)=> {
            if(err){
                res.status(500).json({"message":"Error while finding the document in Voucher CRUD","status":config.ERROR});
            }
            else if(!docs) {
                voucherModel.create(allVouchers,(err)=> {
                    if(err) {
                        res.status(500).json({"message":"Unable to add to the database ","status":config.ERROR});
                            }
                    else{
                        res.status(200).json({"message":"Added to database Successfully","status":config.SUCCESS,"data":allVouchers});
                        allVouchers.length=0;
                            }
            });
            }
            else {
                voucherModel.findOneAndUpdate({"currentStatus":true},{"currentStatus":false},(err,docs)=> {
                    if(err) {
                        res.status(500).json({"message":"Can't find and update in the voucher CRUD","status":config.ERROR});
                    }
                    else {
                        voucherModel.create(allVouchers,(err)=> {
                            if(err) {
                                res.status(500).json({"message":"Unable to add to the database ","status":config.ERROR});
                                    }
                            else{
                                res.status(200).json({"message":"Added to database Successfully","status":config.SUCCESS,"data":allVouchers});
                                allVouchers.length=0;
                                    }
                    });
                    }
                })
            }
        })
    },
    getVoucherData(res) {
        voucherModel.find({currentStatus:true},(err,data)=> {
            if(err) {
                res.status(500).json({"status":config.ERROR,"message":"Error while finding the data in the vouchers "});
            }
            else{
                templateSchema.find({},(err,templates)=>{
if(err){
    res.status(500).json({"status":config.ERROR,"message":"Error while finding the data from Templates "});
        
}else{  
          res.status(200).json({"status":config.SUCCESS,"data":data,templates:templates});
             } })}
        });
    }
}
module.exports=voucherOperations;