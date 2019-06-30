const footerModel=require('../../db/schemas/footerSchema');
const config = require('../../Utils/statusconfig');
const footerOperations = {
    uploadFooterData(footerObject,res) {
        footerModel.findOne({},(err,docs)=> {
            if(err){
                res.status(500).json({"message":"Error while finding the document in Footer CRUD","status":config.ERROR});
            }
            else if(!docs) {
                footerModel.create(footerObject,(err)=> {
                    if(err) {
                        res.status(500).json({"message":"Unable to add to the database ","status":config.ERROR});
                            }
                    else{
                        res.status(200).json({"message":"Added to database Successfully","status":config.SUCCESS,isPushed:true ,"footerobject":footerObject});
                            }
            });
            }
            else {
                footerModel.findOneAndUpdate({"currentStatus":true},{"currentStatus":false},(err)=> {
                    if(err) {
                        res.status(500).json({"message":"Can't find and update in the Footer CRUD","status":config.ERROR});
                    }
                    else {
                        footerModel.create(footerObject,(err)=> {
                            if(err) {
                                res.status(500).json({"message":"Unable to add to the database ","status":config.ERROR});
                                    }
                            else{
                                res.status(200).json({"message":"Added to database Successfully","status":config.SUCCESS, isPushed:true,"footerobject":footerObject});
                                    }
                    });
                    }
                })
            }
        })
    },
    getFooterData(res) {
        footerModel.findOne({"currentStatus":true},(err,doc)=> {
            if(err) {
                res.status(500).json({"message":"Error while finding the data in the database ","Status":config.ERROR});
            }
            else if(doc==null) {
                res.status(404).json({"message":"Not Found","Status":config.NOT_FOUND});
            }
            else {
                res.status(200).json({"message":"Successfully find the data of about us section","data":doc,"status":config.SUCCESS});
            }
        });
    }
}
module.exports=footerOperations;