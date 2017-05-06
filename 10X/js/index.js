//获取窗口宽度
documentWidth = window.screen.availWidth;

$(document).ready(function(){
    if(documentWidth > 500){
        documentWidth = 500; 
    }
    $('#container').css('width',0.95*documentWidth);
});

//游戏规则
function rule(){
    $('#main').toggle();
    $('#info').toggle();
}