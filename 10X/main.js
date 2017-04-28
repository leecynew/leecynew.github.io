documentWidth = window.screen.availWidth;
containerWidth = 0.92*documentWidth;
cellSideLength = 0.16*documentWidth;
cellSpace = 0.02*documentWidth;

var board = new Array();
var score = 0;

$(document).ready(function(){
    prepareForMobile();
    newgame();
    clickNum();
    
});

//屏幕自适应
function prepareForMobile(){
    if(documentWidth > 510){
        containerWidth = 510;
        cellSideLength = 90;
        cellSpace = 10; 
    }
    $('#container').css('width',containerWidth-2*cellSpace);
    $('#container').css('height',containerWidth-2*cellSpace);
    $('#container').css('padding',cellSpace);
    $('#container').css('border-radius',0.02*containerWidth);   
    $('.cell').css('width',cellSideLength);
    $('.cell').css('height',cellSideLength);
    $('.cell').css('border-radius',0.02*cellSideLength);
    $('.cell').css('font-size',0.65*cellSideLength+'px');
    $('.cell').css('line-height',cellSideLength+'px');
    $('#gameover').css('width',containerWidth);
    $('#gameover').css('height',containerWidth);
    $('#gameover').css('border-radius',0.02*containerWidth);
    $('#gameover p').css('padding',0.1*containerWidth);     
    $('#gameover p').css('font-size',0.1*containerWidth+'px'); 
    $('#try_again').css('font-size',0.06*containerWidth+'px');
}

//初始化
function newgame(){   
    for(var i=0;i<5;i++){
        board[i] = new Array();
        for(var j=0;j<5;j++){
            board[i][j] = randomNumber(); 
            //绘制单元格
            var cell = $("#cell-"+i+"-"+j);
            cell.css('top',getPosTop(i,j));
            cell.css('left',getPosLeft(i,j));
            cell.css('background-color',backgroundColor(board[i][j]));
            cell.text(board[i][j]);
        }
    }
    $('#gameover').css('display','none');
    //重置分数
    updateScore(0,0);
    score = 0;
}

//点击操作
function clickNum(){
    $(".cell").click(function(){
        //获取单元格坐标
        var id = $(this).attr("id");
        var arr = id.split("-");
        var i = parseInt(arr[1]);
        var j = parseInt(arr[2]);
        //判断能否点击
        if(board[i][j] > 0){
            updateScore(score,board[i][j]+1);
            score += board[i][j]+1; 
            addNum(i,j);          
        }
	});
}

//数字相加
function addNum(i,j){
    //遍历周围单元格
    for(var x=i-1;x<=i+1;x++){
        for(var y=j-1;y<=j+1;y++){
            //除去被点击元素
            if(x==i && y==j){
                continue;
            }
            //判断边界
            if(x>=0 && x<=4 && y>=0 && y<=4){
                board[x][y] += board[i][j];
                if(board[x][y] > 50){
                    $("#cell-"+x+"-"+y).css('background-color','#f30');
                    $("#cell-"+x+"-"+y).animateNumber({number:51});
                    gameover();
                }else{
                    showNumber(x,y);
                }             
            }
        }
    }
    //该单元格值变为-1
    board[i][j] = -1;
    showNumber(i,j);
    clearMultipe();
}

//消除10的倍数
function clearMultipe()
{
    //计算10倍的个数及总和
    var count = 0;
    var sum = 0;
    //遍历所有单元格
    for(var i=0;i<5;i++){
        for(var j=0;j<5;j++){
            if(board[i][j]%10 == 0){
                count++;
                sum += board[i][j];
                changeNum(i,j);
            }
        }
    }
    updateScore(score,sum*count);
    score += sum*count;
}

//将10的倍数替换
function changeNum(i,j){
    board[i][j] = Math.floor(Math.random()*4+2);
    var cell = $("#cell-"+i+"-"+j);
    setTimeout(function(){
        cell.css('background-color',backgroundColor(board[i][j]));
        cell.fadeOut();
        cell.text(board[i][j]);
        cell.fadeIn();
    },1000);
}

//游戏结束
function gameover(){
    $('#gameover').fadeIn(2000);
}

//生成随机数
function randomNumber(){
    return Math.floor(Math.random()*9+1);
}

//获取Y方向偏移量
function getPosTop(i,j){
    return cellSpace+i*(cellSideLength+cellSpace);
}

//获取X方向偏移量
function getPosLeft(i,j){
    return cellSpace+j*(cellSideLength+cellSpace);
}

//数字背景颜色
function backgroundColor(num){
    var r = 250-3*num;
    var g = 250-3*num;
    var b = 254;
    var color = "rgb("+r+","+g+","+b+")";
    return color;
}

//数字动画
function showNumber(i,j){
    var cell = $("#cell-"+i+"-"+j);
    cell.css('background-color',backgroundColor(board[i][j]));
    cell.animateNumber({number:board[i][j]});
}

//更新分数
function updateScore(score,num){
    $('#score').prop('number',score).animateNumber({number:score+num});
}