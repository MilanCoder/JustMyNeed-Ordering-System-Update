const templateRoutes=require('express').Router();
const templateObj = require('../../models/setterGetter/templatemodel');
const templateOperations = require("../../db/crudOperations/templateOperations");
const jwtVerification = require('../../Utils/jwt/jwtverify'); 
const jwt=require('jsonwebtoken');
templateRoutes.post('/savetemplate',jwtVerification.verifyToken,(req,res)=> {
    jwt.verify(req.token,jwtVerification.adminSecurekey,(err,authData)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:'Session TimeOut'})
        }else{
    let templateObject = req.body.template;
    for(let key in templateObject){
        templateObj[key]=templateObject[key];
    } 
    templateOperations.addTemplateData(templateObj,res);}
   
})
});
templateRoutes.get('/gettemplatedata',(req,res)=> {
    templateOperations.findTemplateData(res);
})

templateRoutes.post('/getTemplateByVouchercode',(req,res)=>{
    console.log(req.body);
    templateOperations.findTemplateByCode(req.body.templateId,res);
})
module.exports=templateRoutes;