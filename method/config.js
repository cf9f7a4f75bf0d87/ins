/**
 * Created by i on 7/31/15.
 */

var defaultHeadPicture  = "https://test-areas.c9.io/images/index.png";
var defaultSex          = "男";
var defaultTel          = "没有预留电话";
var User2ProductList = {};


User2ProductList["张三"]= "('a23286','a23287','a23288') "; //edu
User2ProductList["李四"]= "('a23283','a23293','a23294') "; //hospital
User2ProductList["王五"]= "('t222011','t222012','t222013') ";// invest
User2ProductList["六"] = "('a22281','a23281','a23289') " ;// accident

function checkHeadPicture(headPicture){
    return checkNullSetStr(headPicture,defaultHeadPicture);
}

function checkNullSetStr(check,value){
    return check?check:value;
}

function null2Str(check){
    return checkNullSetStr(check,"");
}

exports.checkHeadPicture        = checkHeadPicture;
exports.null2Str         = null2Str;
exports.User2ProductList = User2ProductList;