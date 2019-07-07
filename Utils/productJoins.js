

const joins={

    joinExcelData(categories,subcategory){
        var finalJson=[];
        for(let category of categories){
            for(let subcatid of category.childIds){
                for(let subcat of subcategory){
                    if(subcatid==subcat.subcategoryId){
                       // console.log('here in cat');
                        category.subcategory.push(subcat);
                    }
    
                }
            }
            finalJson.push(category);
        }
        return finalJson;
    },
    joinSubproducts(subProducts,priceAndAmount){
        for(subproduct of subProducts){
            for(pna of priceAndAmount){
                if(pna.subproductid==subproduct.subproductId){
                    subproduct.info.priceAndAmount.push(pna);
                }
            }
        }
        return subProducts;
    },
    joinProducts(products,subProducts){
       // console.log('trying to generate')
        for(let product of products){
            for(let subproductId of product.childIds){
                for(let subProduct of subProducts){
                    if(subproductId==subProduct.subproductId){
                        product.subProducts.push(subProduct);
                    }
                }
            }
        }
    //    console.log(products);
        return products;
    },
    joinSubcategory(subcategory,products){
        for(let subcat of subcategory){
            for(let productId of subcat.childIds){
                for(let product of products){
                    if(productId==product.productId){
                        subcat.products.push(product);
                    }
                }
            }
        }
    
        return subcategory;
    },
    
    createFieldsInSubProduct(categories,subcategories,products,subProducts){
        
        for(let category of categories){
for(let catchildId of category.childIds){
        for(let subcategory of subcategories){ 
                  if(catchildId==subcategory.subcategoryId){                                //pushing subcat & prod Ids in subproducts
            for(let childId of subcategory.childIds){
                for(let product of products){
                    if(childId==product.productId){
                        for(let childId1 of product.childIds){
                            for(let subProduct of subProducts){
                                if(childId1==subProduct.subproductId){
                                    subProduct.productId=childId1;
                                    subProduct.subcategoryId=childId; 
                                    subProduct.categoryId=catchildId;
                                    subProduct.categoryName=category.categoryName;
                                    subProduct.subcategoryName=subcategory.subcategoryName;
                                    subProduct.productName=product.productName;

                                }
                            }
                        }
                    }
                    }
                    }
                    
                }
            }
            
        }
    }
    
        return subProducts;
    }
}


module.exports=joins;