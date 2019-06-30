// to write the google strategy here 
const FacebookStrategy=require('passport-facebook');
//GoogleStartegy is like a class so capital
const passport=require('passport');
//this will call when u write a cookie 
passport.serializeUser((user,done)=> {
    var error=null;
    done(error,user);
});
//this will call when u read a data from cookie 
passport.deserializeUser((userid,done)=> {
    // console.log('User Session cookie ',userid);
    done(null,userid);
});
passport.use(new FacebookStrategy({
    callbackURL:"/dashboard",
    clientID:"",
    clientSecret:'',
    profileFields: ['id', 'displayName', 'photos', 'email']
    // login karne ke baad token mila karega , token milega usko hum session mei use kar sakte hai 
},(accessToken,refreshToken,profile,done)=>{
    console.log("Callback Facebook...",profile," Token is ",accessToken);
    // var userObject={
    //     email:profile._json.emails[0].value,
    //     name:profile.displayName,
    //     image:profile._json.image.url
    // }
    done(null,profile);
    //profile humein sirf profile dega jo jo humein chahiye 
}));
//module.exports islie nahi likha coz na toh yeh function hai na class h 
// toh direct require kar denge toh ho jayega read karna start kar dega file ko
