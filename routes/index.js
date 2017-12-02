var express = require('express');
var router = express.Router();

var courses=require('.././controllers/courses');

var signin=require('.././controllers/signin');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/quizes/:course_id',courses.getQuizes);

router.get('/courselist',courses.getCourses);

router.post('/api/v1/register',signin.newRegister);
router.post('/api/v1/signin',signin.onLogin);

module.exports = router;
