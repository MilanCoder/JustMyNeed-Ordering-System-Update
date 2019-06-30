const express=require('express');
const empRoutes=express.Router();
const logger=require('../../Utils/winstonLogger');
const upload=require("../../Utils/multer/uploadFiless3");
const multer=require("multer");
const empCrud=require('../../db/crudOperations/employee');
const idGen=require('../../Utils/idGenerator/idGen');
const nullChecker=require('../../Utils/nullChecker');
const refCodeGen=require('../../Utils/referralGen/referralCode');
const passwordEncryptor=require('../../Utils/passwordEncryptor');
const empschema = require('../../db/schemas/empSchema')

 
//var empCrud=require("../../db/crudOperations/employee");
empRoutes.post('/login',(req,res)=>{
        var object={'email':req.body.email,'password':req.body.password};

        empCrud.doLogin(req,res,object);

});


//--naveen
empRoutes.post('/register',(req,res)=>{

        var object=require("../../models/setterGetter/empSetGet");
        nullChecker.check(req.body.uid,res);     //checking for null values
        object.id=req.body.uid;
        nullChecker.check(req.body.name,res);
        object.name=req.body.name;
        nullChecker.check(req.body.password,res);
        object.password=passwordEncryptor.generatePassHash(req.body.password,10)

        /*object.address[0].fulladdress=req.body.address.fulladdress;
        object.address[0].street=req.body.address.street;
        object.address[0].city=req.body.address.city;
        object.address[0].state=req.body.address.state;
        object.address[0].pin_code=req.body.address.pin_code;*/
        for(let key in object.address[0]){
            if(req.body.address!=null){
                for(let keyreq in req.body.address){
                    if(keyreq!=null){
                        if(key==keyreq){
                            object.address[0][key]=req.body.address[keyreq];
                        }
                    }
                }
            }
        }
        
       // nullChecker.check(req.body.mobile_no,res);
        object.mobile_no=req.body.mobile_no;
      
        object.selfReferralCode=refCodeGen.idgenerator(req.body.mobile_no);
       
        object.email=req.body.email;
        object.qualification=req.body.qualification;
        object.referralCode=req.body.refferalCode;
        object.gender=req.body.gender;
        nullChecker.check(req.body.date_of_birth,res);
        object.date_of_birth=req.body.date_of_birth;    
        nullChecker.check(req.body.typeEmployee,res);        //filling data into object to be given to db
        object.typeEmployee=req.body.typeEmployee;
        object.nomineeRel=req.body.nomineeRel;
        object.nominee=req.body.nominee;
        /*object.documents[0].GSTNumber=req.body.documents.GSTNumber;
        object.documents[0].adhno=req.body.documents.adhno;
        object.documents[0].pancardno=req.body.documents.pancardno;
        object.documents[0].bankacno=req.body.documents.bankacno;
        object.documents[0].nomineeAdhno=req.body.documents.nomineeAdhno;*/
     
                for(let keyreq in req.body.documents){
                    if(keyreq!=null){
                        if(req.body.documents[keyreq]!=''){
                            object.documents[0][keyreq]=req.body.documents[keyreq];
                        }else{
                            object.documents[0][keyreq]=null;
                        }
                    }
                }
         
      
        for(let key in object.ImageUrls[0]){
                      if(req.body.filesurl!=null){ 
                      req.body.filesurl.forEach(obj=>{
                         // console.log(obj);
                        for(let filekey in obj){
                         
                            if(filekey!=null){
                            if(key==filekey){
                                object.ImageUrls[0][key]=obj[filekey];
                            }
                        }
                      }  });
                    }
     }
                                   
       
      //  console.log(req.body.date_of_birth);

        empCrud.doRegister(req,res,object);

});
empRoutes.post('/checkUser',(req,res)=>{
    console.log(req.body.mobile_no);
    if(req.body.mobile_no!=null){
        empschema.findOne({mobile_no:req.body.mobile_no},(err,doc)=>{
            if(err){
                res.status(409).json(err);
                        }else if(doc!=null){
res.status(409).json({message:'User Already Exist'})
                        }else{
                            res.status(200).json({isPresent:false})
                        }
        })
    }else{
        res.status(409).json('Null Mobile No')
    }
})


//--naveen
empRoutes.post("/upload",(req,res)=>{

    
            upload.upload(req,res,function(err){
                if(err instanceof multer.MulterError){
                //    console.log("hi"+err);
                    logger.debug('multer error occured',err);
                    res.status(500).json(err);
                }
                else if(err){
               //console.log(err);
                    logger.debug('some error occured',err);
                    res.status(500).json(err);
        
                    
                }else{
                
              //  console.log(req.files);
              //  console.log("trying to upload file");
                logger.debug('trying to upload files');
                if(req.files!=null){
                upload.files.imageUrls.forEach(uploadObj=>{
                for(let ukeys in uploadObj){
                  
                   for(let key in req.files){
                    if(key==ukeys){
                    uploadObj[ukeys]=req.files[key][0].location; 
                }
          
              };
        }
        })
                 
                }
               
               // upload.files.id=req.files;
               upload.files.id=idGen.idgenerator(req.body.mobile_no);
               if(upload.files.id==null){
                   res.status(500).json("please provide the mobile no");
               }
               else{
               console.log(upload.files);
               
                res.json(upload.files);
               }   
            }         
    
        
         
            })
        
      
}); 
    
    
module.exports=empRoutes;