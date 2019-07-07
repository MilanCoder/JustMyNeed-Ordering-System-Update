const voucherRoutes=require('express').Router();
const voucherObject=require('../../models/setterGetter/vouchermodel').AllVoucher;
const voucherConstructor=require('../../models/setterGetter/vouchermodel').voucher;
const voucherOperations = require('../../db/crudOperations/voucherOperations');
const jwtVerification = require('../../Utils/jwt/jwtverify'); 
const jwt=require('jsonwebtoken');
voucherRoutes.post('/addvoucher',jwtVerification.verifyToken,(req,res)=> {
    jwt.verify(req.token,jwtVerification.adminSecurekey,(err,authData)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:'Session TimeOut'})
        }else{
    var allVouchers=[];
    var voucherDetails = req.body.voucherDetails;
    for(let vouchers of voucherDetails) {
            let mainTempId=parseInt(vouchers.templateId);
                    let newVoucherObject=new voucherConstructor(vouchers.voucherStatement,vouchers.expiryDate,vouchers.voucherDiscount,mainTempId,vouchers.isPercent);
                        allVouchers.push(newVoucherObject);
    }
                        let newObject = new voucherObject(allVouchers);
                        voucherOperations.uploadDatavouch(newObject,res);
                        
                   
}
})
});
voucherRoutes.get('/getvoucherdata',(req,res)=> {
    voucherOperations.getVoucherData(res);
});
module.exports=voucherRoutes;