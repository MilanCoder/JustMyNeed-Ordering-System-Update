const Emp=require("../schemas/empSchema");
const Uid=require("uuid/v1");
const fs=require("fs");
const path=require("path");
const mailUser=require('../../Utils/nodemailer')
const passwordEncryptor=require('../../Utils/passwordEncryptor')



// console.log(path.join(__dirname,'../../docUploads/policeVerification'));
// console.log(__dirname);

const empCrud={
//milan
    doLogin(req,res,object){
        
        console.log('came here later');
        Emp.findOne(object.email,(err,data)=>{
            if(err){
                res.json(err);
            }
            else{
                if(passwordEncryptor.verifyPassword(object.password,data.password)==true){
                res.json(data);
                }
            }
        });
    },
//naveen
    doRegister(req,res,object){

       console.log(object.id);
        //method to create objeccts in db
        Emp.findOne({email:object.email,mobile_no:object.mobile_no},function(error,result){   //checking if record already exists
            if(error){
                console.log("some error occured during querying");
            }
            else if(result==null){
                Emp.create(object,(err)=>{
                    /*if(error!=null){   //file exist validation
                        res.json(error);
                    }*/
                    if(err){
                        res.json(err);            }   //error while uploading data to db
                    else{
                        console.log("record created");
                        res.json({isPresent:false});
                        mailUser(object.email,object.name);


                    }    
                    
                    });
            }
            else{
                res.json({isPresent:true});
            }     
        })
        
    },


 

}




module.exports=empCrud;