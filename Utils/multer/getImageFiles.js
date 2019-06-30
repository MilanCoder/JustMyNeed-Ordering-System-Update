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

module.exports=s3;