const shortId=require('shortid');
shortId.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
const voucIdGenerator = {
    generateId(){
        return "VI" + "JMN" + shortId.generate();
    },
    generateCode() {
        let smallCode=shortId.generate();
        return "JMN" + smallCode;
    }
}
module.exports=voucIdGenerator;