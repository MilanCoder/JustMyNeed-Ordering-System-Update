const multer=require('multer');
const path=require('path');



function checkFileType(file,cb){
    console.log(file);
    if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
        return cb(new Error('Wrong extension type'));
    }
   
    cb(null, true);
    }

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'excel/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname)
    }
  })

 const upload = multer({ 
     storage: storage,
     limits:{fileSize:1000000000},
     fileFilter:function(res,file,cb){
       checkFileType(file,cb)
     }
    
});




module.exports=upload;