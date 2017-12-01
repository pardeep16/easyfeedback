var getConnection=require('./db');
var mysql=require('mysql');


var getCourseList=function(callback){
    
    var querySelect='Select DISTINCT * from course GROUP BY c_name';
    
    
    getConnection(function(err,conn){
        
        if(err){
            conn.release();
            callback({"status":false,"msg":"database error"},null);
        }
        else{
            conn.query(querySelect,function(err,rows){
               if(err){
                   conn.release();
                   callback({"status":false,"msg":"database error"},null);
               } 
               else{
                   if(rows.length>0){
                       var dataArray=new Array();
                       
                       for(var i=0;i<rows.length;i++){
                           dataArray.push({
                              "course_id":rows[i].c_id,
                              "course_name":rows[i].c_name
                           });
                       }
                       conn.release();
                       callback(null,{"status":true,"count":rows.length,"msg":"Successfully Found","data":dataArray});
                   }
                   else{
                       conn.release();
                       callback(null,{"status":false,"msg":"No record found"})
                   }
               }
            });
        }
        
    });
    

}


var getQuizesList=function(id,callback){
    var course_id=id;
    
    var searchQuiz='Select * from quiz where courseid='+courseid+" ORDER BY RAND() LIMIT 1";
    
    getConnection(function(err,conn){
        if(err){
            conn.release();
            callback({"status":false,"msg":"database error"},null);
        }
        else{
            conn.query(searchQuiz,function(err,rows){
                  if(err){
                   conn.release();
                   callback({"status":false,"msg":"database error"},null);
               } 
               else{
                   if(rows.length>0){
                       var questionArray=new Array();
                       
                       var quiz_id=rows[0].q_id;
                       var totalQuestions=rows[0].totalQuestions;
                       console.log(quiz_id);
                       console.log(totalQuestions);
                       
                       var searchQuestions='Select * from questions where quiz_id='+quiz_id;
                       
                       conn.query(searchQuestions,function(err,rows){
                           if(err){
                               
                           }
                       });
                       
                   }
                   else{
                       conn.release();
                       callback(null,{"status":false,"msg":"No record found"})
                   }
               }
            });
        }
    });
}


module.exports={
	getCourseList:getCourseList
}