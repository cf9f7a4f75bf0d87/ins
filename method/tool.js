/**
 * Created by root on 7/24/15.
 */

var mysql = require("mysql");
var pool = mysql.createPool({
   host:'localhost',
    user:'root',
    password:'Miss',
    database:'ourproject',
    port:'3306'
});


/////////////////////My sql/////////////////////
/**
 *
 * @param query mysql string to execute
 * @param deal  callback method, parameter is close(function)`err`rows`fields
 */
var query = function(query,deal){
    pool.getConnection(function(err,conn){
        if(err){console.log(err);}
        conn.query(query,function(err,rows,fields){
            if(err){console.log(err);}
            deal(function(){conn.release();},err,rows,fields);
        });
    });
};

// auto release connection after query
// one connection one query
var queryOnce = function(query,deal){
    pool.getConnection(function(err,conn){
        if(err){console.log(err);}
        conn.query(query,function(err,rows,fields){
            conn.release();
            if(err){console.log(err);}
            deal(err,rows,fields);
        });
    });
};

// one connection more query
var queryMulti = function(callback){
    pool.getConnection(callback(err,conn));
};

var isAccountExist = function(account,callback){
    var sql = 'select account from usertable where account = "'+account+'"';
    queryOnce(sql,function(err,rows,fields){
        if(err){console.log(err);}
        callback(err,rows);
    })
};


/**
 * pass data to a view
 * @param res
 * @param close
 * @param err
 * @param data
 * @param path
 */
var renderData = function(res,close,err,data,path){
    close();
    if(err){res.render('error',{message:err});}
    res.render(path,{data:data});
    console.log(data);
};
/**
 * a condition branch to view
 * @param res
 * @param close
 * @param err
 * @param valid
 * @param successPath
 * @param errorPath
 */
var renderValid = function(res,close,err,invalid,successPath,errorPath){
    close();
    if(err||valid){
        res.render(errorPath,{message:"error"});
    }else{
        res.render(successPath,{message:"success"});
    }
};


/**
 * pass data as a json reply
 * @type {Function}
 */
var jsonData = function(res,close,err,data){
    close();
    if(err){console.log(err);data=null;}
    console.log(data);
    res.json({msg:data});
};

var jsonValid = function(res,close,err,invalid,data){
    close();
    if(err||invalid){
        console.log(err);
        data = null;
    }
    console.log(data);
    res.json({msg:data});
};

var jsonDataOnce = function(res,err,data){
    if(err){console.log(err);data=null;}
    console.log(data);
    res.json({msg:data});
};

var jsonValidOnce = function(res,err,invalid,data){
    if(err||invalid){
        console.log(err);
        data = null;
    }
    console.log(data);
    res.json({msg:data});
};







////////////////////////Test method///////////////////////////
var createRes = function(done,test){
    var res =  {};
    res.end = done;res.json = done;
    res.render = function(a,b){done();};
    test(res);
};

function test(title,subtitle,method){
describe(title,function(){
    it(subtitle,function(done){
        createRes(done,function(res){
           method(res);
        })
    })
});
}

var testAdapter =  function(method){test("Test","test",method);}


///////////////////////Other method//////////////////////////////
var str2arr = function(str){
    if(str==null){return [];}
    else if(typeof(str)==str){
        return [str];
    }
    return str;
};



////////////////Method About Render///////////////
//  render data to a view and close database link
exports.renderData          = renderData;
//  to judge if condition is valid then send result to a new view
exports.renderValid         = renderValid;



//////////////////Method About Json/////////////////////
exports.jsonData            = jsonData;
exports.jsonDataOnce        = jsonDataOnce;

exports.jsonValid           = jsonValid;
exports.jsonValidOnce       = jsonValidOnce;




//////////////////Method About Mysql/////////////////////
exports.query               = query;
exports.isAccountExist      = isAccountExist;
exports.queryOnce           = queryOnce;
exports.queryMulti          = queryMulti;


/////////////////Method About Unit Test//////////////////

exports.test                = test;
exports.testAdapter         = testAdapter;



///////////////////Method About Other///////////////////
exports.str2arr             = str2arr;