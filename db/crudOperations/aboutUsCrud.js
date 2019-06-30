const aboutUsModel=require('../schemas/aboutUsSchema');

const aboutUsOperations = {
    uploadData(userObject,res) {
        console.log(userObject);
        aboutUsModel.findOne({},(err,docs)=> {
            if(err){
                res.status(500).json({"message":"Error while finding the document in About Us CRUD"});
            }
            else if(!docs) {
                aboutUsModel.create(userObject,(err)=> {
                    if(err) {
                        res.status(500).json({"message":"Unable to add to the database "});
                            }
                    else{
                        res.status(200).json({"message":"Added to database Successfully"});
                            }
            });
            }
            else {
                aboutUsModel.findOneAndUpdate({"currentStatus":true},{"currentStatus":false},(err,docs)=> {
                    if(err) {
                        res.status(500).json({"message":"Can't find and update in the About Us CRUD"});
                    }
                    else {
                        aboutUsModel.create(userObject,(err)=> {
                            if(err) {
                                res.status(500).json({"message":"Unable to add to the database "});
                                    }
                            else{
                                res.status(200).json({"message":"Added to database Successfully"});
                                    }
                    });
                    }
                })
            }
        })
    },
    getAboutData(res) {
        //console.log('we were here 1')
        aboutUsModel.findOne({currentStatus:true},(err,doc)=> {
            if(err) {
                res.status(500).json({"message":"Error while finding the data in the database "});
            }
            else if(!doc) {
                res.status(404).json({"message":"Not Found"});
            }
            else {
                //console.log('we were here')
                res.status(200).json({"message":"Successfully find the data of about us section","data":doc});
            }
        });
        //console.log('we were here 2')
    }
}
module.exports=aboutUsOperations;