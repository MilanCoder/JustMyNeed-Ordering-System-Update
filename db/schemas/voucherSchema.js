const mongoose = require('../connection');
const VoucherSchema = mongoose.Schema;
const voucherSch=mongoose.Schema;
const vouch=new voucherSch({
        voucherId:{type:String},
        voucherCode:{type:String},
        isPercent:{type:String },
        voucherDiscount:String || Number,
        voucherStatement:{type:String},
        expiryDate:{type:Date},
        templateId:{type:Number},

})
const voucher = new VoucherSchema({
    date:{type:String,default:new Date()},
    currentStatus:{type:Boolean,default:true},
    allVouchers :[vouch]
});
const Voucher = mongoose.model('vouchers',voucher);
module.exports=Voucher;