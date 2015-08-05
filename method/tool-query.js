var tool = require("./tool.js");


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


var selectTemplateOp = function(table,queryFields,conditionFields,valueFields,join,option,callback){
    if(conditionFields.length!=valueFields.length){var err = "queryTemplate Error: condition is not equal to value"; console.log(err);callback(err,null);return;}
    queryFields = queryFields.join(",");
    var condition = '';
    for(var i =0;i<conditionFields.length;i++){
        if(i==conditionFields.length-1){
            condition += conditionFields[i] + '= "' + valueFields[i] +'" ';
            var sql = 'select '+ queryFields + ' from ' + table + ' where ' + condition + ' ' + option;
            console.log(sql);
            tool.queryOnce(sql,callback);
            return;
        }
        else{condition += conditionFields[i] + '= "' + valueFields[i] +'" '+ join +' ';}
    }
};

var selectTemplate = function(table,queryFields,conditionFields,valueFields,join,callback){
    selectTemplateOp(table,queryFields,conditionFields,valueFields,join,'',callback)
};

var insertTemplateOp = function(table,insertFields,valueFields,join,option,callback){
    if(insertFields.length!=valueFields.length){var err= "insertTemplate Error: length is not equal"; console.log(err);callback(err);return; }
    insertFields = insertFields.join(",");
    valueFields = valueFields.join('","');
    var sql = 'insert into ' + table + ' (' + insertFields + ') values ("' + valueFields + '") ' + option;
    console.log(sql);
    tool.queryOnce(sql,function(err,rows){
        tool.isUpdate(err,rows,callback);
    });
};

var insertTemplate = function(table,insertFields,valueFields,join,callback){
    insertTemplateOp(table,insertFields,valueFields,join,'',callback);
};

var updateTemplateOp = function(table,updateFields,updateValueFields,conditionFields,conditionValueFields,join,option,callback) {
    if (updateFields.length != updateValueFields.length || conditionFields.length != conditionValueFields.length) {
        var err = "updateTemplate Error: length is not equal";
        console.log(err);
        callback(err, null);
        return;
    } else {
        var update = '', condition = '';
        for (var i = 0; i < updateFields.length; i++) {
            if (i == updateFields.length - 1) {
                update += updateFields[i] + ' = "' + updateValueFields[i] + '"';
                for (var j = 0; j < conditionFields.length; j++) {
                    if (j == conditionFields.length - 1) {
                        condition += conditionFields[j] + ' = "' + conditionValueFields[j] + '"';
                        var sql = "update " + table + " set " + update + " where " + condition + " " + option;
                        console.log(sql);
                        tool.queryOnce(sql,function(err,rows){
                            tool.isUpdate(err,rows,callback);
                        });
                        return;
                    } else {
                        condition += conditionFields[j] + ' = "' + conditionValueFields[j] + '" ' + join + ' ';
                    }
                }
            }
            else{update += updateFields[i] + ' = "' + updateValueFields[i] + '",';}
        }
    }
};

var updateTemplate = function(table,updateFields,updateValueFields,conditionFields,conditionValueFields,join,callback) {
   updateTemplateOp(table,updateFields,updateValueFields,conditionFields,conditionValueFields,join,"",callback);
};

var deleteTemplateOp = function(table,conditionFields,conditionValueFields,join,option,callback){
    if(conditionFields.length!=conditionValueFields.length){
        var err = "deleteTemplate Error: length is not equal";
        console.log(err);
        callback(err);
        return;
    }else{
        var condition = '';
        for(var i = 0;i<conditionFields.length;i++){
            if(i==conditionFields.length-1){
                condition += conditionFields[i] + '="' + conditionValueFields[i]+ '"';
                var sql = 'delete from ' + table + ' where ' + condition + ' ' + option;
                console.log(sql);
                tool.queryOnce(sql,function(err,rows){
                    tool.isUpdate(err,rows,callback);
                })
            }else{
                condition += conditionFields[i] + '="' + conditionValueFields[i] + '" ' + join + ' ';
            }
        }
    }
};

var deleteTemplate = function (table, conditionFields, conditionValueFields, join, callback) {
    deleteTemplateOp(table, conditionFields, conditionValueFields, join, '', callback);
};

// recursive query by a queryArray
exports.queryData = queryData;
// a mysql `select` query template
exports.selectTemplate  = selectTemplate;
exports.selectTemplateOp = selectTemplateOp;
// a mysql `insert` query template
exports.insertTemplate  = insertTemplate;
exports.insertTemplateOp  = insertTemplateOp;
// a mysql `update` query template
exports.updateTemplate  = updateTemplate;
exports.updateTemplateOp = updateTemplateOp;
// a mysql `delete` query template
exports.deleteTemplate  = deleteTemplate;
exports.deleteTemplateOp = deleteTemplateOp;

