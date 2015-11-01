/**
 * Created by i on 8/14/15.
 */
var express = require('express');
var router = express.Router();
var handler = require('../method/usersHandler.js');
var tool = require('../method/tool-response.js');

router.get("/",function(req,res,next){

    res.render("Mindex",{title:"花旗保险盒子"});
});

router.get("/test", function (req, res) {

    res.render("Mtest", {
        "people":[
            {first_name:"Alan",last_name:"Johnson",phone:"123456789", email: "alan@test.com", member_since: "Mar 25, 2011"},
            {first_name:"Allision",last_name:"House",phone:"098", email: "alan@test.com", member_since: "Mar 25, 2011"},
            {first_name:"Nick",last_name:"Pettit",phone:"11111", email: "alan@test.com", member_since: "Mar 25, 2011"},
            {first_name:"Jim",last_name:"Hostkins",phone:"222222", email: "alan@test.com", member_since: "Mar 25, 2011"},
            {first_name:"Ryan",last_name:"Carson",phone:"8823", email: "alan@test.com", member_since: "Mar 25, 2011"}
        ]
    });
});


//////////////////user management/////////////

router.get("/userlist",function(req,res){
    handler.getUserList(res,req.query.index||0,function(data){
        res.render("MuserList",{title:"用户列表",data:data,index:req.query.index||0});
    })

});

router.get("/modifyuser",function(req,res){
   handler.getUserInfo(req.query.account,function(data){
       res.render("MmodifyUser",{title:"修改用户信息",data:data});
   })
});
router.post("/modifyuser",function(req,res){
    handler.modifyUser(req.body.account,req.body.username,req.body.password,req.body.tel,req.body.sex,req.body.idnumber,req.body.birthday,req.body.headpicture,function(result){
        tool.validMessage(res,result,"Mresult")
    });
});

router.get("/adduser",function(req,res){
    res.render("MaddUser",{title:"添加用户"});
});

router.post("/adduser",function(req,res){
    handler.addUser(req.body.account,req.body.username,req.body.password,req.body.tel,req.body.sex,req.body.idnumber,req.body.birthday,req.body.headpicture,function(result){
        tool.validMessage(res, result, "Mresult");
    });
});

router.post("/removeuser",function(req,res){
    handler.removeUser(res,req.body.account);
});



//////////////////user management/////////////

router.get("/productlist",function(req,res){
    handler.getProductList(req.query.index||0,function(data){
        res.render("MproductList",{title:"产品列表",data:data,index:req.query.index||0});
    })

});

router.get("/modifyproduct",function(req,res){
    handler.getProductInfo(req.query.productname,function(data){
        res.render("MmodifyProduct",{title:"修改产品信息",data:data});
    })
});
router.post("/modifyproduct",function(req,res){
    handler.modifyProduct(req.body.productname,req.body.productprice,req.body.salesvolume,req.body.income,req.body.money,req.body.producturl,req.body.productexplain,req.body.shortexplain,req.body.incomerule,req.body.deadline,function(result){
        tool.validMessage(res,result,"Mresult")
    });
});

router.get("/addproduct",function(req,res){
    res.render("MaddProduct",{title:"添加产品"});
});

router.post("/addproduct",function(req,res){
    handler.addProduct(req.body.productid,req.body.productname,req.body.productprice,req.body.salesvolume,req.body.income,req.body.money,req.body.producturl,req.body.productexplain,req.body.shortexplain,req.body.incomerule,req.body.deadline,function(result){
        tool.validMessage(res, result, "Mresult");
    });
});

router.post("/removeproduct",function(req,res){
    handler.removeProduct(res,req.body.productname);
});
//////////////////////订单管理函数//////////////////////

router.get("/orderlist",function(req,res){
    handler.getOrdersList(req.query.index||0,function(err,data){
        if(err){data=[];}
        console.log(data);
        res.render("MorderList",{title:"订单列表",data:data,index:req.query.index||0});
    })
});

router.get("/modifyorder",function(req,res){
    handler.getOrderInfo(req.query.orderid,function(err,data){
        if(err){data=[];}
        console.log(data);
        res.render("MmodifyOrder",{title:"修改订单信息",data:data});
    })
});
router.post("/modifyorder",function(req,res){
    handler.modifyOrder(req.body.orderid,req.body.buyuseraccount,req.body.nowincome,function(result){
        tool.validMessage(res,result,"Mresult")
    });
});

router.get("/addorder",function(req,res){
    res.render("MaddOrder",{title:"添加订单"});
});

router.post("/addorder",function(req,res){
    handler.addOrderEx(req.body.buyuseraccount,req.body.insuredpeoplename,req.body.productname,req.body.buytime,function(result){
        tool.validMessage(res, result, "Mresult");
    });
});

router.post("/removeorder",function(req,res){
    handler.removeOrder(req.body.account,req.body.orderid,function(result){
        res.send(result);
    });
});



module.exports = router;