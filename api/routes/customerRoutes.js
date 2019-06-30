const express = require('express');
const customerRoutes = express.Router();
const customerCrud=require('../../db/crudOperations/customerCrud')
const passport = require('passport')
const customer= require('../../models/setterGetter/customer.model')
const orderCrud= require('../../db/crudOperations/orderCrud');
const order= require('../../models/setterGetter/order.model');
const jwt=require('jsonwebtoken');
const delivDetailCrud= require('../../db/crudOperations/deliveryCrud');
const checkAddress=require('../../Utils/middleware/checkaddress')
const passwordEncryptor=require('../../Utils/passwordEncryptor');
const jwtVerification = require('../../Utils/jwt/jwtverify');
const config = require("../../Utils/statusconfig");
//const cartObject=require("../../models/setterGetter/cartmodel");
const checkQuantity=require('../../Utils/middleware/checkQuantity');
const cartOperations = require('../../db/crudOperations/cartCrud');
const respmsg= require('../../Utils/comments');
const checkOrder=require('../../Utils/middleware/checkOrder');
const delLevelCrud=require('../../db/crudOperations/delivLevelCrud');

customerRoutes.post('/cart/addProduct',jwtVerification.verifyToken,checkQuantity,(req,res)=> {
    // let stackTrace=req.body.stackTrace;
    jwt.verify(req.token,jwtVerification.custSecurekey,(err,authData)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:'JWT Error'});
        }else{
          
            if(req.body.crud=='add') {
                
                cartOperations.addToCart(req.body.stackTrace,req.body.cartProduct,authData.userobj,res);
            }else{
                res.status(409).json({status:config.ERROR,message:'Not Valid Entry'});
            }
        }
    })
});
customerRoutes.get('/cart/getCartData',jwtVerification.verifyToken,(req,res)=>{
    jwt.verify(req.token,jwtVerification.custSecurekey,(err,authData)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:'JWT Error'});
        }else{
            cartOperations.getCartData(authData.userobj.customerId,res);
        }})
})

customerRoutes.post('/cart/deleteProduct',jwtVerification.verifyToken,(req,res)=> {
    jwt.verify(req.token,jwtVerification.custSecurekey,(err,authData)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:'JWT Error'});
        }else{
            if(req.body.crud =='del'){
                let currentquantity = req.body.cartProduct.quantity;
                cartOperations.decreaseQuantity(req.body.cartProduct,authData.userobj,currentquantity,res);
            }

        }
});})

customerRoutes.post('/cart/deletecartProduct',jwtVerification.verifyToken,(req,res)=> {
    jwt.verify(req.token,jwtVerification.custSecurekey,(err,authData)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:'JWT Error'});
        }else{
           console.log(req.body);
            if(req.body!=null){
                if(req.body.cartProductId!=null){
                    cartOperations.deleteParticularItem(req.body.cartProductId,authData.userobj,res);
                }
            }
        }})

});

customerRoutes.post('/setCurrAdd',jwtVerification.verifyToken,(req,res)=> {
    jwt.verify(req.token,jwtVerification.custSecurekey,(err,authData)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:'JWT Error'});
        }else{
            if(req.body.addId!=null){
customerCrud.setCurrentAdd(authData.userobj,req.body.addId,res);
        }else{
            res.status(409).json({status:config.ERROR,message:'Null Entry'});
        
        }
    }
    })
})


customerRoutes.post('/cart/emptycart',jwtVerification.verifyToken,(req,res)=> {
    jwt.verify(req.token,jwtVerification.custSecurekey,(err,authData)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:'JWT Error'});
        }else{
           console.log(req.body);
            if(req.body!=null){
              
                    let array= req.body.cartIdArray;
                    if(array!=null){
                    cartOperations.emptyWholeCart(array,authData.userobj,res);
                    }else{
                        res.status(409).json({status:config.EMPTY,message:'Empty cart'})
                    }
            }
        }})

});

customerRoutes.get('/getOngoingOrder',jwtVerification.verifyToken,(req,res)=> { //get all incompleted orders of customer
    jwt.verify(req.token,jwtVerification.custSecurekey,(err,authData)=>{
        if(err){
res.status(409).json({status:config.ERROR,message:'JWT Error'})
        }else{
          //  console.log('here');
orderCrud.getOrder(authData.userobj,false,res);
        }
    })
})


customerRoutes.post('/getSTDelivDetails',(req,res)=>{
  
                   delivDetailCrud.getStandardDeliveryDetails(req.body.id,res);
    
})

customerRoutes.post('/getEXPDelivDetails',(req,res)=>{
   
                   delivDetailCrud.getExpressDeliveryDetails(req.body.id,res);
        
})

customerRoutes.post('/getSingleLevel',jwtVerification.verifyToken,(req,res)=> {
    jwt.verify(req.token,jwtVerification.custSecurekey,(err,authData)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:'JWT Error'});
        }else{
            delLevelCrud.getDeliveryAndSingleLevel(req.body,res);
            
        }})})

customerRoutes.get('/order/orderSum',jwtVerification.verifyToken,(req,res)=> {
    jwt.verify(req.token,jwtVerification.custSecurekey,(err,authData)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:'JWT Error'});
        }else{
          //  console.log('here');
orderCrud.orderSum(authData.userobj,res);
        }
    })
}),

customerRoutes.post('/order/placeOrder',jwtVerification.verifyToken,checkOrder,(req,res)=> {
    jwt.verify(req.token,jwtVerification.custSecurekey,(err,authData)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:'JWT Error'});
        }else{
    orderCrud.addOrder(req.order,req.timeAndTypeSlot,authData.userobj,res);
}})
})

customerRoutes.post('/filldetails',jwtVerification.verifyToken,checkAddress,(req,res)=>{
    jwt.verify(req.token,jwtVerification.custSecurekey,(err,authData)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:'JWT Error'});
        }else{
           // console.log(authData.userobj,req.addressobj,req.mobile_no)
        customerCrud.filldetails(authData.userobj,req.addressobj,req.isdefault,res)
        }
})
})
customerRoutes.post('/order/singleOrder',jwtVerification.verifyToken,(req,res)=>{  //single order based on param
    jwt.verify(req.token,jwtVerification.custSecurekey,(err,authData)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:'JWT Error'});
        }else{
            orderCrud.getSingleOrder(req.body.orderId,authData.userobj,res);
       
        }
    })
    })

customerRoutes.get('/getAddressData',jwtVerification.verifyToken,(req,res)=>{
    jwt.verify(req.token,jwtVerification.custSecurekey,(err,authData)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:'JWT Error'});
        }else{
          
            customerCrud.getCustomerAddress(authData.userobj,res);
        }
    })
})

customerRoutes.get('/getProfileData',jwtVerification.verifyToken,(req,res)=>{
    jwt.verify(req.token,jwtVerification.custSecurekey,(err,authData)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:'JWT Error'});
        }else{
          
            customerCrud.getData(authData.userobj,res);
        }
    })
})


customerRoutes.post('/auth/login' ,async (req,res)=>{
let loginObj={'email':req.body.email,'password':req.body.password};
let userobj= await customerCrud.login(loginObj);
if(userobj!=null && userobj!='error'){
if(passwordEncryptor.verifyPassword(loginObj.password,userobj.password)==true){
    jwt.sign({userobj},jwtVerification.custSecurekey,{expiresIn:'100000s'},(err,token)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:err})
        }else{
        res.json({
            'custToken':token
         })
    }
    })
}else{
    res.status(500).json({status:config.ERROR,message:'Invalid Password'})
}


}else{
    res.status(500).json({status:config.ERROR,message:'No User Found'});
}
})

customerRoutes.post('/auth/signup',async (req,res)=>{
    //console.log(req.body);
    let custClass=customer.customerModel;
     let custObj= new custClass();
for(let key in req.body.customerData){
    if(key=='password'){
custObj[key]=passwordEncryptor.generatePassHash(req.body.customerData[key],10);
    }
    else{
   custObj[key]=req.body.customerData[key];
}}
custObj.createdAt=Date.now();
let userobj = await customerCrud.signUp(custObj);



if( userobj!='error' &&  userobj!=null){
    if( userobj ==respmsg.isalreadypresent){
            res.status(409).json({status:config.ERROR,message:userobj})
        
    }else{
jwt.sign({ userobj },jwtVerification.custSecurekey,{expiresIn:'100000s'},(err,token)=>{
    if(err){
        res.status(409).json({status:config.ERROR,message:err})
    }else{
    res.json({
        'custToken':token
     })}
})
}}
})



customerRoutes.get('/auth/facebook',passport.authenticate('facebook'));

customerRoutes.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));

customerRoutes.get('/dashboard',passport.authenticate('google'), (req,res)=> {
    console.log("request user inside the request ", req.user);
    res.send("Welcome User "+req.user.name);
})

module.exports=customerRoutes;