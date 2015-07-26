var tool = "./tool.js";
//sql example sql = "select userName where userId = '"
//              queryArray = [1,2,3]
var queryData = function(conn,sql,queryArray,data,callback){
    if(queryArray.length==0){callback(data);}
    var q = sql + queryArray.pop() + '"';
    conn.query(q,function(err,rows){
        if(err){rows=null;}
        data.push(rows);
        queryData(conn,sql,queryArray,data,callback);
    });
};


var selectTemplate = function(table,queryFields,conditionFields,valueFields,join,callback){
    if(conditionFields.length!=valueFields.length){var err = "queryTemplate Error: condition is not equal to value"; console.log(err);callback(err,null);return;}
    queryFields = queryFields.join(",");
    var condition = '';
    for(var i =0;i<conditionFields.length;i++){
        if(i==conditionFields.length-1){
            condition += conditionFields[i] + '= "' + valueFields[i] +'" ';
            var sql = 'select '+ queryFields + ' from ' + table + ' where ' + condition;
            tool.queryOnce(sql,callback);
            return;
        }
        condition += conditionFields[i] + '= "' + valueFields[i] +'" '+ join +' ';
    }
};


var insertTemplate = function(table,insertFields,valueFields,join,callback){
    if(insertFields.length!=valueFields.length){var err= "insertTemplate Error: length is not equal"; console.log(err);callback(err,null);return; }
    insertFields = insertFields.join(",");
    valueFields = valueFields.join('","');
    var sql = 'insert into ' + table + ' ' + insertFields + ' values ("' + valueFields + '")';
    tool.queryOnce(sql,callback);
};

var updateTemplate = function(table,updateFields,updateValueFields,conditionFields,conditionValueFields,join,callback) {
    if (updateFields.length != valueFields.length || conditionFields.length != conditionValueFields.length) {
        var err = "updateTemplate Error: length is not equal";
        console.log(err);
        callback(err, null);
        return;
    }
    var update='',condition = '';
    for(var i = 0; i< updateFields.length;i++){
        if(i==updateFields.length-1){
            update += updateFields[i] + ' = "' + updateValueFields[i] +'"';
            for(var j = 0;j<conditionFields.length;j++){
                if(i==conditionFields.length-1) {
                    condition += conditionFields[i] + ' = "' + conditionValueFields[i] + '"';
                    var sql = "update " + table + " set " + update + " where " + condition;
                    tool.query(sql,callback);return;
                }
                condition += conditionFields[i] + ' = "' + conditionValueFields[i] + '" '+ join +' ';
            }
        }
        update += updateFields[i] + ' = "' + updateValueFields[i] +'",';
    }


};

// recursive query by a queryArray
exports.queryData = queryData;
// a mysql `select` query template
exports.selectTemplate  = selectTemplate;
// a mysql `insert` query template
exports.insertTemplate  = insertTemplate;
// a mysql `update` query template
exports.updateTemplate  = updateTemplate;