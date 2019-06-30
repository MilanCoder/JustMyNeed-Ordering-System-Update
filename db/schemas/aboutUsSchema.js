const mongoose = require('mongoose')
const aboutSchema = mongoose.Schema;
const about = new aboutSchema({
    date:{type:String},
    currentStatus:{type:Boolean},
    aboutTitle :{
        titleName:{type:String},
        titleParagraph:[{
            paragraph:[],
            lists:[]
        }]
    },
    aboutSubTitle:[{
        subTitleName:{type:String},
        subTitleParagraphs:[]
    }]
});
const About = mongoose.model('aboutus',about);
module.exports=About;