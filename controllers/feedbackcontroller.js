var feedbackm=require('.././models/feedbackmodel');

var getfeedbackData=function (req,res,next) {
	// body...
	var category=req.body.category;
	var mentor=req.body.mentor;
	var sprint=req.body.sprint_cyc;

	var data={
		"category":category,
		"mentor":mentor,
		"sprint":sprint

	}

	if(mentor && sprint>0){
		feedbackm.fetchDbData(data,function(err,result){
			if(err){
				res.send(err);
			}
			else{
				res.send(result);
			}
		});
	}
	else{
		res.send({
			"status":false,
			"msg":"Unable to fetch data.Invalid request"
		});
	}
}

var checkStatusFeedback=function(req,res,next){
	var data={
		"mentor_id":req.body.mentor_id,
        "sprint":req.body.sprint,
        "prg_id":req.body.prg_id
	}

	if(data.mentor_id && data.sprint && data.prg_id){
		feedbackm.checkFeedBackServiceStatus(data,function(err,result){
			if(err){
				res.send(err);
			}
			else{
				res.send(result);
			}
		});
	}
	else{
		res.send({
			"status":false,
			"msg":"Unable to fetch data.Invalid request"
		});
	}
}

module.exports={
	getfeedbackData:getfeedbackData,
	checkStatusFeedback:checkStatusFeedback
}
