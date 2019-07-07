const ejs=require('ejs');
const path=__dirname+"/views/contactusTemplate.ejs";
function userTemplate(name,otpOrder) {
    console.log(path);
    var pr =new Promise((resolve,reject)=> {
        ejs.renderFile(path,{name:name,otpOrder:otpOrder},function(err,str) {
            if(err) {
                console.log("error while reading the template ",err);
                reject(err);
            }
            else{
                resolve(str);
            }
        });
    });
    return pr;
}
module.exports=userTemplate;  