
var quizmod=require('.././models/quiz');

var submitquiz=function(req,res,next){
	var quiz_id=parseInt(req.body.quiz_id);
	var emp_id=req.body.emp_id;
	var name=req.body.name;
	var date=req.body.date;
	var quizdata=req.body.data;

	var data={
		"quiz_id":quiz_id,
		"emp_id":emp_id,
		"name":name,
		"date":date,
		"quizdata":quizdata

	}

	quizmod.submitForQuiz(data,function(err,result){
		if(err){
			res.send(err);
		}
		else{
			res.send(result);
		}
	});


}

var checkstatus=function(req,res,next){
	var quiz_id=req.body.quiz_id;
	var emp_id=req.body.emp_id;

	var data={
		quiz_id:quiz_id,
		emp_id:emp_id
	};

	quizmod.checkquizstatus(data,function(err,result){
			if(err){
				res.send(err);
			}
			else{
				res.send(result);
			}
	});
}

module.exports={
	submitquiz:submitquiz,
	checkstatus:checkstatus
}