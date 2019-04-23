const nullChecker={
    check(val,res){
        if(val==null){
            res.send('Please enter all the values');
        }
    }
}


module.exports=nullChecker;