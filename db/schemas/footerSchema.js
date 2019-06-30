const mongoose = require('../connection');
const footerSchema = mongoose.Schema;
const footer = new footerSchema({

    date:{type:Date},
    currentStatus:{type:Boolean},
    titleFooter:[{
        titleName:String,
        titleList:[{
            listName:String,
            listLink:String
        }]
    }]
});
const Footer = mongoose.model('footers',footer);
module.exports=Footer;