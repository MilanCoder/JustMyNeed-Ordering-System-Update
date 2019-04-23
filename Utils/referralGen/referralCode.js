const shortid = require('shortid');

const refCodeGen={

    nosplit(no){
    let strlength= no.length;
    no = no.slice(strlength-2,strlength);
     return no;
    },

    idgenerator(no)
    {   if(no!=null&& typeof(no)==number){
        let str;
        let random=shortid.generate()

        str='JMN'+ random + this.nosplit(no);
    

    return str;
    }
    else{
        return null;
    }
    }
}


module.exports=refCodeGen;
