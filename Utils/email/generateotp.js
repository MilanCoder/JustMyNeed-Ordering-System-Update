const otplib = require('otplib');
const OtpCrud = {
    orderSecret:'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD',
    // generateOrderOtp() {
    //     return "JMN" + shortId.generate();
    checkOtp(token){
       try{
         //  console.log(token);
           let secret=OtpCrud.orderSecret;
           otplib.authenticator.options={
            window:1,                          //window must be same
            step:60*30
        }
        const isValid = otplib.authenticator.verify({token,secret });
        return isValid;
       }catch(err){
return null;
       }
    }
    ,

   generateOrderOtp(){
   let otp={};
    otplib.authenticator.options={
        window:1,
        step:40
    }
    const Authenticator = otplib.authenticator;
    otp.timeRemain=otplib.authenticator.options.step;
    otp.code= Authenticator.generate(OtpCrud.orderSecret);
    return otp;
}
}
module.exports=OtpCrud;