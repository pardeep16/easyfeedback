var getConnection=require('./db');
var mysql=require('mysql');

var register=function(data,callback) {
    
    // body...
    
    var emp_id=data.emp_id.trim();
    var name=data.name.trim();
    var password=data.password.trim();
    var email=data.email.trim();
    var location=data.location.trim();
    var category=data.category.trim();

    
    var searchQuery='Select * from employee_register where emp_id='+mysql.escape(emp_id);


   // console.log(searchQuery);
    getConnection(function(err,conn){
        if(err){
            conn.destroy();
            callback({"status":false,"msg":"Database Error1!",err:err},null);
        }
        else{
            conn.query(searchQuery,function(err,rows){
               if(err){
                   conn.destroy();
                   callback({"status":false,"msg":"Database Error2!",err:err},null);
               } 
               else{
                   if(rows.length>0){
                       conn.destroy();
                       callback(null,{status:false,"msg":"User Already exist!"});
                   }
                   else{
                       var registerQuery='Insert into employee_register(emp_id,name,email,location) values('+mysql.escape(emp_id)+","+mysql.escape(name)+","+mysql.escape(email)+","+mysql.escape(location)+")";
                       console.log(registerQuery);
                       conn.query(registerQuery,function(err,rows){
                          if(err){
                               conn.destroy();
                               callback({"status":false,"msg":"Database Error1!",err:err},null);
                          } 
                          else{
                              var insert_id=rows.insertId;
                              var loginInsertQuery='Insert into employee_login(empid,reg_id,password) values('+mysql.escape(emp_id)+","+insert_id+","+mysql.escape(password)+")";
                          //    console.log(loginInsertQuery);

                              conn.query(loginInsertQuery,function(err,rowss){
                                if(err){
                                  conn.destroy();
                                   callback({"status":false,"msg":"Database Error!",err:err},null);
                                }
                                else{
                                    //conn.release();
                                     // conn.destroy();
                                      // callback(null,{"status":true,"msg":"Registered Successfully","emp_id":emp_id,"name":name});
                                 var insertRegisterCategory="Insert into employee_feedback_role(emp_id,name,role) values("+mysql.escape(emp_id)+","+mysql.escape(name)+","+mysql.escape(category)+")";
                                 console.log(insertRegisterCategory);
                                 conn.query(insertRegisterCategory,function(err,rows1){
                                    if(err){
                                        conn.destroy();
                                        console.log(err);
                                         callback({"status":false,"msg":"Unable to proceed your Request!Contact to support team.",err:err},null);
                                  
                                    }
                                    else{
                                      conn.destroy();
                                      callback(null,{"status":true,"msg":"Your team will be map soon!","emp_id":emp_id,"name":name,"category":category});
                                 
                                    }
                                 });

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
    var emp_id=data.emp_id;
    var password=data.password;

    var searchForLogin='Select e.empid,r.name,c.role from employee_login e JOIN employee_register r join employee_feedback_role c ON e.empid=r.emp_id where e.empid='+mysql.escape(emp_id)+" and e.password="+mysql.escape(password) +"and e.empid=c.emp_id";

   // console.log(searchForLogin);
    getConnection(function(err,conn){
        if(err){
            conn.destroy();
            callback({"status":false,"msg":"Database Error!",err:err},null);
        }
        else{
            conn.query(searchForLogin,function(err,rows){
                if(err){
                    conn.destroy();
                    callback({"status":false,"msg":"Database Error!",err:err},null);
                }
                else{
                    if(rows.length>0){
                      conn.destroy();
                      callback(null,{"status":true,"msg":"Welcome "+rows[0].name,"emp_id":rows[0].empid,"name":rows[0].name,"category":rows[0].role});
                    }
                    else{
                      conn.destroy();
                      callback(null,{"status":false,"msg":"Invalid details!Please Try Again"});
                    }
                }
            });
        }
    });

}


var checkusername=function(name,callback){
  var emp_username=name;

  var searchUser='Select * from employee_register where emp_id='+mysql.escape(emp_username);

  console.log(searchUser);

  getConnection(function(err,conn){
      if(err){
        conn.destroy();
            callback({"status":false,"msg":"Something Wrong!Try Again",err:err},null);
      }
      else{
        conn.query(searchUser,function(err,rows){
          if(err){
             conn.destroy();
             callback({"status":false,"msg":"Something Wrong!Try Again",err:err},null);
          }
          else{
            if(rows.length>0){
              conn.destroy();
              callback(null,{"status":false,"msg":"Username Already exist!"});
            }
            else{
              conn.destroy();
              callback(null,{"status":true,"msg":"Username Available"});
            }
          }
        });
      }
  });
}


var getMentees=function(mentorid,callback){
  var mentor=mentorid.toString().trim();

  var selectQry='Select * from employee_feedback_role where role_pm='+mysql.escape(mentor);

  console.log(selectQry);

  getConnection(function(err,conn){
    if(err){
      conn.destroy();
      callback({"status":false,"msg":"Something Wrong!Try Again",err:err},null);
    }
    else{
      conn.query(selectQry,function(err,rowss){
        if(err){
              conn.destroy();
              callback(null,{"status":false,"msg":"Something Wrong!Try Again"});
        }
        else{
          if(rowss.length>0){
              var data=new Array();
               for(var i=0;i<rowss.length;i++){
                data.push({
                  "name":rowss[i].name,
                  "emp_id":rowss[i].emp_id
                });
               } 
               conn.destroy();
               callback(null,{"status":true,"msg":"Data Found","data":data});
          }
          else{
              conn.destroy();
              callback(null,{"status":false,"msg":"No record found!"});
          }
        }
      });
    }
  });


}




module.exports={
  register:register,
  requestLogin:requestLogin,
  checkusername:checkusername,
  getMentees:getMentees
}
