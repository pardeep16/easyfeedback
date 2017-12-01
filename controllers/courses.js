var coursemod=require('.././models/courses');


var getCourses=function (req,res) {
	// body...
	coursemod.getCourseList(function(err,result){
		if(err){
			res.send(err);
		}
		else{
			res.send(result);
		}
	});
}

module.exports={
	getCourses:getCourses
}