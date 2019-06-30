const GoogleStrategy=require('passport-google-oauth2');
const passport=require('passport');
passport.serializeUser((user,done)=> {
    var error=null;
    done(error,user);
}); 
passport.deserializeUser((userid,done)=> {
    console.log('User Session cookie ',userid);
    done(null,userid);
});
passport.use(new GoogleStrategy({
    callbackURL:"/dashboard",
    clientID:"", // put the company ClientID here 
    clientSecret:'' // put the client secret Here 
},(accessToken,refreshToken,profile,done)=>{
    console.log("Callback Google...",profile," Token is ",accessToken);
    var userObject={
        email:profile._json.emails[0].value,
        name:profile.displayName,
        image:profile._json.image.url
    }
    done(null,userObject);
}));
