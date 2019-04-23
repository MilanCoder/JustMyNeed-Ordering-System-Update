const bcrypt = require('bcrypt');
const passwordEncryptor = {
    generatePassHash(plainText,salt){
        
        let password=null;
        if(plainText!=null){
         password= bcrypt.hashSync(plainText, salt, function(err, hash) {
          if(err){
              return err;
          }else{
            return hash
        }});
    }
return password;
}
,
verifyPassword(plainText,hash){
    let isPresent = false;
    isPresent=bcrypt.compareSync(plainText, hash, function(err, res) {
    if(res==true){ 
      return true;
    }});
return isPresent;
}}

module.exports=passwordEncryptor;