const express=require('express');
const adminRoutes=express.Router();
const logger=require('../../Utils/winstonLogger');
const jwt=require('jsonwebtoken');
const multer=require('multer');
const config= require('../../Utils/statusconfig');
const xlstojson = require("xls-to-json-lc");
const xlsxtojson = require("xlsx-to-json-lc");
const nullChecker=require('../../Utils/nullChecker');
const adcrud = require('../../db/crudOperations/adCrud');
const upload=require('../../Utils/multer/commonExcelUpload');    //requiring multer for excel upload
const upload2=require('../../Utils/multer/productImagess3');   //requiring multer s3 for image upload
const adupload = require('../../Utils/multer/adImageFiles');
const jwtVerification = require('../../Utils/jwt/jwtverify');      //secret key of webtokens
const productCrud=require('../../db/crudOperations/Product'); 
const adminCrud=require('../../db/crudOperations/adminCrud');
const s3=require('../../Utils/multer/getImageFiles');
const addressCrud=require('../../db/crudOperations/addressCrud');
const aboutUsOperations=require('../../db/crudOperations/aboutUsCrud');
const addressModel=require('../../models/addressModel');
const aboutObject=require('../../models/setterGetter/aboutUs');
const SubTitleModel=require('../../models/subTitleModel');
const singleUpload=upload.single('address');
const footerOperations = require('../../db/crudOperations/footerOperations');
const footerObject=require('../../models/footermodel');
const titleListModel=require('../../models/titlelistmodel');
const titlefootermodel=require('../../models/titlefootermodel');
const delivLevCrud= require('../../db/crudOperations/delivLevelCrud');
const orderCrud = require('../../db/crudOperations/orderCrud');
const customerCrud=require('../../db/crudOperations/customerCrud');
const joins=require('../../Utils/productJoins');
const idGen=require('../../Utils/idGenerator/idGen');
const multipleUpload=upload.fields([
    {
      name:'categories'
    },
    {
      name:'subcategories'
    },                                 //keys of files incoming
    {
      name:'products'
    },
    {
      name:'subproducts'
    },{
        name:'priceAndAmount'
    }
    ]);        

      
adminRoutes.get('/getDelivLevels',(req,res)=>{
 delivLevCrud.getdelivLevels(res);
})

adminRoutes.post('/addDelivLevel',jwtVerification.verifyToken,(req,res)=>{
    jwt.verify(req.token,jwtVerification.adminSecurekey,(err,authData)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:'Session TimeOut'})
        }else{
           let delivobj= req.body.delivlevobj;
            delivLevCrud.adddelivLevel(delivobj,res);
        }
    })
})
adminRoutes.post('/editDelivLevel',jwtVerification.verifyToken,(req,res)=>{
    jwt.verify(req.token,jwtVerification.adminSecurekey,(err,authData)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:'Session TimeOut'})
        }else{
           let delivobj= req.body.delivlevobj;
            delivLevCrud.editdelivLevel(delivobj,res);
        }
    })
})


adminRoutes.post('/deleteDelivLevel',jwtVerification.verifyToken,(req,res)=>{
    jwt.verify(req.token,jwtVerification.adminSecurekey,(err,authData)=>{
        if(err){
            res.status(409).json({status:config.ERROR,message:'Session TimeOut'})
        }else{
           let delivobj= req.body.delivlevobj;
            delivLevCrud.deletedelivLevel(delivobj,res);
        }
    })
})


//--naveen

adminRoutes.post('/upload',function(req,res){
    /* dont mess with multer the req above and below are not even same*/
    var xlsxj; //Initialization
   
    multipleUpload(req,res,async function(err){
        //jwt.verify(req.body.idToken,securekey,(error,authData)=>{     //checking if token is present or not
            //if(error){
            //    res.json("session timed out");
            //}
            //else{
        if(err instanceof multer.MulterError){  
            console.log(err);
        }else if(err){
            //console.log(req.file)
            res.json(err);    
        }
        //console.log(req.files);
        if(req.files.categories[0].originalname.split('.')[req.files.categories[0].originalname.split('.').length-1] === 'xlsx'){
            xlsxj = xlsxtojson;
        } else {
            xlsxj = xlstojson;
        }

        try {
            var categories=[];
            var subcategory=[];
            var products=[];
            var subProducts=[];
            var priceAndAmount=[];
            for(let key in req.files){
                //console.log(key);
            var pr=await new Promise(function(resolve,reject){
            xlsxj({
                input: req.files[key][0].path, 
                output: null,
                lowerCaseHeaders:true
            }, function(err,result){
                if(err) {
                    // return new Promise(function(resolve,reject){
                    //     reject({msg:'some error occured'});
                    // })
                    reject('some error occured');
                    res.json({error_code:1,err_desc:err, data: null});
                } 
                if(result!=null){
                   // productCrud.uploadProducts(req,res,result);
                    //console.log(result);
                    if(key=='categories'){
                        
                        for(let category of result){
                            let category1={
                                categoryId:category.categoryid,
                                categoryName:category.categoryname,
                                childIds:[],
                                subcategory:[]
                            }
                            category1.childIds=convertArray(category.childids);
                            categories.push(category1);
                            //console.log(categories);
                        }
                    }
                    if(key=='subcategories'){
                        
                        for(let subcat of result){
                            let subcategory1={
                                subcategoryId:subcat.subcategoryid,
                                subcategoryName:subcat.subcategoryname,
                                childIds:[],
                                products:[]
                            }       //converted string into array and
                                    //defined structure
                            subcategory1.childIds=convertArray(subcat.childids);
                            subcategory.push(subcategory1);
                        }
                    }
                    if(key=='products'){
                        
                        for(let product of result){
                            let product1={
                                productId:product.productid,
                                productName:product.productname,
                                childIds:[],
                                subProducts:[]
                            }
                            product1.childIds=convertArray(product.childids);
                            products.push(product1);
                        }
                    }
                    if(key=='subproducts'){
                        
                        for(let subproduct of result){
                            let subproduct1={
                                subproductId:subproduct.subproductid,
                                subproductName:subproduct.subproductname,
                                categoryId:null,
                                subcategoryId:null,
                                productId:null,
                                info:{
                                    isExpress:subproduct.isExpress,
                                    brand:subproduct.brand,
                                    description:subproduct.description,
                                    benefitsAndUses:subproduct.benefitsanduses,
                                    priceAndAmount:[]
                                },
                            }
                            subProducts.push(subproduct1);
                        }
                    }
                    if(key=='priceAndAmount'){
                        priceAndAmount=result;
                    }
                    // return new Promise(function(resolve,reject){
                    //     console.log('returning promise');
                    //     resolve({msg: result});
                    // })
                    resolve('ok');

                }
                else{
                    reject('some error occured');
                }

                //productCrud.uploadProducts(req,res,obj);
                // result.forEach(obj=>{
                //     productCrud.uploadProducts(req,res,obj);                         //pushing objects to db after traversing
                // })
                
                //res.json({error_code:0,err_desc:null, data: result});
            });
            })
            //await wait(5000);

            }
            if(pr){

            // async.waterfall([
                
            // ])
            //console.log('join occured');
            //console.log(categories);
            //console.log(subcategory);
            //console.log(products);
            //console.log(subProducts);
            console.log(priceAndAmount);
            subProducts=joins.joinSubproducts(subProducts,priceAndAmount);
            //console.log(subProducts);
            //products=joinProducts(products,subProducts);
            //console.log(products);
            //subcategory=joinSubcategory(subcategory,products);
            //var finalJson=joinExcelData(categories,subcategory);
            //console.log(finalJson);
            //console.log("we were here1")
            subProducts=joins.createFieldsInSubProduct(categories,subcategory,products,subProducts);
            console.log(subProducts);
            //console.log(subProducts)
            productCrud.uploadProducts(req,res,categories,subcategory,products,subProducts);
            }
            

        } catch (e){
            console.log(e);
            res.json({error_code:1,err_desc:"Corupted excel file"});
        }
    //}
    //})
    })

        
   // })
    
});
adminRoutes.post('/admincustomerData',jwtVerification.verifyToken,(req,res)=>{
    jwt.verify(req.token,jwtVerification.adminSecurekey,(error,authData)=>{
        if(error){
            res.status(409).json({status:config.ERROR,message:'Session TimeOut'});
        }
        else{
    customerCrud.getCustomer(req.body.id,res);
}
})
})

adminRoutes.post('/setOrderLevel',jwtVerification.verifyToken,(req,res)=>{
    jwt.verify(req.token,jwtVerification.adminSecurekey,(error,authData)=>{
        if(error){
            res.status(409).json({status:config.ERROR,message:'Session TimeOut'});
        }
        else{
            delivLevCrud.setOrderLevel(req.body,res);
        }})})

adminRoutes.post('/currentOrders',jwtVerification.verifyToken,(req,res)=>{
    jwt.verify(req.token,jwtVerification.adminSecurekey,(error,authData)=>{
        if(error){
            res.status(409).json({status:config.ERROR,message:'Session TimeOut'});
        }
        else{
            let dateobj= req.body.date;
            orderCrud.getCurrentOrders(dateobj,res);

        }})
})

//--milan
adminRoutes.post('/getImagesUrl',(req,res)=>{
    let returnImagesArray={};
    for(let key of req.body.keyArray){
        console.log(key+' '+req.body.mobile_no+'.png',req.body.keyArray)
 let params={Bucket:'big-basket-bucket',Key:key+' '+req.body.mobile_no}; //seconds

 s3.getObject(params,(err,data)=>{
     if(err){
        returnImagesArray={};
     }
   else if(url!=null){
        console.log(url);
        returnImagesArray[key]=url;
    }
});
 
}
res.json({'Images':returnImagesArray});
}
)

//--naveen
adminRoutes.post('/editProducts',jwtVerification.verifyToken,(req,res)=>{
   
    
    jwt.verify(req.token,jwtVerification.adminSecurekey,(error,authData)=>{
        if(error){
            res.json("token not valid or session timed out");
        }
        else{
            //console.log("its here");
          // nullChecker.check(req.body.products,res);
            productCrud.editProducts(req,res);
        }
    })
    
})
//--naveen
adminRoutes.post('/editCategoryList',jwtVerification.verifyToken,(req,res)=>{
    jwt.verify(req.token,jwtVerification.adminSecurekey,(error,authData)=>{
        if(error){
            res.status(500).json("token not valid or session timed out");
        }
        else{
            console.log(req.body);
          //  nullChecker.check(req.body.categorylist,res);
            var categories=[];
            var subcategory=[];
            var products=[];
            var subProducts=[];
            for(let category of req.body.categorylist){
                //do this
                let catobj={categoryId:category.categoryId,
                        categoryName:category.categoryName,
                        childIds:category.childIds,
                        subcategory:[]
                    }
                categories.push(catobj);
                console.log(categories);
                for(let subcat of category.subcategory){
                    let subcatobj={subcategoryId:subcat.subcategoryId,
                        subcategoryName:subcat.subcategoryName,
                        childIds:subcat.childIds,
                        products:[]
                    };
                    subcategory.push(subcatobj);
                    console.log(subcategory);
                    for(let product of subcat.products){
                        let proobj={productId:product.productId,
                            productName:product.productName,
                            childIds:product.childIds,
                            subProducts:[]
                        };
                        products.push(proobj);
                        console.log('here');
                        for(let subproduct of product.subProducts){
                            console.log(subproduct);
                            let priceArray=[];
                                if(subproduct.info.priceAndAmount){ 
                                    for(let obj4 of subproduct.info.priceAndAmount){
                                         priceArray.push(obj4);
                                }}
                                let imageArray=[];
                                if(subproduct.imageUrls){
                                for(let obj5 of subproduct.imageUrls){
                                    let obj6={
                                        uri: obj5.uri,
                                        key: obj5.key
                                    }
                                    imageArray.push(obj6);
                                }}
                            let subproobj={
                                    categoryId:category.categoryId,
                                    subcategoryId:subcat.subcategoryId,
                                    productId:product.productId,
                                    categoryName:category.categoryName,
                                    subcategoryName:subcat.subcategoryName,
                                    productName:product.productName,
                                    subproductId:subproduct.subproductId,
                                    subproductName:subproduct.subproductName,
                                    info:{
                                        isExpress:subproduct.info.isExpress,
                                        brand:subproduct.info.brand,
                                        description:subproduct.info.description,
                                        benefitsAndUses:subproduct.info.benefitsAndUses,
                                        priceAndAmount:priceArray,
                                    },
                                    imageUrls:imageArray
                                }
                        subProducts.push(subproobj);
                        console.log(subProducts);
                        }
                    }
                }
            }
            subProducts=joins.createFieldsInSubProduct(categories,subcategory,products,subProducts);
            productCrud.uploadProducts(req,res,categories,subcategory,products,subProducts);
        }
    })
})
//--naveen
adminRoutes.post('/imageUpload',(req,res)=>{
  
            upload2(req,res,function(err){
                
                jwt.verify(req.body.idToken,jwtVerification.adminSecurekey,(error,authData)=>{
                    
                    if(error){
                    res.status(401).json("Session TimeOut ,Please login again");
                    }
                    else{
                        if(err){
                            res.status(401).json(err);
                        }else{

           //    console.log(req.body,req.file,req.body.files);
                 //push url to db
              //  console.log(req.file,req.body);
                    nullChecker.check(req.file,res);
                    var obj={"uri":req.file.location,'key':req.file.key};
                    if(req.file.location!=null && req.file!=null){
                    productCrud.imageUpload(req,res,obj);
                    }else{
                        res.json(401).json('No File Uploaded')
                    }
                 } }})
                })
            
                
})
//--milan

adminRoutes.post('/imageDelete',jwtVerification.verifyToken,(req,res)=>{
    console.log(req.body)
        jwt.verify(req.token,jwtVerification.adminSecurekey,(error,authData)=>{
            
            if(error){
                res.status(401).json("Session TimeOut ,Please login again");
            }
            else{

            productCrud.deleteImageBackend(req,res);
        
            }})
        
    


})


//--milan
adminRoutes.post('/login',async function(req,res){
    var adminData= await adminCrud.login({'id':req.body.id, 'name':req.body.name, 'password':req.body.password});
 //console.log(adminData)
 
     if(adminData!=null){
    if(req.body.password == adminData.password){
        jwt.sign({adminData},jwtVerification.adminSecurekey,{expiresIn:'10000s'},(err,token)=>{ 
            //token is generated after checking the presence of user
            if(err){
                res.status(500).json(err);
            }
            else{
res.json({
   token:token
})
}})}else{   
     res.status(401).json('Incorrect Password');

}}else{
    res.status(401).json('No Such Entry Found');
}

    })
      
//--milan
adminRoutes.get('/getUnverifiedEmployee',jwtVerification.verifyToken,(req,res)=>{
  //  console.log('i  m unverifiied');
    jwt.verify(req.token,jwtVerification.adminSecurekey,(error,authData)=>{
            
        if(error){
            res.status(401).json("Session TimeOut ,Please login again");
        }
        else{

   
    adminCrud.getUnverifiedEmployees(res);
        }})
})
//--milan

adminRoutes.get('/getVerifiedEmployee',jwtVerification.verifyToken,(req,res)=>{
   // console.log('i m here verify')
    jwt.verify(req.token,jwtVerification.adminSecurekey,(error,authData)=>{
            
        if(error){
            res.status(401).json("Session TimeOut ,Please login again");
        }
        else{

    adminCrud.getVerifiedEmployees(res);}})
})
//--milan
adminRoutes.post('/verifyUser',jwtVerification.verifyToken,(req,res)=>{
    jwt.verify(req.token,jwtVerification.adminSecurekey,(error,authData)=>{
            
        if(error){
            res.status(401).json("Session TimeOut ,Please login again");
        }
        else{

    adminCrud.verifyEmployee(req.body.id,res);}})
})
//--milan
adminRoutes.post('/unVerifyUser',jwtVerification.verifyToken,(req,res)=>{
    jwt.verify(req.token,jwtVerification.adminSecurekey,(error,authData)=>{
            
        if(error){
            res.status(401).json("Session TimeOut ,Please login again");
        }
        else{

    adminCrud.unVerifyEmployee(req.body.id,res);}})
})

//--Milan
adminRoutes.post('/pushAd',jwtVerification.verifyToken,(req,res)=>{
    jwt.verify(req.token,jwtVerification.adminSecurekey,(error,authData)=>{
            
        if(error){
            res.status(401).json("Session TimeOut ,Please login again");
        }
        else{
        //    console.log('i m here');
           let obj ={'crud':req.body.crud,'data':req.body.data,'oldref':req.body.oldref};
   adcrud.pushAd(obj,res);
}
})
})
//--Milan
adminRoutes.post('/adImageAdd',(req,res)=>{
adupload(req,res,function(err){
    
    if(err){
        
        res.status(403).json('Upload Error')
    }else{
    
    var obj = {'crud':req.body.crud,'category':req.body.category,'label':req.body.label,'imageUrl':req.file.location ,'imagekey':req.file.key,'oldlabel':req.body.oldlabel};
   adcrud.imageCrud(obj,res);
    }
})
})

adminRoutes.post('/adDelete',jwtVerification.verifyToken,(req,res)=>{
    jwt.verify(req.token,jwtVerification.adminSecurekey,(error,authData)=>{
            
        if(error){
            res.status(401).json("Session TimeOut ,Please login again");
        }else{
       //  console.log(req.body.crud,req.body.category);
            var obj={'crud':req.body.crud,'data':req.body.category};
            adcrud.deleteAd(obj,res);
        }})
})

//operations for address management
adminRoutes.post('/bulkAddUpload',(req,res)=>{
    singleUpload(req,res,function(err){
        if(err instanceof multer.MulterError){
            console.log(err);
        }else if(err){
            //console.log(req.file)
            res.json(err);    
        }
        //console.log(req);
        if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
            exceltojson = xlsxtojson;
        } else {
            exceltojson = xlstojson;
        }

        try {
            exceltojson({
                input: req.file.path,
                output: null, //since we don't need output.json
                lowerCaseHeaders:true
            }, function(err,result){
                if(err) {
                    return res.json({error_code:1,err_desc:err, data: null});
                } 
                else if(result!=null){
                console.log(result);
                //do whatever you want
                var dataArr=[];
                for(let data of result){
                    let object={
                        city:data.city,
                        areaId:idGen.idgenerator(data.pincode),
                        areaName:data.areaname,
                        pincode:data.pincode,
                        status:data.status
                    }
                    dataArr.push(object)
                }
                addressCrud.addBulkAddress(res,dataArr);
                }
                //res.json({error_code:0,err_desc:null, data: result});
            });
        } catch (e){
            logger.debug('some error occured during adding new address inside multer');
            res.json({error_code:1,err_desc:"Corupted excel file"});
        }
    })
})

adminRoutes.post('/singleAddCrud',(req,res)=>{
    if(req.body.optype=='add'){
        // let object={
        //     city:req.body.city,
        //     areaId:idGen.idgenerator(req.body.pincode),
        //     areaName:req.body.areaName,
        //     pincode:req.body.pincode,
        //     status:req.body.status
        // }
        let object=new addressModel(req.body.city,idGen.idgenerator(req.body.pincode),
                        req.body.areaName,req.body.pincode,req.body.status);
        addressCrud.addAddress(res,object);
    }
    else if(req.body.optype=='delete'){
       
        let object=new addressModel(req.body.city,req.body.areaId,
                        req.body.areaName,req.body.pincode,req.body.status)
        addressCrud.deleteAddress(res,object);
    }
    else if(req.body.optype=='edit'){

        let object=new addressModel(req.body.city,req.body.areaId,
                        req.body.areaName,req.body.pincode,req.body.status)
        addressCrud.updateAddress(res,object);
    }
})
//footer data management by admin
adminRoutes.post('/saveabout',jwtVerification.verifyToken,(req,res)=> {
    jwt.verify(req.token,jwtVerification.adminSecurekey,(error,authData)=>{
            
        if(error){
            res.status(401).json("Session TimeOut ,Please login again");
        }else{
    console.log(req.body);
    // for(let key in aboutObject) {
            // if(key=="aboutTitle"){
            let aboutTitle=aboutObject.aboutTitle;
            aboutTitle.titleName=req.body.titleName;
            let titleParagraph=aboutTitle.titleParagraph[0];
            titleParagraph.paragraph=req.body.titleParagraph.paragraph;
            titleParagraph.lists=req.body.titleParagraph.lists;
            let aboutSubTitle=aboutObject.aboutSubTitle;
            if(aboutSubTitle.length>0) {
                aboutSubTitle.length=0;
            }
            let bodyAboutSubTitle=req.body.aboutSubTitle;
                var subTitleName= bodyAboutSubTitle.subTitleName;
                var subTitleParagraphs= bodyAboutSubTitle.subTitleParagraphs;
                var objectSub=new SubTitleModel(subTitleName,subTitleParagraphs);
                aboutSubTitle.push(objectSub);
            
            // break;
        // }
    // }
    aboutUsOperations.uploadData(aboutObject,res);
    // aboutSubTitle.length=0;
        }})
});
adminRoutes.get('/getaboutdata',(req,res)=> {
    //console.log("Inside GetAbout")
    aboutUsOperations.getAboutData(res);
})



adminRoutes.post('/savefooter',jwtVerification.verifyToken,(req,res)=> {
    jwt.verify(req.token,jwtVerification.adminSecurekey,(error,authData)=>{
            
        if(error){
            res.status(401).json("Session TimeOut ,Please login again");
        }else{
    let titleFooterPrevious=footerObject.titleFooter;
    if(titleFooterPrevious.length>0) {
        titleFooterPrevious.length=0;
    }
    let titleFooter=req.body.titleFooter;
    titleFooter.forEach((eachFooterTitle)=> {
        let titleList=[];
        let titleName=eachFooterTitle.titleName;
        let titleListArray=eachFooterTitle.titleList;
        titleListArray.forEach((listItem)=> {
                for(let key in listItem) {
                    if(key=="listName"){
                        var listName=listItem[key];
                    }
                    else {
                        var listLink=listItem[key];
                    }
                }
                let listObject=new titleListModel(listName,listLink);
                titleList.push(listObject);
        });
        let titleFooterObject=new titlefootermodel(titleName,titleList);
        titleFooterPrevious.push(titleFooterObject);
    });
    footerOperations.uploadFooterData(footerObject,res);
        }})
});




 
  //--naveen
function convertArray(string){
    var array=[];
    array=string.split(' ');           //converting combined ids into array of ids
    console.log(array);
    return array;
}





module.exports=adminRoutes;