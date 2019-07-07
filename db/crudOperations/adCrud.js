//milan
const productCrud = require('../crudOperations/Product')
const adschema = require('../schemas/adSchema');
const getproducts= require('../../Utils/getProducts')
const productSchema = require('../schemas/ProductSchema');
const s3=require('../../Utils/multer/getImageFiles')
const async = require('async');
const joins = require('../../Utils/productJoins')
const adcrud={
    
  removeidvandreturnnew(obj){
      let subadarray=[];
      for(let subad of obj.subAds){
          let paramarray=[];
            for(let param of subad.params){
               
                let newparam={
                    keyword:param.keyword,
                    value:param.value,
                    category:param.category
                }
                paramarray.push(newparam);
                
            }
        
            let newsubad={
                label:subad.label,
                imageobj:subad.imageobj,
                link:subad.link,
                status:subad.status,
                priority:subad.priority,
                params:paramarray
            }

            subadarray.push(newsubad);
      }
let newad={
    typeOfAd:obj.typeOfAd,
    category:obj.category,
    layout:obj.layout,
    noOfAds:obj.noOfAds,
    priority:obj.priority,
    subAds:subadarray

}
return newad;
  },
 
getads(res){
adschema.ads.find({},(err,ads)=>{
    if(err){
    res.status(403).json('Data Base Error');
    }
    else if(ads!=null){
try{
        let adarray=[];
        
    ads.forEach(ad => {
   adarray.push(this.removeidvandreturnnew(ad)); 
    });
  res.status(200).json(adarray);}
  catch(e){
      res.status(403).json('Logical Error')

  }
  
}
else {
    res.status(403).json('No data Found');
}
})
}
 
 ,

 imageCrud(obj,res){
   let ifFound=false;
   
     if(obj.crud=='add'){
       adschema.ads.findOne({'category':obj.category},(err,ad)=>{
           if(err){
               res.status(403).json('DataBase Error');
               console.log(obj,'yes error');

           }else if(ad!=null && obj.oldlabel!='null'){
               try{
               ad.subAds.forEach(subad=>{
                   if(subad.label==obj.oldlabel){
                       ifFound=true;
                       if(subad.imageobj.url!=null){
                         
                        s3.headObject({
                            Bucket:"big-basket-state-store",
                            Key:subad.imageobj.key
                          },(err,data)=>{
                             
                              
                            if(data==null){
                              res.status(200).json(obj);
                         }
                        
                         else if(data!=null){
                            s3.deleteObject({
                                Bucket:"big-basket-state-store",
                                Key:subad.imageobj.key
                              },(err,data)=>{
                                  
                               if(err){
                                res.status(403).json('Multer Error')
                               }
                               else if(data.DeleteMarker==true){
                                 console.log('yes')
                                res.status(200).json(obj);
                               }
                              })}
                          })
                        

                        }else{
                    res.status(200).json(obj);
                   }}
               })
               if(ifFound==false){
                res.status(409).json('No Label Found');
            }
            }catch(e){
                res.status(403).json('Logical Backend Error');
            }
           }
           else {
               console.log('i was here')
               res.status(200).json(obj);
           }
       })
     }
 }
,
deleteAd(obj,res){
if(obj.crud=='delete'){
adschema.ads.findOne({category:obj.data},(err,doc)=>{ //delete old image files of removed
    if(doc!=null){
doc.subAds.forEach(subad=>{
    
    s3.headObject({
        Bucket:"big-basket-state-store",
        Key:subad.imageobj.key
      },(err,data)=>{
         
         if(data!=null){
        s3.deleteObject({
            Bucket:"big-basket-state-store",
            Key:subad.imageobj.key
          },(err,data)=>{
              
           if(err){
            res.status(403).json('Multer Error')
           }
           else if(data.DeleteMarker==true){
             console.log('yes')
          
           }
          })}
      })
    
})
    }

    adschema.ads.findOneAndDelete({category:obj.data},(err,doc)=>{
        if(err){
            res.status(403).json('DataBase Error');
        }
         else if(doc!=null){
             res.status(200).json({'isDeleted':true});
 
         }else {
             res.status(403).json('No Such Entry Found');
         }
     })
})

 
}
}
,

pushAd(obj,res){
  console.log(obj);
    if(obj.crud=='edit'){
       
        
 adschema.ads.findOneAndUpdate({'category':obj.oldref},obj.data,{new:true},(error,ad)=>{
     if(error){
       res.status(403).json('Data Base Error');
     }else if(ad!=null){
     
          res.status(200).json({'isAdded':true})
      }     else{
         res.status(403).json('No Such Entry Found');
     }
 })
}else if(obj.crud=='new'){
    //console.log(obj.crud)
    let subaddarray=[];
    for(let childobj of (obj.data).subAds){
        
        let paramarray=[];
        for(let param of childobj.params){
          //  console.log(param)
           let newparam= new adschema.params({
                keyword:param.keyword,
                value:param.value,
                category:param.category


            })
            paramarray.push(newparam);
        }
        let sub=new adschema.subads({
            label:childobj.label,
            link:childobj.link,
            imageobj:childobj.imageobj,
            priority:childobj.priority,
            status:childobj.status,
            params:paramarray

        })
subaddarray.push(sub);
    }
   let adobj = new adschema.ads({category:obj.data.category,
    typeOfAd:obj.data.typeOfAd,
    layout:obj.data.layout,
    noOfAds:obj.data.noOfAds,
    priority:obj.data.priority,
    subAds:subaddarray
   
   })

   adobj.save(err=>{
       if(err){
           res.status(403).json('DataBase Error');
       }
       else {
         //  console.log('yo')
           res.status(200).json({'isAdded':true});
       }
   })

}
else{
    res.status(403).json('Incorrect Crud Selected');
}
}
,
getAllAds(res){
    let arrayofAdCrud=[];
    let adarray=[];
    async.parallel([
        //Load Ad
        function(cb) {
            adschema.ads.find({},(err,ads)=>{
                    if(err) return cb(err);
                    ads.forEach(ad => {
                          adarray.push(adcrud.removeidvandreturnnew(ad)); 
                            });
                        arrayofAdCrud.push({'adalready':adarray});

                cb(null,adarray);
            });
        },
        productCrud.getCategoriesArray(),
        productCrud.getSubcategoriesArray(),
        productCrud.getProductsArray(),
        productCrud.getSubProductsArray()

    ], function(err,results) { //This function gets called after the two tasks have called their "task callbacks"
        if (err) {
            res.status(500).json('Some Error Occurred')
        }else{
            console.log(results[0]);
            let categories=[];
            let  products=joins.joinProducts(results[3],results[4]);
              //console.log(products);
          
             let subcategory=joins.joinSubcategory(results[2],products);
             // console.log(subcategory);
  
            categories=joins.joinExcelData(results[1],subcategory);  //final data after nesting
              //console.log(categories);
              arrayofAdCrud.push({productAd:categories})
  
        
        if(arrayofAdCrud.length!=0){
            res.status(200).json(arrayofAdCrud);
           // console.log(arrayofAdCrud)
        }
    }
    });
  
}



}



module.exports=adcrud;