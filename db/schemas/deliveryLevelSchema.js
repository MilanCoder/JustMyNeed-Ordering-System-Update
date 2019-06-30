const mongoose = require('../connection');

const Level = mongoose.Schema({
    levelIndex:Number,
    levelMessage:String
})
const deliverylevel= mongoose.Schema({
    levelId:String,
    maxLevel:Number,
    levels:[
   Level
    ]
})


module.exports= {
    Deliverylevel:mongoose.model('deliverylevels',deliverylevel),
    Level:mongoose.model('levels',Level)
}