const footer=require('express').Router();
const footerOperations = require('../../db/crudOperations/footerOperations');

footer.get('/getfooterdata',(req,res)=> {
    footerOperations.getFooterData(res);
})
module.exports=footer;