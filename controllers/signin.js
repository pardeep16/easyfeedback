
var reg=require('.././models/signin');

var newRegister=function(req,res,next){
    var emp_id=req.body.emp_id;
    var name=req.body.name;
    var password=req.body.password;
    
    var data={
      emp_id:emp_id,
      name:name,
      password:password
    };
    
    reg.register(data,function(err,result){
        if(err){
            res.send(err);
        }
        else{
            res.send(result);
        }
    });
    
    
}


var onLogin=function(req,res,next){
    var emp_id=req.body.emp_id;
    var password=req.body.password;

    var data={
        emp_id:emp_id,
        password:password
    }
    signin.requestLogin(data,function(err,result){
        if(err){
            res.send(err);
        }
        else{
            res.send(result);
        }
    });


}






module.exports={
    newRegister:newRegister,
    onLogin:onLogin
}