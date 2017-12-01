var getConnection=require('./db');


var getCourseList=function(callback){
    
    var querySelect='Select DISTINCT * from course GROUP BY c_name';
    
    
    getConnection(function(err,conn){
        
        if(err){
            conn.release();
            callback({"msg":"database error"},null);
        }
        else{
            conn.query(querySelect,function(err,rows){
               if(err){
                   callback({"msg":"database error"},null);
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
                       
                       callback(null,{"status":true,"count":rows.length,"msg":"Successfully Found","data":dataArray});
                   }
                   else{
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