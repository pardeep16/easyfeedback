
var getConnection=require('./db');
var async=require('async');
var mysql=require('mysql');


var submitForQuiz=function(data,callback){
  var emp_id=data.emp_id;
  var quiz_id=data.quiz_id;
  var name=data.name;

  var date=data.date;
  var quiz_data=data.quizdata;

  var arr=quiz_data.map(function(e1){
  		return e1.question_id;
  });

  

  var totalQuestions=quiz_data.length;
  console.log(totalQuestions);

  var correctanswers=0;
  var wronganswers=0;

  var questionids=new Array();
  var answers=new Array();

  var currentDate=new Date();
  var time=currentDate.getHours()+":"+currentDate.getMinutes()+":"+currentDate.getSeconds();

  for(var i=0;i<quiz_data.length;i++){
  	questionids.push(quiz_data[i].question_id);
  	answers.push(quiz_data[i].answer);

  }

  var counter=0;


  		getConnection(function(err,conn){
  				if(err){
  					conn.release();
  					callback({"status":false,"msg":"database error 1!","error":err},null);
  				}
  				else{
  					async.forEach(questionids,function(q_id,cb){
  					

  					var searchQuery='Select * from questions where quiz_id ='+mysql.escape(quiz_id)+" and ques_id ="+q_id;
  					console.log(searchQuery);
  					conn.query(searchQuery,function(err,rows){
  						if(err){
  							conn.release();
  							callback({"status":false,"msg":"database error 2!","error":err},null);
  						}
  						else{
  							if(rows.length>0){
  								var ans=rows[0].answer;
  								newans=ans.trim().replace(/\.$/,"").toLowerCase();

  								var sub_ans=answers[counter].trim().replace(/\.$/,"").toLowerCase();

  								console.log(newans);
  								console.log(sub_ans);
  								console.log(counter);
  								if(sub_ans==newans){
  									correctanswers++;
  									counter++;
  								}
  								else{
  									wronganswers++;
  									counter++;
  								}
  							}
  							else{

  							}
  							cb(null);
  						}
  					});
  		},function(err){
  			if(err){

  			}
  			else{
  				var marks=totalQuestions-wronganswers;

  				var insertScore='Insert into a_submitscore(emp_id,quiz_id,submit_date,submit_time,totalquestions,marks,status) values('+mysql.escape(emp_id)+","+mysql.escape(quiz_id)+","+mysql.escape(date)+","+mysql.escape(time)+","+mysql.escape(totalQuestions)+","+mysql.escape(marks)+","+mysql.escape("submitted")+")";

  				conn.query(insertScore,function(err,rows){
  					if(err){

  					}
  					else{
  						callback(null,{"status":true,"correct":correctanswers,"wrong":wronganswers,"emp_id":emp_id,"totalquestions":totalQuestions,"marks":marks});
  			
  					}
  				});
  				}
  		});
  				}
  });
}

module.exports={
	submitForQuiz:submitForQuiz
}