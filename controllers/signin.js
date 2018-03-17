
var reg=require('.././models/signin');

var newRegister=function(req,res,next){
    var emp_id=req.body.emp_id;
    var name=req.body.name;
    var password=req.body.password;
    var email=req.body.email;
    var location=req.body.location;
    var category=req.body.category;

    
    var data={
      emp_id:emp_id,
      name:name,
      password:password,
      email:email,
      location:location,
      category:category
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
    reg.requestLogin(data,function(err,result){
        if(err){
            res.send(err);
        }
        else{
            res.send(result);
        }
    });


}


var checkUserName=function(req,res,next){
    var username=req.body.username;

    reg.checkusername(username,function(err,result){
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
    onLogin:onLogin,
    checkUserName:checkUserName
}