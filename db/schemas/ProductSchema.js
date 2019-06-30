
const mongoose=require("../connection");

const Schema=mongoose.Schema;

const priceAndAmountSchema=new mongoose.Schema({
    
    amount:String,
    suffix:String,
    price:String,
    discount:String,
    instock:String

})


const subProductSchema=new mongoose.Schema({
    subproductId:String,
    subproductName:String,
    info:{
        isExpress:{type:Boolean,default:false},
        brand:String,
        description:String,
        benefitsAndUses:String,
        priceAndAmount:[
            priceAndAmountSchema],
    },
    imageUrls:[{
        uri:String,
        key:String
    }]
});

const productSchema=new mongoose.Schema({
    productId:String,
    productName:String,
    childIds:[],
    subProducts:[
        subProductSchema
    ]
});


const subCatSchema=new mongoose.Schema({
    subcategoryId:String,
    subcategoryName:String,
    childIds:[],
    products:[
        productSchema
    ],
});

const ProductSchema=new mongoose.Schema({
    categoryId:String,
    categoryName:String,
    childIds:[],
    subcategory:[
        subCatSchema
    ],
})




module.exports={
    Products: mongoose.model("products",ProductSchema),
    SubCat: mongoose.model("subcat",subCatSchema),
    Product1: mongoose.model("pro",productSchema),
    SubProduct: mongoose.model("subProduct",subProductSchema),
    PriceAndAmount:mongoose.model("priceAndAmount",priceAndAmountSchema)

}