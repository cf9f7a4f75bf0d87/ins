var express = require('express');
var router = express.Router();
var handler = require('../method/usersHandler.js');
var config  = require("../method/config.js");

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/login',function(req,res,next){
    res.render('userLogin',{});
});

router.post('/login',function(req,res,next){
    handler.userLogin(req.body.username||"",req.body.password||"",res);
});

router.get('/register',function(req,res,next){
    res.render("login",{});
});

router.post('/register',function(req,res){
    handler.register(res,req.body.account||"",req.body.username||"",req.body.password||"123456",req.body.tel||"",req.body.sex||"男",req.body.idNumber,config.checkHeadPicture(req.body.headPicture));
});

router.get('/img',function(req,res){
    res.json({data: "https://test-areas.c9.io/images/index.png"});
});

router.post('/img',function(req,res){
    handler.getHPicByUsername(res,req.body.username||null);
});

router.get('/headPicture',function(req,res){
    handler.getHPicByUsername(res,req.body.username||"");
});

router.post('/headPicture',function(req,res){
    handler.getHPicByUsername(res,req.body.username||"");
});

//router.post('/register',function(req,res,next){
//    var username = req.body.UserName;
//    var password = req.body.PassWord;
//    var tel      = req.body.Tel;
//    var sex      = req.body.Sex;
//    var idNumber = req.body.IdNumber;
//    var headPic  = req.body.HeadPicture;
//    if(username&&password&&tel&&sex&&idNumber&&headPic){
//        handler.register(res,username,password,tel,sex,idNumber,headPic);
//    }else{
//        res.render('error',{message:"some area is empty"});
//    }
//
//});


router.post('/forgetPassword',function(req,res){
    handler.forgetPassWordEx(req, res, req.body.username||"", req.body.password, req.body.code);
});

router.post('/getCode',function(req,res){
    handler.getCodeEx(req,res,req.body.username||"");
});

router.get('/list',function(req,res,next){
    handler.list(req.query.index||0,res);
});

router.post('/list',function(req,res,next){
    handler.list(req.body.index||0,res);
});



router.post('/introduce',function(req,res,next){
    handler.introduce(res,req.body.prodectId||0);
});

router.get('/products',function(req,res){
    handler.getProductExplain(res,req.query.productId||"");
});


router.get('/setSession',function(req,res){
    req.session.test = "aaa";
    res.send("ok");
});

router.get('/getSession',function(req,res){
    console.log(req.session.test);
    res.send(req.session.test + "##");
});


router.post('/modifyInformation',function(req,res){
    handler.modifyInformation(res,req.body.username||"",req.body.name,req.body.tel,req.body.oPassword,req.body.nPassword,req.body.code);
});

router.get('/myOrders',function(req,res){
    handler.getMyOrders(res,req.query.account||"0");
});

router.post('/myProducts',function(req,res){
    handler.getMyProducts(res,req.body.username,req.body.index);
})

module.exports = router;
