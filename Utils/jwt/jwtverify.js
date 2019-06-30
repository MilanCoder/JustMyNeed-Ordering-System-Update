const jwtVerification={
    adminSecurekey:'adminhere',
    custSecurekey:'custhere',

     verifyToken(req,res,next){               //checking for webtoken in the header of req and filling it into req.token
        let bearerHeader = req.headers['authorization'];
        
        if(typeof bearerHeader!= 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token= bearerToken;
        next();
        
        }else{
            res.status(403).json('Session TimeOut ,Please login again');
        }
    }
}

module.exports=jwtVerification;