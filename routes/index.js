var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/login',function(req,res,next){
  var username = req.getParameter("username");
  var password = req.getParameter("password");
  if(username == "test" && password == "test"){
    res.json("success");
    res.close();
  }else{
    res.json("fail");
    res.close();
  }

});

module.exports = router;
