var express = require('express');
var router = express.Router();
var handler = require('../method/usersHandler.js');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/login',function(req,res,next){
    res.render('userLogin',{});
});

router.post('/login',function(req,res,next){
    handler.userLogin(req.body.username||"",req.body.password,res);
});

router.get('/register',function(req,res,next){
    handler.getImageByUsername(res,req.body.username||null);
});

router.post('/img',function(req,res){
    //handler.getImageByUsername(res,req.body.username||null);
    res.json({imageUrl: "https://test-areas.c9.io/images/index.png"});
});

router.post('/register',function(req,res,next){
    var username = req.body.UserName;
    var password = req.body.PassWord;
    var tel      = req.body.Tel;
    var sex      = req.body.Sex;
    var idNumber = req.body.IdNumber;
    var headPic  = req.body.HeadPicture;
    if(username&&password&&tel&&sex&&idNumber&&headPic){
        handler.register(res,username,password,tel,sex,idNumber,headPic);
    }else{
        res.render('error',{message:"some area is empty"});
    }

});

/**
 * get insurance list
 */
router.get('/list',function(req,res,next){
    handler.list(req.query.index||0,res);
});

router.post('/list',function(req,res,next){
    handler.list(req.body.index||0,res);
});



router.post('/introduce',function(req,res,next){
    handler.introduce(res,req.body.prodectId||0);
});

module.exports = router;
