var getConnection=require('./db');
var mysql=require('mysql');
var async=require('async');

var getCourseList=function(category,callback){

  var categorySearch=category.toLowerCase().trim().toString();
    
    var querySelect='Select DISTINCT * from employee_feedback_prg where LOWER(category)='+mysql.escape(categorySearch)+" GROUP BY prg_name order by prg_id asc";
    
    
    getConnection(function(err,conn){
        
        if(err){
            conn.destroy();
            callback({"status":false,"msg":"database error"},null);
        }
        else{
            conn.query(querySelect,function(err,rows){
               if(err){
                   conn.destroy();
                   console.log(err);
                   callback({"status":false,"msg":"database error"},null);
               } 
               else{
                   if(rows.length>0){
                       var dataArray=new Array();
                       
                       for(var i=0;i<rows.length;i++){

                          if(rows[i].prg_status=="0"){
                            rows[i].prg_status="false";
                          }
                           dataArray.push({
                              "course_id":rows[i].prg_id,
                              "course_name":rows[i].prg_name,
                              "status":rows[i].prg_status,
                              "category":rows[i].category
                           });
                       }
                       conn.destroy();
                       callback(null,{"status":true,"count":rows.length,"msg":"Successfully Found","data":dataArray});
                   }
                   else{
                       conn.destroy();
                       callback(null,{"status":false,"msg":"No record found"});
                   }
               }
            });
        }
        
    });
    

}


var getQuizesList=function(id,callback){
    var course_id=id;

    
    
    var searchQuiz='Select * from quiz where courseid='+course_id;
    //" ORDER BY RAND() LIMIT 1";
   // console.log(searchQuiz);
    getConnection(function(err,conn){
        if(err){
            conn.destroy();
            callback({"status":false,"msg":"database error"},null);
        }
        else{
            conn.query(searchQuiz,function(err,rows){
                  if(err){
                   conn.destroy();
                   callback({"status":false,"msg":"database error"},null);
               } 
               else{
                   if(rows.length>0){
                       var questionArray=new Array();
                       
                       var quiz_id=rows[0].q_id;
                       var totalQuestions=rows[0].totalQuestions;
                   //    console.log(quiz_id);
                     //  console.log(totalQuestions);
                       
                       //var searchQuestions='SELECT  DISTINCT q.ques_id,q.question,q.total_options,o.* from questions q JOIN options o ON q.ques_id=o.question_id where quiz_id='+mysql.escape(quiz_id)+" GROUP BY q.ques_id,o.option_id";
                       
                      var searchQuestions='Select DISTINCT ques_id,question,total_options from questions where quiz_id='+mysql.escape(quiz_id);
                     //  console.log("search questions :"+searchQuestions);
                       conn.query(searchQuestions,function(err,rows){
                           if(err){
                                conn.release();
                                callback({"status":false,"msg":"database error1","err":err},null);
                           }
                           else{
                               var options=new Array();
                               var questionIds=new Array();
                               if(rows.length>0){
                                   /*for(var j=0;j<rows.length;j++){
                                       questionArray.push({
                                           "qid":rows[j].ques_id,
                                           "question_name":rows[j].question,
                                           "total_options":rows[j].total_options
                                       });
                                       
                                       questionIds.push(rows[j].ques_id);
                                       var idd=rows[j].ques_id;
                                       var optionsSearch='Select * from options where question_id='+idd+" GROUP BY question_id";
                                      console.log(optionsSearch);
                                      getConnection(function(err,conn){
                                        if(err){

                                        }
                                        else{
                                          conn.query(optionsSearch,function(err,rowss){
                                              if(err){

                                              }
                                              else{
                                                for(var xx=0;xx<rowss.length;xx++){

                                                }
                                              }
                                          });
                                        }
                                      })
                                   }*/
                                   var dataArr=new Array();
                                   var questionsArr=new Array();
                                   var options1=new Array();

                                   for(var ii=0;ii<rows.length;ii++){
                                    dataArr.push(rows[ii].ques_id);
                                    questionsArr.push({
                                      "question_id":rows[ii].ques_id,
                                      "question":rows[ii].question,
                                      "totaloptions":rows[ii].total_options,

                                    });
                                   }


                                   async.forEach(dataArr,function(id1,cb){
                                       var optionsSearch='Select * from options where question_id='+id1+" GROUP BY option_id";
                              //        console.log(optionsSearch);

                                      conn.query(optionsSearch,function(err,rows){
                                          if(err){
                                              conn.destroy();
                                              callback({"status":false,"msg":"database error"},null);
                                          }
                                          else{
                                              var optionsArr=new Array(); 
                                       //       console.log("len :"+rows.length);
                                              for(var jj=0;jj<rows.length;jj++){
                                       //         console.log(jj);
                                                optionsArr.push({
                                                  "option_id":rows[jj].option_id,
                                                  "option":rows[jj].opt
                                                });
                                              }
                                              options1.push({
                                                "question_id":id1,
                                                "options":optionsArr
                                              });
                                              cb(null);
                                          }
                                      });
                                 },function(err){
                                  if(err){
                                    conn.release();
                                     callback({"status":false,"msg":"database error2","err":err},null);

                                  }
                                  else{
                                  //  conn.destroy();
                                    //callback(null,{"status":true,"quiz_id":quiz_id,"questions":questionsArr,"options":options1});

                                    var selectPreQuestions='select * from mentor_feedback_question where prg_id='+mysql.escape(course_id);
                                    console.log(selectPreQuestions);
                                    conn.query(selectPreQuestions,function(err,rows11){
                                      if(err){
                                          conn.release();
                                          callback({"status":false,"msg":"database error2","err":err},null);
                                      }
                                      else{
                                        var totalCount=rows11.length;
                                        var preQuestions=new Array();

                                        for(var i=0;i<rows11.length;i++){
                                          preQuestions.push({
                                            "id":rows11[i].id,
                                            "question":rows11[i].question,
                                            "prg_id":rows11[i].prg_id
                                          });

                                        }
                                        conn.destroy();
                                        callback(null,{"status":true,"quiz_id":quiz_id,"questions":questionsArr,"options":options1,"prequestions":preQuestions});
                                      }
                                    });
                                  }
                                 });
                                   
                                   
                                  /*console.log("optionIds :"+questionIds);
                                   async.forEach(questionIds,function(id,cb){
                                        var searchOptions='Select * from options where question_id='+mysql.escape(id);
                                        console.log("searchOptions :"+searchOptions);
                                        conn.query(searchOptions,function(err,rowss){
                                            if(err){
                                                 conn.release();
                                                 callback({"status":false,"msg":"database error"},null);
                                            }
                                            else{
                                              console.log("found");
                                              console.log("rows :"+rowss.length);
                                              var optionsArray=new Array();
                                                for(var t=0;t<rowss.length;t++){
                                                  console.log("rows :"+t);
                                                  console.log(rowss[t].option_id);
                                                  console.log(rowss[t].opt);
                                                  console.log(rowss[t].question_id);

                                                    optionsArray.push({
                                                        "option_id":rowss[t].option_id,
                                                        "option":rowss[t].opt
                                                    });

                                                      
                                                }
                                                var ques_id=id;
                                                var questionObj={

                                                    "qid":ques_id,
                                                    "options":optionsArray
                                                };
                                                console.log(questionObj+"\n"+questionArray);
                            
                                            }
                                        });
                                    });
*/
                                    
                                   
                                   
                               }
                               else{
                                    conn.destroy();
                                     callback(null,{"status":false,"msg":"No record found"});
                               }
                           }
                       });
                       
                   }
                   else{
                       conn.destroy();
                       callback(null,{"status":false,"msg":"No record found"})
                   }
               }
            });
        }
    });
}


var submitFeedbackMentor=function(datapass,callback){
  var mentorid=datapass.mentor;
  var data=datapass.data;
  var date=new Date();
  var len=data.length;
  var phase_id=datapass.phase_id;

  var createNewForm="Insert into feedbackform(emp_id,date,totalmentee,category) values("+mysql.escape(mentorid)+","+mysql.escape(date)+","+mysql.escape(len)+","+"'"+"mentor"+"'"+")";
  console.log(createNewForm);

  getConnection(function(err,conn){
      if(err){
            conn.destroy();
            callback({"status":false,"msg":"database error"},null);
        }
        else{
          conn.query(createNewForm,function(err,rows){
            if(err){
            conn.destroy();
            callback({"status":false,"msg":err},null);
            }
            else{
              var insertid=rows.insertId;
              var insertRecord='Insert into feedbackdetail(form_id,emp_id,name,ques_id,answer,phase_id) values';

              for(var i=0;i<data.length;i++){

                var emp_id=data[i].emp_id;
                var name=data[i].name;
                var ques=data[i].questions;

                  for(var j=0;j<ques.length;j++){
                    var ques_id=ques[j].ques_id;
                    var answer=ques[j].answer.toString().trim();
                    var strr="("+mysql.escape(insertid)+","+mysql.escape(emp_id)+","+mysql.escape(name)+","+mysql.escape(ques_id)+","+mysql.escape(answer)+","+mysql.escape(phase_id)+")";
                    insertRecord+strr;
                    if(j-1==ques.length){

                    }
                    else{
                      insertRecord+",";
                    }
                  }
              }
              console.log(insertRecord);
              conn.query(insertRecord,function(err,rowss){
                if(err){
                  conn.destroy();
            callback(null,{"status":false,"msg":err});
                }
                else{
                  conn.destroy();
                   callback(null,{"status":true,"msg":"Submitted Successfully"});
                }
              });
            }
          });
        }
  });

}


module.exports={
	getCourseList:getCourseList,
	getQuizesList:getQuizesList,
  submitFeedbackMentor:submitFeedbackMentor
}