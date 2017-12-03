var getConnection=require('./db');
var mysql=require('mysql');

var register=function(data,callback) {
    
    // body...
    
    var emp_id=data.emp_id;
    var name=data.name;
    var password=data.password;
    
    var searchQuery='Select * from employee_register where emp_id='+mysql.escape(emp_id);
    console.log(searchQuery);
    getConnection(function(err,conn){
        if(err){
            conn.release();
            callback({"status":false,"msg":"Database Error1!",err:err},null);
        }
        else{
            conn.query(searchQuery,function(err,rows){
               if(err){
                   conn.release();
                   callback({"status":false,"msg":"Database Error2!",err:err},null);
               } 
               else{
                   if(rows.length>0){
                       conn.release();
                       callback(null,{status:false,"msg":"User Already exist!"});
                   }
                   else{
                       var registerQuery='Insert into employee_register(emp_id,name) values('+mysql.escape(emp_id)+","+mysql.escape(name)+")";
                       console.log(registerQuery);
                       conn.query(registerQuery,function(err,rows){
                          if(err){
                               conn.release();
                               callback({"status":false,"msg":"Database Error1!",err:err},null);
                          } 
                          else{
                              var insert_id=rows.insertId;
                              var loginInsertQuery='Insert into employee_login(empid,reg_id,password) values('+mysql.escape(emp_id)+","+insert_id+","+mysql.escape(password)+")";
                              console.log(loginInsertQuery);

                              conn.query(loginInsertQuery,function(err,rowss){
                                if(err){
                                  conn.release();
                                   callback({"status":false,"msg":"Database Error!",err:err},null);
                                }
                                else{
                                    conn.release();

                                    callback(null,{"status":true,"msg":"Registered Successfully","emp_id":emp_id,"name":name});
                                }
                              });

                          }
                       });
                   }
               }
            });
        }
    });
    
}


var requestLogin=function(data,callback){
    var emp_id=parseInt(data.emp_id);
    var password=data.password;

    var searchForLogin='Select e.emp_id,r.name from employee_login e JOIN employee_register r ON e.empid=r.emp_id where emp_id='+mysql.escape(emp_id)+" and password="+mysql.escape(password);

    getConnection(function(err,conn){
        if(err){
            conn.release();
            callback({"status":false,"msg":"Database Error!",err:err},null);
        }
        else{
            conn.query(searchForLogin,function(err,rows){
                if(err){
                    conn.release();
                    callback({"status":false,"msg":"Database Error!",err:err},null);
                }
                else{
                    if(rows.length>0){
                      conn.release();
                      callback(null,{"status":true,"msg":"Welcome "+rows[0].name,"emp_id":rows[0].emp_id,"name":rows[0].name});
                    }
                    else{
                      conn.release();
                      callback(null,{"status":false,"msg":"Invalid details!Please Try Again"});
                    }
                }
            });
        }
    });

}


module.exports={
  register:register,
  requestLogin:requestLogin
}
