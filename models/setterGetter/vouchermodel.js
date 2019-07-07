const vouchIdGenerator=require('../../Utils/voucher/voucIdGenerator');
class voucher {
    constructor(voucherStatement,expiryDate,voucherDiscount,templateId,percent) {
        this.voucherId=vouchIdGenerator.generateId();
        this.voucherCode=vouchIdGenerator.generateCode();
        this.voucherDiscount=voucherDiscount;
        this.voucherStatement=voucherStatement;
        this.isPercent=percent;
        this.expiryDate=expiryDate;
        this.templateId=templateId;
      
    }
}

class AllVoucher {
    constructor(allVouchers) {
        this.allVouchers=allVouchers;
    }
}
module.exports={
    voucher:voucher,
    AllVoucher:AllVoucher
};