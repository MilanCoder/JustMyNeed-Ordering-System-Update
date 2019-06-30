const multer=require('multer');
const path=require('path');
const awskey = require('./awskey');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

aws.config.update({
    secretAccessKey: awskey.secretAccessKey,
    accessKeyId: awskey.accessKeyId,
  region: "ap-south-1"
});

const s3 = new aws.S3();

function checkFileType(file,cb){
    const filetypes =/jpeg|png|jpg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if(extname && mimetype){
        return cb(null,true)
    }else{
        return cb('error message');
    }
    }
  
  
const upload = multer({
    storage:multerS3({
      s3: s3,
      bucket: "big-basket-state-store",
      acl: 'public-read-write',
      metadata: function(req, file, cb){
          cb(null, {fieldName: file.fieldname});
      },
      key: function(req, file, cb){
          cb(null,file.fieldname +' '+req.body.categoryId+'-'+req.body.subcategoryId+'-'+req.body.productId+'-'+req.body.subproductId+'-'+req.body.index+' '+Date.now());  }
    }),
   limits:{fileSize:2000000},
   fileFilter:function(res,file,cb){
        checkFileType(file,cb)
    }
  }).single('myImage');


  module.exports=upload;