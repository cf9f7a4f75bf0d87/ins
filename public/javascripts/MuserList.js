/**
 * Created by i on 8/28/15.
 */
$(document).ready(function(){
    $(".deleteuser").click(function(){
        var parent = $(this).parent().parent();
        $.ajax({
            url:"removeuser",
            type:"post",
            data:{account:parent.find(".account").text()},
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