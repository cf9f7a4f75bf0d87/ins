var tool        = require('./tool.js');
var sqlHelper   = require('./tool-query.js');
var fs          = require('fs');

function list(index,res){
    if(index<0){console.log("get InsuranceList Error-> index is lt 0");return;}
    var sql = "select ProductId, ProductName, ShortExplain, ProductUrl from producttable limit " + index*3 + ",3";
    tool.queryOnce(sql,function(err,rows){
        tool.jsonDataOnce(res,err,rows);
    })
}

function userLogin(account,password,res){
    var sql = 'select PassWord from usertable where Account = "' + account + '"';

    tool.queryOnce(sql,function(err,rows,fields){
        var invalid = true;
        console.log(rows);
        if(rows&&rows[0]){
            invalid = (rows[0].PassWord != password);
        }
        //tool.renderValid(res,function(){},err,invalid,"success","error");
        if(invalid||err){res.json(false);}
        else{res.json(true);}

    });
}

function register(res,account,username,password,tel,sex,idNumber,headPicture,birthday){
    tool.isAccountExist(account,function(err,rows){
        console.log(err + "  " + rows);
        if(err||rows){
            //res.render('error',{message:"account exist"});return;
            res.send("用户名存在");return;
        }
        var sql = "insert into usertable (Account,UserName,PassWord,Tel,Sex,IdNumber,HeaderPicture,Birthday) values('"+account+'","'+username+'","'+password+'","'+tel+'","'+sex+'","'+idNumber+'","'+headPicture+'","'+birthday+'")';
        tool.queryOnce(sql,function(err,rows){
            var invalid = (rows.affectedRows != 1);
            tool.renderValid(res,function(){},err,invalid,"successPath","errorPath");
        });
    });
}


function forgetPassWord01(res,account){
    var sql = 'select Tel from usertable where Account = "'+account+'"';
    tool.queryOnce(sql,function(err,rows){
        if(err||rows||rows[0]){res.json({success:false});return;}
        // send a code to account 's tel
        var code = (Math.random() * 10000 + 1000) % 10000;
        req.session.code = code;
        console.log(req.session.code);
        res.json({success:true});
    })
}


function forgetPassWord02(res,account,userCode){
    console.log(req.session.code);
    tool.renderValid(res,function(){},null,userCode==req.session.code||null,"success","error");
}


function modifyPassWord(res,account,newPassWord){
    var sql = 'update usertable set PassWord = "' + newPassWord + '" where Account = "' + account +'"';
    tool.queryOnce(sql,function(err,rows){
        var invalid = !(rows && rows.affectedRows == 1);
        tool.renderValid(res,function(){},res,invalid,"success","error");
    });
}


function introduce(res,productId){
    var sql = 'select ProductName, ProductExplain from producttable where ProductId = "' +productId +'"';
    tool.queryOnce(sql,function(err,rows){
        var data = rows[0];
        tool.jsonDataOnce(res,err,data);
    })
}


function buy(res,account,productId,insuredPeopleId){
    var sql = 'insert into ordertable BuyUserAccount,ProductId,InsuredId,BuyTime,NowIncome values("'+account +'","'+ productId  +'","'+ insuredPeopleId  +'","'+ new Date().toLocaleDateString() +'", 0"';
    tool.queryOnce(sql,function(err,rows){
        var valid = (rows&&rows.rowsAffected == 1);
        tool.jsonValidOnce(res,err,!valid,valid);
    });
}


function boughtProduct(res,account){
    var sql = 'select ProductId from ordertable where BuyUserAccount="'+account+'"';
    tool.queryOnce(sql,function(err,rows){
        if(err||rows==null||(rows&&rows.length==0)){res.json({data:null});return;}
        var data = [], idArray = rows;
        sql = 'select * from producttable where ';
        for(var i = 0; i<rows.length;i++){
            if(i == rows.length-1){
                sql += 'ProductId = "'+ rows[i] +'"';
                tool.queryOnce(sql,function(err,rows){
                    tool.jsonValidOnce(res,err,rows==null,rows);
                });
            }else{
                sql += 'ProductId = "'+ rows[i] +'" or ';
}}});}

function getCurrentProfit(res,account,productId){
    sqlHelper.selectTemplate("ordertable",["Profit"],["BuyUserAccount","ProductId"],[account,productId],"and", function(rows){
       tool.jsonDataOnce(res,null,rows);
    });
}

function modifyInformation(res,account,userName,tel,sex,idNumber,headPicture){
    sqlHelper.updateTemplate("usertable",["UserName","Tel","Sex","IdNumber","HeadPicture"],[userName,tel,sex,idNumber,headPicture],["Account"],[account],"and",function(err,rows){
       tool.jsonDataOnce(res,err,rows);
    });
}

function getInsuredPeople(res,account){
    sqlHelper.selectTemplate("insurepeopletable",["InsuredName","InsuredNumber"],["BuyUserAccount"],[account],"and",function(err,rows){
        tool.jsonDataOnce(res,err,rows);
    })
}

function getHPicByUsername(res,username){
    //...
    console.log(username);
    var sql = 'select HeadPicture from usertable where Account = "' + username + '"';
    tool.queryOnce(sql,function(err,rows){
        console.log(err +"  " + rows);
        var data= rows?rows[0]:null;
        tool.jsonDataOnce(res,err,data);
    });
}

function readHPicByUsername(res,username){
    res.json({data:ok});
    //fs.readFile("../public/images/index.png","binary",function(err,file){
    //    if(err){
    //        response.writeHead(500, {'Content-Type': 'text/plain'});
    //        response.end(err);
    //    }else {
    //        var contentType = "image/jpeg";
    //        response.writeHead(200, {'Content-Type': contentType});
    //        response.write(file, "binary");
    //        response.end();
    //    }
    //})
}

function getProductExplain(res,productId){
    var sql = 'select ProductExplain from producttable where ProductId = "' + productId +'"';
    tool.queryOnce(sql,function(err,rows){
       tool.jsonDataOnce(res,err,rows?rows[0]:null);
    });

}


function getAllProfits(res,account,index){
    var sql = 'select NowIncome from ordertable where BuyUserAccount = "'+account +'" limit ' + index*3 +','+ index*3+2;
    tool.queryOnce(sql,function(err,rows){
        tool.jsonDataOnce(res,err,tool.null2arr(rows));
    });
}


function getAllFriends(res,account,index){
    //var sql = 'select InsuredName'
}

// get insurance list
exports.list                    = list;
// login
exports.userLogin               = userLogin;
// register
exports.register                = register;
// send check code
exports.forgetPassWord01        = forgetPassWord01;
// verify check code
exports.forgetPassWord02        = forgetPassWord02;
// modify password
exports.modifyPassWord          = modifyPassWord;
// show details of a product
exports.introduce               = introduce;
// make an order
exports.buy                     = buy;
// give a list of product [History Order] that you bought;
exports.boughtProduct           = boughtProduct;
// get current profit of an order
exports.getCurrentProfit        = getCurrentProfit;
// modify user's information
exports.modifyInformation       = modifyInformation;
// get InsuredPeople associated with current user
exports.getInsuredPeople        = getInsuredPeople;
// get Head Picture by username
exports.getHPicByUsername       = getHPicByUsername;
// send Head Picture by username
exports.readHPicByUsername      = readHPicByUsername;

exports.getProductExplain       = getProductExplain;
///////////////// not 实现
function sendVerifyCode(res,account){

}