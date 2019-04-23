
const getProductArray={
    getProducts(products){
        var subcatIndex=0;
        var productIndex=0;
        var modProducts=[];
        for(let obj of products){
            var halfobj={categoryId:obj.categoryId,
                    categoryName:obj.categoryName,
                    childIds:obj.childIds,
                    subcategory:[]
                };
                console.log(obj,halfobj);
            subcatIndex=0;
            for(let obj1 of obj.subcategory){
                var halfobj1={
                                subcategoryId:obj1.subcategoryId,
                                  subcategoryName:obj1.subcategoryName,
                                  childIds:obj1.childIds,
                                  products:[]};
                halfobj.subcategory.push(halfobj1);
                productIndex=0;
                for(let obj2 of obj1.products){
                    var halfobj2={
                                    productId:obj2.productId,
                                    productName:obj2.productName,
                                    childIds:obj2.childIds,
                                    subProducts:[]};
                                    //console.log(subcatIndex);
                    halfobj.subcategory[subcatIndex].products.push(halfobj2);
                    for(let obj3 of obj2.subProducts){
                        var priceArray=[];
                        if(obj3.info.priceAndAmount){
                            for(let obj4 of obj3.info.priceAndAmount){
                                 priceArray.push(obj4);
                        }}
                        var imageArray=[];
                        if(obj3.imageUrls){
                        for(let obj5 of obj3.imageUrls){
                            let obj6={
                                uri: obj5.uri
                            }
                            imageArray.push(obj6);
                        }}
                        var halfobj3={
                            subproductId:obj3.subproductId,
                            subproductName:obj3.subproductName,
                            info:{
                                description:obj3.info.description,
                                benefitsAndUses:obj3.info.benefitsAndUses,
                                priceAndAmount:priceArray,
                            },
                            imageUrls:imageArray
                        };
                        halfobj.subcategory[subcatIndex].products[productIndex].subProducts.push(halfobj3);
                                            
                                        }

                                productIndex++;                                
                        }
                subcatIndex++;
            }
                  modProducts.push(halfobj);
                }
                return modProducts;
    }
}

module.exports=getProductArray;