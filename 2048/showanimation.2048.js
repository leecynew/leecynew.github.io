function showNumber(i,j,randNumber){
    var numberCell = $('#number-cell-'+i+'-'+j);
    numberCell.css('background-color',numberBackgroundColor(randNumber));
    numberCell.css('color',numberColor(randNumber));
    numberCell.text(randNumber);
    numberCell.animate({
       width:cellSideLength,
       height:cellSideLength,
       top:getPosTop(i,j),
       left:getPosLeft(i,j),
    },50);
}

function showMove(fromx,fromy,tox,toy){
    var numberCell = $('#number-cell-'+fromx+'-'+fromy);
    numberCell.animate({
       top:getPosTop(tox,toy),
       left:getPosLeft(tox,toy),
    },200);
}

function updateScore(score){
    $('#score').text(score);
}