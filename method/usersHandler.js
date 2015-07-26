var tool        = require('./tool.js');

function list(index,res){
    if(index<0){console.log("get InsuranceList Error-> index is lt 0");return;}
    var sql = "select ProductId, ProductName, ProductExplain from producttable limit " + index*3 + ",3";
    tool.query(sql,function(close,err,rows,fields){
        tool.renderData(res,close,err,rows,"list")
    })
}

function userLogin(account,password,res){
    var sql = 'select PassWord from usertable where Account = "' + account + '"';

    tool.query(sql,function(close,err,rows,fields){
        var invalid = true;
        if(rows&&rows[0]){
            invalid = (rows[0].PassWord != password);
        }
        tool.renderValid(res,close,err,invalid,"success","error");
    });
}

function register(res,account,username,password,tel,sex,idNumber,headPicture){
    tool.isAccountExist(account,function(err,rows){
        console.log(err + "  " + rows);
        if(err||rows){
            res.render('error',{message:"account exist"});return;
        }
        var sql = "insert into usertable (Account,UserName,PassWord,Tel,Sex,IdNumber,HeaderPicture) values('"+account+'","'+username+'","'+password+'","'+tel+'","'+sex+'","'+idNumber+'","'+headPicture+'")';
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
        console.log(err);
        console.log(rows[0]);
        var data = rows[0];
        tool.jsonDataOnce(res,err,data);
    })
}


// get insurance list
exports.list                    =   list;
// login
exports.userLogin               = userLogin;
// register
exports.register                =   register;

exports.introduce               = introduce;
///////////////// not 实现
function sendVerifyCode(res,account){

}