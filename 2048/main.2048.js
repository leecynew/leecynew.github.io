var board = new Array();
var score = 0;
var conflict = new Array();

var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function(){
    prepareForMobile();
    newgame();
});

function prepareForMobile(){
    if(documentWidth > 500){
        containerWidth = 500;
        cellSideLength = 100;
        cellSpace = 20; 
    }
    $('#container').css('width',containerWidth-2*cellSpace);
    $('#container').css('height',containerWidth-2*cellSpace);
    $('#container').css('padding',cellSpace);
    $('#container').css('border-radius',0.02*containerWidth);   
    $('.cell').css('width',cellSideLength);
    $('.cell').css('height',cellSideLength);
    $('.cell').css('border-radius',0.02*cellSideLength);
    $('#gameover').css('width',containerWidth);
    $('#gameover').css('height',containerWidth);
    $('#try_again').css('line-height',containerWidth+'px');
    $('#try_again').css('font-size',containerWidth/10+'px');
}

function newgame(){
    //初始化棋牌
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
    $('#gameover').css('display','none');
}

function init(){
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            var cell = $("#cell-"+i+"-"+j);
            cell.css('top',getPosTop(i,j));
            cell.css('left',getPosLeft(i,j));
        }
    }

    for(var i=0;i<4;i++){
        board[i] = new Array();
        conflict[i] = new Array();
        for(var j=0;j<4;j++){
            board[i][j] = 0;
            conflict[i][j] = false;
        }
    }
    
    updateBoard();
    score = 0;
    updateScore(score);
}

function updateBoard(){
    $(".number-cell").remove();
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            $("#container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var numberCell = $('#number-cell-'+i+'-'+j);
            if(board[i][j] == 0){
                numberCell.css('width','0px');
                numberCell.css('height','0px');
                numberCell.css('top',getPosTop(i,j)+cellSideLength/2);
                numberCell.css('left',getPosLeft(i,j)+cellSideLength/2);
            }else{
                numberCell.css('width',cellSideLength);
                numberCell.css('height',cellSideLength);
                numberCell.css('top',getPosTop(i,j));
                numberCell.css('left',getPosLeft(i,j));
                numberCell.css('background-color',numberBackgroundColor(board[i][j]));
                numberCell.css('color',numberColor(board[i][j]));
                numberCell.text(board[i][j]);
            }
            conflict[i][j] = false;
            
            if(board[i][j]>999){
                $('#number-cell-'+i+'-'+j).css('font-size',0.4*cellSideLength+'px');
            }else if(board[i][j]>99){
                $('#number-cell-'+i+'-'+j).css('font-size',0.5*cellSideLength+'px');
            }else{
                $('#number-cell-'+i+'-'+j).css('font-size',0.6*cellSideLength+'px');
            }
        }
    }
    $(".number-cell").css('line-height',cellSideLength+'px');
}

function generateOneNumber(){
    if(nospace(board)){
        return false;
    }
    //随机一个位置
    var randx = parseInt(Math.floor(Math.random()*4));
    var randy = parseInt(Math.floor(Math.random()*4));
    var times = 0;
    while(times < 50){
        if(board[randx][randy] == 0){
            break;
        }
        randx = parseInt(Math.floor(Math.random()*4));
        randy = parseInt(Math.floor(Math.random()*4));
        times++;
    }
    if(times == 50){
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                if(board[i][j] == 0){
                    randx = i;
                    randy = j;
                }
            }
        }
    }
    //随机一个数字
    var randNumber = Math.random()<0.5?2:4;
    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumber(randx,randy,randNumber);
    
    return true;
}

$(document).keydown(function(event){   
    switch(event.keyCode){
        case 37://left
            event.preventDefault();
            if(moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 38://up
            event.preventDefault();
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 39://right
            event.preventDefault();
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 40://down
            event.preventDefault();
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        default:
            break;
    }
});

document.addEventListener('touchstart',function(event){
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});

document.addEventListener('touchmove',function(event){
    event.preventDefault();
});

document.addEventListener('touchend',function(event){
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;
    var deltax = endx - startx;
    var deltay = endy - starty;
    //判断是点击还是滑动
    if(Math.abs(deltax) < 0.3*documentWidth && Math.abs(deltay) < 0.3*documentWidth){
        return;
    }
    //x方向
    if(Math.abs(deltax) >= Math.abs(deltay)){
        if(deltax > 0){
            //向右滑动
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }else{
            //向左滑动
            if(moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
    }
    //y方向
    else{
        if(deltay > 0){
            //向下滑动
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }else{
            //向上滑动
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
    }
});


function isgameover(){
    if(nospace(board) && nomove(board)){
        gameover();
    }
}

function gameover(){
    //alert("gameover!");
    $('#gameover').css('display','block');
}

function moveLeft(){
    if(!canMoveLeft(board)){
        return false;
    }
    //moveLeft
    for(var i=0;i<4;i++){
        for(var j=1;j<4;j++){
            if(board[i][j] != 0){
                for(var k=0;k<j;k++){
                    if(board[i][k] == 0 && noBlockHorizontal(i,k,j,board)){
                        //move
                        showMove(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }else if(board[i][k] == board[i][j] && noBlockHorizontal(i,k,j,board) && !conflict[i][k]){
                        //move
                        showMove(i,j,i,k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore(score);
                        //conflict
                        conflict[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoard()",200);
    return true;
}

function moveRight(){
    if(!canMoveRight(board)){
        return false;
    }
    //moveRight
    for(var i=0;i<4;i++){
        for(var j=2;j>=0;j--){
            if(board[i][j] != 0){
                for(var k=3;k>j;k--){
                    if(board[i][k] == 0 && noBlockHorizontal(i,j,k,board)){
                        //move
                        showMove(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }else if(board[i][k] == board[i][j] && noBlockHorizontal(i,j,k,board) && !conflict[i][k]){
                        //move
                        showMove(i,j,i,k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore(score);
                        //conflict
                        conflict[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoard()",200);
    return true;
}

function moveUp(){
    if(!canMoveUp(board)){
        return false;
    }
    //moveUp
    for(var j=0;j<4;j++){
        for(var i=1;i<4;i++){        
            if(board[i][j] != 0){
                for(var k=0;k<i;k++){
                    if(board[k][j] == 0 && noBlockVertical(j,k,i,board)){
                        //move
                        showMove(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }else if(board[k][j] == board[i][j] && noBlockVertical(j,k,i,board) && !conflict[k][j]){
                        //move
                        showMove(i,j,k,j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore(score);
                        //conflict
                        conflict[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoard()",200);
    return true;
}

function moveDown(){
    if(!canMoveDown(board)){
        return false;
    }
    //moveDown
    for(var j=0;j<4;j++){
        for(var i=2;i>=0;i--){
            if(board[i][j] != 0){
                for(var k=3;k>i;k--){
                    if(board[k][j] == 0 && noBlockVertical(j,i,k,board)){
                        //move
                        showMove(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }else if(board[k][j] == board[i][j] && noBlockVertical(j,i,k,board) && !conflict[k][j]){
                        //move
                        showMove(i,j,k,j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore(score);
                        //conflict
                        conflict[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoard()",200);
    return true;
}