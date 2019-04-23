const mongoose=require("mongoose");
const connection=require("../connection");

var Schema=mongoose.Schema;
var empSchema=new Schema({
    id:{
        type:String
    },
    name:{
        type: String
    },
    password:{
        type:String
    },
    address:[{
        fulladdress:{
            type: String
        },
        street:{
            type: String  
          },
        city:{
            type: String  
          },
        state:{
            type: String  
          },
        pin_code:{
            type: String  
          }
        }],

    gender:{
        type: String
    },
    selfReferralCode:{
        type:String
    },
    isVerified:{
        type:Boolean
    }
    ,
    referralCode:{
        type: String
    },
    nominee:{
        type:String
    },
    nomineeRel:{
        type:String
    },   
    email:{
        type: String   
     },
    mobile_no:{
        type: String  
      },

    qualification:{
        type: String  
      },
    date_of_birth:{
        type: String  
      },
    typeEmployee:{
        type: String 
       },
    documents:[{
        GSTNumber:{
            type:String
        },
        adhno:{
            type: String,
        },
        bankacno:{
            type: String    },
        pancardno:{
            type: String  
          }
          ,
        nomineeAdhno:{
            type:String
        }
    }],
    ImageUrls:[{
        policeVerification:{
            type:String,
        },
        pancardPhoto:{
            type:String,
        },
        addressProof:{
            type:String
        },
        gST:{
            type:String
        },
        nomineePhoto:{
            type:String
        },
        cancelCheque:{
            type:String
        }
    }],
    

});

module.exports=mongoose.model("employees",empSchema);