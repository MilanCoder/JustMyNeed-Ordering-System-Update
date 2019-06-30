const config=require('../statusconfig');

const customer = require('../../models/setterGetter/customer.model');
const idgen= require('../idGenerator/idGen');
function checkaddress(req,res,next) {
   // console.log(req.body);
   let Address= customer.address;
  let addressobj =  new Address();
  if(req.body!=null){
  let delivdetails = req.body.delivdetails;
    try{
for(let key in addressobj){
 addressobj[key]=delivdetails.address[key];
}
addressobj.addId=idgen.idgenerator(addressobj.city);
req.addressobj=addressobj;
req.isdefault=delivdetails.address.isDefault;
console.log(addressobj);

next();
}

catch(e){
    res.status(500).json({'status':config.ERROR})


}

}else{
    res.status(500).json({'status':config.ERROR})

}

  
}
module.exports=checkaddress;