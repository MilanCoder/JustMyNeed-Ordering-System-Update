 const Customer= require('../schemas/customerSchema')
 const custIdGen = require('../../Utils/idGenerator/custIdGen');
 const respmessage= require('../../Utils/comments');
 const config = require('../../Utils/statusconfig');
 const mailUser = require('../../Utils/email/contactusmail');
 const AddressotpCrud=require('../../Utils/email/generateotp');
const customerCrud={

async signUp(custObj){
    let returncustomer=null;
try{
   let customer =await Customer.Customer.findOne({'email':custObj.email}).catch(err=>{
       return null;
   });
   if(customer!=null){  
      returncustomer=respmessage.isalreadypresent;
     }
     else{
         if(custIdGen.idgenerator(custObj.email)!=null){
        custObj.customerId=custIdGen.idgenerator(custObj.email);
        let customer=await Customer.Customer.create(custObj);
         returncustomer=customer;
          }}
       return returncustomer;
}catch(e){
    return returncustomer='error';
    
}},


checkOrderAddressOTP(otp,res){
 // console.log(AddressotpCrud.checkOtp(otp))
if(AddressotpCrud.checkOtp(otp)!=false){
  
    res.status(200).json({status:config.VALIDOTP,isValid:true});
}else{
    res.status(409).json({status:config.INVALIDOTP,message:'Incorrect OTP'})
}

}
,
createOrderAddressOTP(emailobj,res){
mailUser(emailobj.email,emailobj.firstName).then(data=>{
    if(data!=null){
      //  console.log(data);
        res.status(200).json({status:config.SUCCESS,isCreated:true,timeRemain:data.timeRemain});
    }
 
}),err=>{
    res.status(409).json({status:config.ERROR,message:err})
};
}
,

getCustomer(id,res){
Customer.Customer.findOne({customerId:id},(err,customer)=>{
    if(err){
        res.status(409).json({status:config.ERROR,message:err})
    } else if(customer==null){
            res.status(409).json({status:config.ERROR,message:respmessage.notUserFound})
        }else{
            res.status(200).json({"status":config.SUCCESS, "customer":customer})
        }
})
},

getCustomerAddress(userobj,res){
Customer.Customer.findById(userobj._id,(err,doc)=>{
    if(err){
        res.status(409).json(err);
    }else{
        if(doc==null){
            res.status(409).json(respmessage.notUserFound);
        }else{

  let obj={
      defaultAddId:doc.defaultAddId,
      firstName:doc.firstName,
      lastName:doc.lastName,
    addressArray:doc.addressArray,
    mobile_no:doc.mobile_no,
  }

            res.status(200).json({"status":config.SUCCESS, "userdetails":obj})
        }

    }
})
},
setCurrentAdd(userobj,addId,res){
Customer.Customer.findOneAndUpdate({_id:userobj._id},{$set:{currentAddId:addId}},{new:true},(err,doc)=>{
    if(err){
        res.status(409).json({status:config.ERROR,message:err})
    } else{
        if(doc==null){
            res.status(409).json({status:config.ERROR,message:respmessage.notUserFound})
        }else{
            res.status(200).json({"status":config.SUCCESS,"isEdited":true});
        }
    }
})
}
,

filldetails(userobj,address,isdefault,res){
  //  console.log(address,userobj);
Customer.Customer.findById(userobj._id,(err,maindoc)=>{
    if(err){
        res.status(409).json(err);
    }else if(maindoc==null){
            res.status(409).json(respmessage.notUserFound);
        }else if( maindoc.addressArray.length==4){
            res.status(409).json({status:config.ERROR,message:'Cannot add more than 4'})
        }else {
            let isFound=false;
         for(let additem of maindoc.addressArray){
             if(additem!=null){
                 if(additem.fulladdress==address.fulladdress){
                    isFound=true;
                    return ;
                 }
             }
         }
         if(isFound==true){
            res.status(409).json({status:config.ERROR,message:'Address Already Exist'})
       
         }
        else{
          //  console.log('here')
            Customer.Customer.findOneAndUpdate({'customerId':userobj.customerId},{$push:{addressArray:address},
            $set:{'defaultAddId':(isdefault==true)?address.addId:maindoc.defaultAddId}},{new:true},(err,doc)=>{
                if(err){
                    res.status(409).json({status:config.ERROR,message:err});
                }else{
                   // console.log(doc);
                    res.status(200).json({"status":config.SUCCESS, "isEdited":true})
                }
            })
            
    }
}})},


async login(custObj){
let returnuser=null;
try{
    let customer = await Customer.Customer.findOne({'email':custObj.email});
    if(customer!=null){
        returnuser=customer;
    }
    return returnuser;

}catch(e){
return returncustomer='error';

}

},
getData(userobj,res){
   // console.log(userobj);
    Customer.Customer.findOne({'customerId':userobj.customerId},(err,user)=>{
        if(err){
            res.status(409).json(err);
        }
        else{
            if(user!=null){
            let returnuser={
                firstName:user.firstName
            }
            res.status(200).json(returnuser);

        }else{
            res.status(409).json('No Data Found');
        }}
    })
    
}
}
module.exports=customerCrud