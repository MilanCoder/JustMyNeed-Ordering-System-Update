const express=require("express");
const path=require("path");
const cors=require("cors");
const handleError=require("./Utils/errorHandler");
const app=express();

console.log('req is here');

const port=process.env.PORT||1234;
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));


const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const empRoutes=require('./api/routes/empRoutes');   //require routes
const adminRoutes=require('./api/routes/adminRoutes');
const vendorProductRoutes=require('./api/routes/vendorProductsRoutes');
const productRoutes=require('./api/routes/productRoutes');
const adRoutes = require('./api/routes/adRoutes');

app.use('/employee',empRoutes); 
app.use('/admin',adminRoutes);  
app.use('/products',productRoutes); 
app.use('/vendorProducts',vendorProductRoutes);   
app.use('/ad',adRoutes);               //use routes
//app.use('/user');


app.use('**',express.static(path.join(__dirname, 'public/error.html')));

app.use(handleError);


app.listen(port);