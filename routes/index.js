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

  //handler.addOrder(res,"1","1","1");
  //handler.modifyOrder(res,"2","1","1");
  //handler.removeOrder(res,"1","2");

    //handler.getOrderList(res,"1");

  //handler.getCommentList(res,'1',0);
  //   handler.addComment(res,"1","1","ssss");
  //handler.modifyComment(res,"1","1","1","test");
  //handler.removeComment(res,"2","1");
});

module.exports = router;
