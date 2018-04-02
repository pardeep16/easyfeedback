var coursemod=require('.././models/courses');


var getCourses=function (req,res) {
	// body...
	var category=req.query.category;

	coursemod.getCourseList(category,function(err,result){
		if(err){
			res.send(err);
		}
		else{
			res.send(result);
		}
	});
}

var getQuizes=function(req,res){
	var courseid=req.params.course_id;
	console.log(courseid);
	coursemod.getQuizesList(courseid,function(err,result){
		if(err){
			res.send(err);
		}
		else{
			res.send(result);
		}
	});
}

var submitMentorFeedback=function(req,res,next){
	var data=req.body;

	coursemod.submitFeedbackMentor(data,function(err,results){
		if(err){
			res.send(err);
		}
		else{
			res.send(results);
		}
	});

}

module.exports={
	getCourses:getCourses,
	getQuizes:getQuizes,
	submitMentorFeedback:submitMentorFeedback
}