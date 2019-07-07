const templateSchema=require('../schemas/templateSchema');
const config = require('../../utils/statusconfig');
const templateOperations = {
    addTemplateData(templateObject,res) {
        templateSchema.create(templateObject,(err)=> {
            if(err) {
                res.status(500).json({"status":config.ERROR,"message":"Error while adding to database"});
            }
            else {
                res.status(200).json({"status":config.SUCCESS,"message":"Succesfully added to database"});
            }
        });
    },
    findTemplateData(res) {
        templateSchema.find({},(err,data)=> {
            if(err) {
                res.status(500).json({"status":config.ERROR,"message":"Error while findind template in database."});
            }
            else{
                res.status(200).json({"status":config.SUCCESS,"message":"Successfully find templates",data:data});
            }
        })
    },
    findTemplateByCode(id,res){
        templateSchema.findOne({templateId:id},(err,doc)=>{
            if(err){
                res.status(500).json({"status":config.ERROR,"message":"Error while findind template in database."});
         
            }else if(res==null){
                res.status(500).json({"status":config.ERROR,"message":"No Template Found"});
         
            }
            
            else{
                res.status(200).json({"status":config.SUCCESS,"message":"Successfully find templates",data:doc});
            }
        })
    }

}
module.exports=templateOperations;