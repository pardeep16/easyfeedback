var getConnection=require('./db');
var mysql=require('mysql');

var register=function(data,callback) {
    
    // body...
    
    var emp_id=data.emp_id;
    var name=data.name;
    var password=data.password;
    
    var searchQuery='Select * from employee_register where emp_id='+mysql.escape(emp_id);
    
    getConnection(function(err,conn){
        if(err){
            conn.release();
            callback({"status":false,"msg":"Database Error!",err:err},null);
        }
        else{
            conn.query(searchQuery,function(err,rows){
               if(err){
                   conn.release();
                   callback({"status":false,"msg":"Database Error!",err:err},null);
               } 
               else{
                   if(rows.length>0){
                       conn.release();
                       callback(null,{status:false,"msg":"User Already exist!"});
                   }
                   else{
                       var registerQuery='Insert into employee_register(emp_id,name) values('+mysql.escape(emp_id)+","+"'"+mysql.escape(name)+"'"+")";
                       
                       conn.query(registerQuery,function(err,rows){
                          if(err){
                               conn.release();
                               callback({"status":false,"msg":"Database Error!",err:err},null);
                          } 
                          else{
                              
                          }
                       });
                   }
               }
            });
        }
    });
    
}
