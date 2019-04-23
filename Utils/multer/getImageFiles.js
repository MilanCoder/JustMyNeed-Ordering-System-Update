const multer=require('multer');
const path=require('path');

const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

aws.config.update({
  secretAccessKey: "iPFs+LPp03dKtWubQGh+QiQATp/9iSPS+d+Oyhyo",
  accessKeyId: "AKIA4ISG5BEOO5B2MXBN",
  region: "ap-south-1"
});

const s3 = new aws.S3();

module.exports=s3;