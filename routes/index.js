var express = require('express');
var router = express.Router();
var handler = require("../method/usersHandler.js");
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

router.get('/test',function(req,res){
  //handler.getInsuredPeoplelist(res, "1");
  //handler.modifyInsuredPeople(res,"test","test","1","男","111","unknown",4);
  //handler.removeInsuredPeople(res,"1",4);
});

module.exports = router;
