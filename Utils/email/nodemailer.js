const nodemailer = require("nodemailer");
 const userTemplate=require('./usertemplate');
function mailUser(customerMailId,userName) {
    userTemplate(userName).then(data=> {
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: '', //admin mail ID will be here 
               pass: ''// admin mail ID password will be here 
           }
       });
       const mailOptions = {
        from: '', // admin mail ID will be here 
        to: customerMailId, // Customer mail ID where the Mail has to be send will be here
        subject: 'Welcome to ..Company name..', // subject of the Mail will be here 
        html: data // All magic regarding what will appear to user will be here 
      };
      transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info);
     });
    }).catch(err=> {
      console.log(err);
    })
    
}
module.exports=mailUser;