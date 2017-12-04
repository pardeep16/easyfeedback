var express = require('express');
var router = express.Router();

var courses=require('.././controllers/courses');

var signin=require('.././controllers/signin');

var quiz=require('.././controllers/quiz');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/quizes/:course_id',courses.getQuizes);

router.get('/courselist',courses.getCourses);

router.post('/api/v1/register',signin.newRegister);
router.post('/api/v1/signin',signin.onLogin);


router.post('/api/v1/submitquiz',quiz.submitquiz);

router.get('/app/v1/android',function(req,res){
	res.redirect('https://docs.google.com/uc?export=download&id=1Mnbu-Guyf8Z40muYXNdSGXl0FATawyli');
});

module.exports = router;
