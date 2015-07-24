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

/**
 *
 * @param query mysql string to execute
 * @param deal  callback method, parameter is close(function)`err`rows`fields
 */
var mysqlQuery = function(query,deal){
    pool.getConnection(function(err,conn){
        if(err){console.log(err);return;}
        conn.query(query,function(err,rows,fields){
            if(err){console.log(err);return;}
            deal(function(){conn.release();},rows,fields);
        });
    });
};



//  mysql method
exports.mysqlQuery = mysqlQuery;