/**
 * Created by i on 7/31/15.
 */

var defaultHeadPicture  = "https://test-areas.c9.io/images/index.png";
var defaultSex          = "男";
var defaultTel          = "没有预留电话";


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