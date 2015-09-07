var express = require('express');
var router = express.Router();
var handler = require('../method/usersHandler.js');
var config  = require("../method/config.js");
var tool = require("../method/tool.js");
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

router.post('/myProducts',function(req,res){
    handler.getMyProducts(res,req.body.username,req.body.index);
});

router.get('/myProfit',function(req,res){
    handler.getMyProfit(res,req.query.username||"",req.query.productId||"");
});



//我的联系人部分
router.post('/getInsuredPeopleList', function (req, res) {
    handler.getInsuredPeopleList(res, req.body.username || "",req.body.index||0);
});

router.post('/addInsuredPeople',function(req,res){
    handler.addInsuredPeople(res,req.body.insuredPeopleName||"unknown",req.body.insuredIdNumber,req.body.username||"",req.body.sex,req.body.tel,req.body.birthday);
});

router.post('/modifyInsuredPeople',function(req,res){
    handler.modifyInsuredPeople(res,req.body.insuredPeopleName||"unknown",req.body.insuredIdNumber,req.body.username||"",req.body.sex,req.body.tel,req.body.birthday,req.body.insuredId||"");
});

router.post('/removeInsuredPeople',function(req,res){
    handler.removeInsuredPeople(res,req.body.username||"",req.body.insuredId||"");
});

////////////////////订单部分////////////////////
router.post('/getOrderList',function(req,res){
    handler.getOrderList(req.body.username||"",function(err,rows){
        tool.jsonDataOnce(res,err,tool.null2arr(rows));
    });
});


router.post('/addOrder',function(req,res){
    handler.addOrder(req.body.username||"",req.body.insuredId||"",req.body.productId||"",function(result){
        res.send(result);
    });
});

router.post('/modifyOrder',function(req,res){
    handler.modifyOrder(req.body.orderId||"",req.body.username||"",req.body.nowIncome,function(result){res.send(result);});
});

router.post('/removeOrder', function (req, res) {
    handler.removeOrder( req.body.username || "", req.body.orderId || "",function(result){
        res.send(result);
    });
});

//////////////评论////////////////////////
router.post('/getCommentList',function(req,res){
    handler.getCommentList(res,req.body.productId||"",req.body.index||0);
});


router.post('/addComment', function (req, res) {
    handler.addComment(res, req.body.username || "", req.body.productId || "", req.body.content || "unknown");
});

router.post('/modifyComment', function (req, res) {
    handler.modifyComment(res, req.body.commentId || "", req.body.username || "", req.body.productId, req.body.content);
});

router.post('/removeComment', function (req, res) {
    handler.removeComment(res, req.body.commentId, req.body.username);
});




////////////算法//////////
router.post('/getPersonalData', function (req, res) {
    handler.getPersonalHobby(res, req.body.data);
});


module.exports = router;
