const shortid = require('shortid');

const custIdGen={

    idgenerator(id)
    {    
        if(id!=null && typeof(id)=='string'){
        let str;
        let random=shortid.generate();

        str='JMN'+ random + id;
   

    return str;
    }
    else{
        return null;
    }
    }
}


module.exports=custIdGen;
