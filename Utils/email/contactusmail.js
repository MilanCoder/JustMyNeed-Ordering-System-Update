const nodemailer = require("nodemailer");
const userTemplate=require('./mailcontact');
const generateOtp=require('./generateotp');
function mailUser(customerMailId,userName) { 
  let pr = new Promise((resolve,reject)=>{
    let generateOtpObj=generateOtp.generateOrderOtp();
    userTemplate(userName,generateOtpObj.code).then(data=> {
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: 'jagdish.justmyneed@gmail.com', 
               pass: 'justmyneed@123' 
           }
       });
       const mailOptions = {
        from: 'doNotReply@justMyNeed.com',  
        to: customerMailId, 
        subject: "One time Password (OTP) for your Order", 
        html: data 
      };
      transporter.sendMail(mailOptions, function (err, info) {
        if(err)
        reject(err);
         
        else
        //  console.log(info);
          resolve({info:info,timeRemain:generateOtpObj.timeRemain});
     });
    }).catch(err=> {
     // console.log(err);
      reject(err);
    })
    
  })
  return pr;
    
}
module.exports=mailUser;