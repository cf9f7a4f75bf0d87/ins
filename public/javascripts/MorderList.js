/**
 * Created by i on 8/28/15.
 */
$(document).ready(function(){
    $(".deleteorder").click(function(){
        var parent = $(this).parent().parent();
        $.ajax({
            url:"removeorder",
            type:"post",
            data:{orderid:parent.find(".orderid").text(),account:parent.find(".account").text()},
            dataType:"json",
            success:function(){
                parent.remove();
            },
            error:function(){
                alert("更新失败,请刷新页面重试..");
            }
        });
    });

});