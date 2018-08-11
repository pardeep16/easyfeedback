var getConnection=require('./db');
var async=require('async');
var mysql=require('mysql');

var fetchDbData=function(data,callback) {
	// body...

	var category=data.category;
	var emp_id=data.mentor;
	var sprint=data.sprint;

	getConnection(function(err,conn){
		if(err){
			try{
				conn.destroy();
				callback({"status":false,"msg":"Server Timeout"},null);
			}
			catch(exception){
				console.log(exception);
			}
			
		}
		else{
			var search_sprint_cyc='Select distinct * from sprint_cyc where emp_id='+mysql.escape(emp_id)+" and sprint_no="+mysql.escape(sprint)+";";
			var responseData="";
			var prg_arr=null;
			var formid_arr=null;
			var sprint_data_arr=null;
			conn.query(search_sprint_cyc,function(err,rows_sprint){
				if(err){
					conn.destroy();
					callback({"status":false,"msg":"Unable to fetch data.Socket Timeout"},null);
				}
				else{

					if(rows_sprint.length>0){
						//prg_arr=new Array(rows_sprint.length);
						//formid_arr=new Array(rows_sprint.length);
						sprint_data_arr=new Array();
						for(var i=0;i<rows_sprint.length;i++){
							sprint_data_arr.push({
								"prg_id":rows_sprint[i].prg_id,
								"form_id":rows_sprint[i].form_id
							});
							//prg_arr.push(rows_sprint[i].prg_id);
							//formid_arr.push(rows_sprint[i].form_id);
						}

						//var prg_set=new Set(prg_arr);
						//var formid_set=new Set(formid_arr);
						var getFormIds=convertArrObjtoString(sprint_data_arr);
						var select_feedback_form_data='Select * from feedbackform where emp_id='+mysql.escape(emp_id)+" and form_id IN "+getFormIds+";";
						var feedback_form_data=null;
						conn.query(select_feedback_form_data,function(err,rows_form){
							if(err){
								conn.destroy();
								callback({"status":false,"msg":"Unable to fetch data.Socket Timeout","error":err},null);
							}
							else{
								if(rows_form.length>0){
									feedback_form_data=new Array();
									var data_form={};
									for(var x=0;x<rows_form.length;x++){
										
										data_form[rows_form[x].form_id]={
												"date":rows_form[x].date,
												"total_mentee":rows_form[x].totalmentee, 
												"mentor_id":rows_form[x].emp_id
											};
										// feedback_form_data.push({
										// 	[rows_form[x].form_id]:{
										// 		"date":rows_form[x].date,
										// 		"total_mentee":rows_form[x].totalmentee, 
										// 		"mentor_id":rows_form[x].emp_id
										// 	}
										// });
									}
									feedback_form_data.push(data_form);
									callback(null,{"sprint_cyc":sprint_data_arr,"feedbackform":feedback_form_data});
								}
								else{
									conn.destroy();
									callback({"status":false,"msg":"Feedback form contains no data.Please contact to support team."},null);
								}
							}
						});

					}
					else{
						conn.destroy();
						callback({"status":false,"msg":"No record found"},null);
					}

				}
			});
		}
	});
}

function convertArrObjtoString(sprint_arr){
	var returnStr="(";
	var end=sprint_arr.length;
	var start=0;

	for(var i=0;i<sprint_arr.length;i++){
		returnStr+=sprint_arr[i].form_id;
		start++;
		if(start<end){
			returnStr+=",";
		}
	}
	returnStr+=")";
	console.log("return "+returnStr);
	return returnStr;
}


module.exports={
	fetchDbData:fetchDbData
}