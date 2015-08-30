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
        if(err||rows[0]){
            //res.render('error',{message:"account exist"});return;
            res.send("用户名存在");return;
        }
        var sql = 'insert into usertable (Account,UserName,PassWord,Tel,Sex,IdNumber,HeadPicture,Birthday) values("'+account+'","'+username+'","'+password+'","'+tel+'","'+sex+'","'+idNumber+'","'+headPicture+'","'+birthday+'")';
        tool.queryOnce(sql,function(err,rows){
            var invalid = (rows.affectedRows != 1);
            //tool.renderValid(res,function(){},err,invalid,"successPath","errorPath");
            res.send(err?err:(!invalid));
        });
    });
}


function getCode(req,res,account){
    var sql = 'select Tel from usertable where Account = "'+account+'"';
    tool.queryOnce(sql,function(err,rows){
        if(err||(rows&&rows[0])){res.send(false);return;}
        // send a code to account 's tel
        var code = (Math.random() * 10000 + 1000) % 10000;
        req.session.code = code;
        console.log(code+"##########3");
        res.json(true);
    })
}

function getCodeEx(req,res,account){
    var sql = 'select Tel from usertable where Account = "'+account+'"';
    tool.queryOnce(sql,function(err,rows){
        if(err||!(rows&&rows[0])){res.send("error");return;}
        // send a code to account 's tel
        var code = Math.round((Math.random() * 10000 + 1000) % 10000);
        console.log(code+"##########");
        sql = 'insert into codetable(Account, Code) values ("'+account+'","'+code+'")';
        tool.queryOnce(sql,function(err,rows){
            if(err||(rows&&rows.affectedRows!=1)){
                res.send("网络故障,请重按");return;
            }
            res.send(true);
        })
    })
}

function forgetPassWordEx(req,res,account,password,code){
    var sql = 'select Code from codetable where Account = "' + account +'" and Code = "' + code + '"';
    tool.queryOnce(sql,function(err,rows){
        if(!err&&(rows&&rows.affectedRows==1)){
            sql = 'update usertable set PassWord = "' + password +'" where Account = "' + account +'"';
            tool.queryOnce(sql,function(err,rows){
                if(!err&&(rows&&rows.affectedRows==1)){
                    sql = 'delete from codetable where Account = "' + account +'"';
                    tool.query(sql,function(err,rows){
                       res.send(true);
                    });
                }else{
                res.send("更新失败..");}
            });
        }else{
            res.send("未找到您的验证码..");}
    })
}

function forgetPassWord(req,res,account,password,code){
    console.log(req.session.code + "*************");
    if(code != req.session.code){
        res.send("验证码不对...");return ;
    }
    var sql = 'update usertable set PassWord = "' + password +'" where Account = "' + account +'"';
    tool.queryOnce(sql,function(err,rows){
        if(err||(rows&&rows.affectedRows!=1)){
            res.send("更新失败..");return;
        }
        res.send(true);
    });
    //tool.renderValid(res,function(){},null,Code==req.session.code||null,"success","error");
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

function modifyInformation(res,account,username,tel,opassword,npassword,code){
    var sql = 'select Account from usertable where account = "'+ account +'" and PassWord = "'+opassword +'"';
    tool.queryOnce(sql,function(err,rows){
       if(!err&&rows&&rows[0]){
            sql = 'select Account from codetable where Account="' + account +'" and Code = "' + code + '"';
           tool.queryOnce(sql,function(err,rows){
               if(!err&&rows&&rows[0]){
                   sqlHelper.updateTemplate("usertable",["UserName","Tel","PassWord"],[username,tel,npassword],["Account"],[account],"and",function(err,rows,fileds){
                       //tool.jsonDataOnce(res,err,rows);
                       console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
                       if(!err&&rows&&rows.affectedRows==1){
                            sql = 'delete from codetable where Account= "'+account + '"';
                           tool.queryOnce(sql,function(err,rows){
                               if(!err&&rows){
                                   res.send(true);
                               }else{
                                   console.log("ordertable 后台更新出错啦.....");
                                   res.send(true);
                               }
                           })
                       }else{
                           res.send("更新失败");
                       }
                   });
               }
               else{
                   res.send("验证码不对..")
               }
           })
       }else{
           res.send("密码不对..")
       }

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
    var sql = 'select InsuredName,InsuredIdNumber from insuredpeopletable where BuyUserAccount ="'+ account +'" limit ' + index * 3+','+ index*3+2;
    tool.queryOnce(sql,function(err,rows){
        tool.jsonDataOnce(res,err,tool.null2arr(rows));
    });
}

//function getMyOrders(res,account){
//    var sql = 'select OrderId,BuyTime,ProductId from ordertable where BuyUserAccount ="' + account + '"';
//    console.log(sql);
//    tool.queryOnce(sql,function(err,rows){
//        if(!err&&rows&&rows[0]){
//
//            res.end();
//        }else{
//            res.json([]);}
//    })
//}


function getMyProducts(res,username,index){
    if(index<0){console.log("get InsuranceList Error-> index is lt 0");res.send("错误请求");return;}
    var sql = 'select ProductId, ProductName, ShortExplain, ProductUrl from producttable where ProductId in ( select ProductId from ordertable where BuyUserAccount = "'+username+'"  ) limit ' + index*3 + ",3";
    tool.queryOnce(sql,function(err,rows){
        tool.jsonDataOnce(res,err,tool.null2arr(rows));
    });
}


function getMyProfit(res,username,productId){
    var sql = 'select BuyTime, NowIncome from ordertable where (ProductId,BuyUserAccount) = ("' + productId + '","'+username+'")';
    tool.queryOnce(sql,function(err,rows){
        tool.jsonDataOnce(res,err,rows?rows[0]:{});
    });
}


///////////////////////////关于用户的函数///////////////////////
function getUserInfo(account,callback){
    sqlHelper.selectTemplate("usertable", ["Account", "UserName", "PassWord", "Tel", "Sex", "IdNumber", "Birthday", "HeadPicture"], ["Account"], [account], "and", function(err,rows){
        if(err){callback([])}
        else{
            callback(tool.null2arr(rows));}
    });
}

function getUserList(res,index,callback){
    var option = "limit " + index * 10 +", 10 ";
    console.log(option);
    sqlHelper.selectTemplateOp("usertable",["Account","UserName","PassWord","Tel","Sex","IdNumber","Birthday","HeadPicture"],[],[],"and",option,function(err,rows){
        if(err){rows=[];}
        callback(tool.null2arr(rows));
    })
}

function addUser(account,username,password,tel,sex,idnumber,birthday,headPicture,callback){
    sqlHelper.insertTemplate("usertable", ["Account", "UserName", "PassWord", "Tel", "Sex", "IdNumber", "Birthday", "HeadPicture"], [account, username, password, tel, sex, idnumber, birthday, headPicture], callback);
}

function modifyUser(account,username,password,tel,sex,idnumber,birthday,headPicture,callback){
    sqlHelper.updateTemplate("usertable",["UserName","PassWord","Tel","Sex","IdNumber","Birthday","HeadPicture"],[username,password,tel,sex,idnumber,birthday,headPicture],["Account"],[account],"and",callback)
}

function removeUser(res,account){
    sqlHelper.deleteTemplate("usertable",["Account"],[account],"and",function(result){
        res.send(result);
    })
}

//////////////////////////关于产品的函数////////////////////
function getProductInfo(productname,callback){
    sqlHelper.selectTemplate("producttable", ["ProductName", "ProductPrice", "SalesVolume", "Income", "Money", "ProductUrl", "ProductExplain", "ShortExplain", "IncomeRule", "Deadline"], ["ProductName"], [productname], "", function(err,rows){
        if(err){rows=[];}
        callback(tool.null2arr(rows));
    });
}

function getProductList(index,callback){
    var option = "limit " + index * 10 +", 10 ";
    sqlHelper.selectTemplateOp("producttable",["ProductName","ProductPrice","SalesVolume","Income","Money","ProductUrl"],[],[],"and",option,function(err,rows){
        if(err){rows=[];}
        callback(tool.null2arr(rows));
    })
}

function addProduct(productname,productprice,salesvolume,income,money,producturl,productexplain,shortexplain,incomerule,deadline,callback){
    sqlHelper.insertTemplate("producttable",["ProductName","ProductPrice","SalesVolume","Income","Money","ProductUrl","ProductExplain","ShortExplain","IncomeRule","Deadline"], [productname,productprice,salesvolume,income,money,producturl,productexplain,shortexplain,incomerule,deadline], callback);
}

function modifyProduct(productname,productprice,salesvolume,income,money,producturl,productexplain,shortexplain,incomerule,deadline,callback){
    sqlHelper.updateTemplate("producttable", ["ProductPrice", "SalesVolume", "Income", "Money", "ProductUrl", "ProductExplain", "ShortExplain", "IncomeRule", "Deadline"], [productprice, salesvolume, income, money, producturl, productexplain, shortexplain, incomerule, deadline], ["ProductName"], [productname], "and", callback);
}

function removeProduct(res,productname){
    sqlHelper.deleteTemplate("producttable",["ProductName"],[productname],"and",function(result){
        res.send(result);
    })
}

///////////////////////////关于联系人的函数///////////////////
function getInsuredPeopleList(res,username,index){
    sqlHelper.selectTemplate("insuredpeopletable",["InsuredId","InsuredName","InsuredIdNumber","Sex","Tel","Birthday"],["BuyUserAccount"],[username],"and",function(err,rows){
        tool.jsonDataOnce(res,err,tool.null2arr(rows));
    })
}


function addInsuredPeople(res,insuredName,insuredIdNumber,account,sex,tel,birthday){
    var sql = 'insert into insuredpeopletable(InsuredName,InsuredIdNumber,BuyUserAccount,Sex,Tel,Birthday) values( "'+ insuredName +  '","' +
        insuredIdNumber + '","' + account + '","' + sex  + '","' + tel  + '","' + birthday +'")';
    console.log(sql);
    tool.queryOnce(sql,function(err,rows){
        console.log(err + "   " + rows);
        tool.isUpdate(err,rows,function(result){
            res.send(result);
        });
    })
}

function modifyInsuredPeople(res,insuredName,insuredIdNumber,account,sex,tel,birthday,insuredId){
    sqlHelper.updateTemplate('insuredpeopletable',["InsuredName","InsuredIdNumber","Sex","Tel","Birthday"],[insuredName,insuredIdNumber,sex,tel,birthday],["BuyUserAccount","InsuredId"],[account,insuredId],"and",function(result){
        //tool.isUpdate(err,rows,function(result){
            res.send(result);
        //});
    });
}

function removeInsuredPeople(res,account,insuredId){
    sqlHelper.deleteTemplate("insuredpeopletable",["BuyUserAccount","InsuredId"],[account,insuredId],"and",function(result){
        res.send(result);
    })
}


////////////////订单部分/////////////////
function getOrderList(res,account){
    var sql = 'select OrderId,BuyUserAccount,ProductName,InsuredPeopleName,BuyTime,NowIncome from ordertable o,usertable u, producttable p where o.BuyUserAccount="'+account+'" and o.BuyUserAccount = u.Account and o.ProductId = p.ProductId';
    console.log(sql);
    tool.queryOnce(sql,function(err,rows){
        tool.jsonDataOnce(res,err,rows);
    });
}


function addOrder(res,account,insuredId,productId){
    sqlHelper.insertTemplate("ordertable",["BuyUserAccount","ProductId","insuredPeopleId","BuyTime","NowIncome"],[account,productId,insuredId,Date.now(),"0"],function(result){
        res.send(result);
    });
}
function modifyOrder(res,orderId,account,nowIncome){
    sqlHelper.updateTemplate("ordertable",["nowIncome"],[nowIncome],["OrderId","BuyUserAccount"],[orderId,account],"and",function(result){
        res.send(result);
    })
}

function modifyOrderTime(res,account,insuredId,productId,buyTime,nowIncome){
    sqlHelper.updateTemplate("ordertable",["BuyTime","nowIncome"],[buyTime,nowIncome],["BuyUserAccount","ProductId","insuredPeopleId"],[account,productId,insuredId],"and",function(result){
        res.send(result);
    })
}

function removeOrder(res,account,orderId){
    sqlHelper.deleteTemplate("ordertable",["OrderId","BuyUserAccount"],[orderId,account],"and",function(result){
        res.send(result);
    });
}
//////////////////评论部分//////////////////////
function getCommentList(res,productId,index){
    sqlHelper.selectTemplateOp('evaluatetable e, usertable u',["UserName","EContent","EvaluateTime"],['e.EUserAccount= u.Account and e.EProductId'],[productId],'and','limit '+index * 3 +', 3',function(err,rows){
        tool.jsonDataOnce(res,err,rows);
    })
}


function addComment(res,account,productId,content){
    sqlHelper.insertTemplate('evaluatetable', ["EUserAccount", "EProductId", "Econtent"], [account, productId, content], function (result) {
        res.send(result);
    });
}

function modifyComment(res,commentId,account,productId,content){
    sqlHelper.updateTemplate('evaluatetable',['EUserAccount',"EProductId","EContent"],[account,productId,content],["EvaluateId"],[commentId],"and",function(result){
        res.send(result);
    })
}

function removeComment(res,commentId,account){
    sqlHelper.deleteTemplate('evaluatetable',["EUserAccount","EvaluateId"],[account,commentId],"and",function(result){
        res.send(result);
    })
}


///////////////个人的喜好////////////////
function getPersonalHobby(res,data){
    var data = data;
    console.log(data);
    if(data){
        res.send(true);
    }else{
        res.send(false);
    }
}



// get insurance list
exports.list                    = list;
// login
exports.userLogin               = userLogin;
// register
exports.register                = register;
// send check code
exports.getCode                 = getCode;
// verify check code
exports.forgetPassWord          = forgetPassWord;
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

exports.getCodeEx               = getCodeEx;

exports.forgetPassWordEx        = forgetPassWordEx;

//exports.getMyOrders              = getMyOrders;

exports.getMyProducts           = getMyProducts;

exports.getMyProfit             = getMyProfit;

////////////////关于用户的函数///////////////////
exports.getUserInfo             = getUserInfo;
exports.getUserList             = getUserList;

exports.addUser                 = addUser;
exports.modifyUser              = modifyUser;
exports.removeUser              = removeUser;

///////////////////关于产品的函数///////////////////
exports.getProductInfo             = getProductInfo;
exports.getProductList             = getProductList;

exports.addProduct                 = addProduct;
exports.modifyProduct              = modifyProduct;
exports.removeProduct              = removeProduct;


////////////////关于联系人的函数////////////////
exports.getInsuredPeopleList    = getInsuredPeopleList;

exports.addInsuredPeople        = addInsuredPeople;
exports.modifyInsuredPeople     = modifyInsuredPeople;
exports.removeInsuredPeople     = removeInsuredPeople;

//////////////////关于订单的函数////////////////
exports.getOrderList            = getOrderList;

exports.addOrder                = addOrder;
exports.modifyOrder             = modifyOrder;
exports.modifyOrderTime         = modifyOrderTime;

exports.removeOrder             = removeOrder;

//////////////////评论部分//////////////////////
exports.getCommentList          = getCommentList;
exports.addComment              = addComment;
exports.modifyComment          = modifyComment;
exports.removeComment           = removeComment;

//////////////////////算法部分/////////////////
exports.getPersonalHobby        = getPersonalHobby;

///////////////// not 实现
function sendVerifyCode(res,account){

}