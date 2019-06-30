//const mongoose = require('mongoose');
const mongoose=require("../connection");
const Schema= mongoose.Schema;

 const params= new mongoose.Schema({
     keyword:String,
     value:String,
     category:String
 })
const imageobj=new mongoose.Schema({
    url:String,
    key:String
})

const subads= new mongoose.Schema({
    label:String,
    link:String,
    imageobj:imageobj,
    priority:Number,
    status:String,
    params:[params]
    
     })
    
 const ads = new mongoose.Schema({
     typeOfAd:String,
category:String,
layout:String,
noOfAds:String,
priority:Number,
subAds:[
subads
]
})

module.exports={
    ads:mongoose.model('ads',ads),
    subads:mongoose.model('subads',subads),
    params:mongoose.model('params',params),
   imageobj:mongoose.model('imageobj',imageobj)

}
