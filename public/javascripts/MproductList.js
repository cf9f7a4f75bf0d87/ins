/**
 * Created by i on 8/28/15.
 */
$(document).ready(function(){
    $(".deleteproduct").click(function(){
        var parent = $(this).parent().parent();
        $.ajax({
            url:"removeproduct",
            type:"post",
            data:{productname:parent.find(".productname").text()},
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