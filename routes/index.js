var express = require('express');
var router = express.Router();

var courses=require('.././controllers/courses');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

route.get('/courselist',courses.)

module.exports = router;
