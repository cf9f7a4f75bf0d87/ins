/**
 * Created by i on 8/29/15.
 */


function validMessage(res,result,path){
    var message;
    if(result){
        message = "修改成功";
    }
    else{message="修改失败"}
    res.render(path, {title: "系统信息", message: message});
}












exports.validMessage = validMessage;
