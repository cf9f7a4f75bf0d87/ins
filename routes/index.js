var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/login',function(req,res,next){
  var username = req.body["username"];
  var password = req.body["password"];
  res.json({success:false});
});

router.get('/login',function(req,res,next){
  res.render('login',{});
});

module.exports = router;
