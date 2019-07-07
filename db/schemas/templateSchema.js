const mongoose = require('../connection');
const templateSchema=mongoose.Schema;
const autoIncrementId=require('mongoose-auto-increment');
autoIncrementId.initialize(mongoose);
const template = new templateSchema({
        templateId:{type:Number,unique:true},
        templateData:{type:String}
});
template.plugin(autoIncrementId.plugin, { 
    model: 'Template',
    field: 'templateId',
    startAt: 1,
    incrementBy: 1
});
const Template = mongoose.model('templates',template);
module.exports=Template;