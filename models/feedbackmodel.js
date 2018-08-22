var getConnection=require('./db');
var async=require('async');
var mysql=require('mysql');
var groupArray = require('group-array');

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
									//callback(null,{"sprint_cyc":sprint_data_arr,"feedbackform":feedback_form_data});
									var fd_detail_query="SELECT fd.form_id,fd.emp_id as mentee_id,fd.name as mentee_name,fd.ques_id,fd.answer,fd.phase_id,ques.question from feedbackdetail fd,questions ques where (fd.form_id IN "+getFormIds+" AND fd.ques_id=ques.ques_id AND fd.phase_id=ques.quiz_id) ORDER BY fd.form_id;"
									//console.log(fd_detail_query);

									conn.query(fd_detail_query,function(err,fd_rows){
										if(err){
											conn.destroy();
											callback({"status":false,"msg":"Unable to fetch data.Socket Timeout","error":err},null);
							
										}
										else{
											var fb_detail_data=null;
											if(fd_rows.length>0){
												// code to fetch data from feedbackdetail table
												fb_detail_data=new Array();

												for(var j=0;j<fd_rows.length;j++){
													fb_detail_data.push({
														"form_id":fd_rows[j].form_id,
														"mentee_id":fd_rows[j].mentee_id,
														"mentee_name":fd_rows[j].mentee_name,
														"ques_id":fd_rows[j].ques_id,
														"answer":fd_rows[j].answer,
														"phase_id":fd_rows[j].phase_id,
														"question":fd_rows[j].question
													});
												}

												var fb_detail_data_group=groupArray(fb_detail_data,"form_id");
												var fb_detail_data_group_mentee=groupArray(fb_detail_data,"form_id","ques_id");
												//console.log(fb_detail_data_group);
												//callback(null,{"sprint_cyc":sprint_data_arr,"feedbackform":feedback_form_data,"fb_detail_data_group_formid":fb_detail_data_group,"fb_detail_data_group_menteeid":fb_detail_data_group_mentee});
												
												//Query for fetching the mentor pre feedback with date question
												var getPrgIds=convertPrgIdString(sprint_data_arr);
												//console.log(getPrgIds);
												var fb_share_date_query="select mt.prg_id as prg_id,mt.question as pre_question,mt.id as q_id,fd.feed_share_id,fd.emp_id as mentor_id,fd.planned_date,fd.actual_date,fd.form_id from mentor_feedback_question mt,feedback_sharing_date fd where (mt.prg_id IN "+getPrgIds+" AND fd.form_id IN "+getFormIds+" ) AND mt.prg_id=fd.prg_id AND mt.id=fd.ques_id AND fd.emp_id="+mysql.escape(emp_id)+";";
												//console.log(fb_share_date_query);
												var fd_prg_name_query="Select distinct * from employee_feedback_prg where prg_id IN "+getPrgIds+";";

												var fb_share_date_data=null;
												var prg_names=null;
												conn.query(fb_share_date_query,function(err,fb_drows){
													if(err){
														conn.destroy();
														callback({"status":false,"msg":"Unable to fetch data.Need to contact to Support team","error":err},null);
													}
													else{
														if(fb_drows.length>0){
															fb_share_date_data=new Array();
															for(var i=0;i<fb_drows.length;i++){
																fb_share_date_data.push({
																	"prg_id":fb_drows[i].prg_id,
																	"form_id":fb_drows[i].form_id,
																	"pre_question":fb_drows[i].pre_question,
																	"pre_qid":fb_drows[i].q_id,
																	"share_id":fb_drows[i].feed_share_id,
																	"mentor_id":fb_drows[i].mentor_id,
																	"planned_date":fb_drows[i].planned_date,
																	"actual_date":fb_drows[i].actual_date
																});
															}
															var feedback_sharing_data_group=groupArray(fb_share_date_data,"form_id");
															
															conn.query(fd_prg_name_query,function(err,prg_rows){
																if(err){
																	conn.destroy();
																	callback({"status":false,"msg":"Unable to read data.Need to contact to Support team","error":err},null);
																}
																else{
																	
																	if(prg_rows.length>0){
																		prg_names=new Array();
																		for(var i=0;i<prg_rows.length;i++){
																			prg_names.push({
																				"prg_id":prg_rows[i].prg_id,
																				"prg_name":prg_rows[i].prg_name,
																				"status":prg_rows[i].prg_status
																			});
																		}

																		var prg_data_group=groupArray(prg_names,"prg_id");
																		conn.destroy();
																		callback(null,{"status":true,"mentor":emp_id,"sprint_no":sprint,"sprint_cyc":sprint_data_arr,"feedbackform":feedback_form_data,"fb_detail_data_group_formid":fb_detail_data_group,"fb_detail_data_group_qid":fb_detail_data_group_mentee,"feedback_share_date_data":feedback_sharing_data_group,"prg_data":prg_data_group});

																	}
																	else{
																		conn.destroy();
																		callback({"status":false,"msg":"Unable to read data.Need to contact to Support team","error":err},null);
																
																	}

																}
															});
														}
														else{
															//conn.destroy();
															//callback({"status":false,"msg":"Feedback Detail contains no data.Please contact to support team."},null);				
															
															conn.query(fd_prg_name_query,function(err,prg_rows){
																if(err){
																	conn.destroy();
																	callback({"status":false,"msg":"Unable to read data.Need to contact to Support team","error":err},null);
																}
																else{
																	
																	if(prg_rows.length>0){
																		prg_names=new Array();
																		for(var i=0;i<prg_rows.length;i++){
																			prg_names.push({
																				"prg_id":prg_rows[i].prg_id,
																				"prg_name":prg_rows[i].prg_name,
																				"status":prg_rows[i].prg_status
																			});
																		}

																		var prg_data_group=groupArray(prg_names,"prg_id");
																		conn.destroy();
																		callback(null,{"status":true,"mentor":emp_id,"sprint_no":sprint,"sprint_cyc":sprint_data_arr,"feedbackform":feedback_form_data,"fb_detail_data_group_formid":fb_detail_data_group,"fb_detail_data_group_qid":fb_detail_data_group_mentee,"feedback_share_date_data":null,"prg_data":prg_data_group});

																	}
																	else{
																		conn.destroy();
																		callback({"status":false,"msg":"Unable to read data.Need to contact to Support team","error":err},null);
																
																	}

																}
															});


															
														}
													}
												});
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

function convertPrgIdString(sprint_arr){
	var returnStr="(";
	var end=sprint_arr.length;
	var start=0;

	for(var i=0;i<sprint_arr.length;i++){
		returnStr+=sprint_arr[i].prg_id;
		start++;
		if(start<end){
			returnStr+=",";
		}
	}
	returnStr+=")";
	console.log("return "+returnStr);
	return returnStr;
}

var checkFeedBackServiceStatus=function(datareq,callback){
	var mentor_id=datareq.mentor_id;
	var sprint=datareq.sprint;
	var prg_id=datareq.prg_id;

	var searchReqQuery="Select * from sprint_cyc where emp_id="+mysql.escape(mentor_id)+" and sprint_no="+mysql.escape(sprint)+" and prg_id="+mysql.escape(prg_id)+";";
	//console.log(searchReqQuery);
	getConnection(function(err,conn){
		if(err){
			try{
				conn.destroy();
				callback({"status":false,"msg":"Server Timeout"+err},null);
			}
			catch(exception){
				console.log(exception);
			}
			
		}
		else{
			conn.query(searchReqQuery,function(err,rowss){
				if(err){
					conn.destroy();
					callback({"status":false,"msg":"Server Timeout"},null);
				}
				else{
					if(rowss.length>0){
						callback({"status":false,"msg":"Feedback already submitted for sprint"},null);
					}
					else{
						callback(null,{"status":true,"msg":"No record found"});
					}
				}
			});
		}
	});
}


module.exports={
	fetchDbData:fetchDbData,
	checkFeedBackServiceStatus:checkFeedBackServiceStatus
}