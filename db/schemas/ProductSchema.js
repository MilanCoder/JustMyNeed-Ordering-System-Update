
const mongoose=require("../connection");

const Schema=mongoose.Schema;

const priceAndAmountSchema=new mongoose.Schema({
    
    amount:Number,
    suffix:String,
    price:Number,
    discount:String,
    instock:String

})


const subProductSchema=new mongoose.Schema({
    categoryId:String,
    subcategoryId:String,
    productId:String,
    categoryName:String,
    subcategoryName:String,
    productIdName:String,

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