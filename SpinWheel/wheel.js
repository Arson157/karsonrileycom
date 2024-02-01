var placeHoldText = "Tom1\t4\nTom2\t2\nTom3\t3\nTom4\nTom5\nTom6";

document.getElementById("namesArray").value = placeHoldText;

var c = document.getElementById("WheelCanvas");
var seg = c.getContext("2d");
var mid = c.getContext("2d");
var rem = c.getContext("2d");
var names = [["Tom 1", 4], ["Tom 2", 2], ["Tom 3", 3], ["Tom 4", 1], ["Tom 5", 1], ["Tom 6", 1] ];
var centX = c.width / 2;
var centY = c.height / 2;
var remX = c.width - 200;
var remY = c.height - 75;
var radi = 250;
var centRadi = radi / 4;
var totalDivisions = countTotal(names);
var div = 2 * Math.PI / totalDivisions;
var pos = 0;
var wTopX = centX;
var wTopY = centY - (radi - 6);
var colors = ["#A2FAA3", "#4F759B", "#7EBDC2", "#5D5179", "#571F4E"];
var colorSet = [
                ["#A2FAA3", "#4F759B", "#7EBDC2", "#5D5179", "#571F4E"],
                ["#2A2D34","#009DDC","#F26430","#6761A8","#009B72"],
                ["#f00", "#f69", "#fc0"],
                ["#33f", "#b380ff", "#d1d1e0"],
               ];
var currentColor = 0;
var winnerIndex = 0;
var spinCount = 0;
var spinning = 0;
var theta;


function drawWheel() {
    totalDivisions = countTotal(names);
    div = 2 * Math.PI / totalDivisions;
    for (var i = 0; i < names.length; i++) {
        theta = div * names[i][1];
        seg.beginPath();
        seg.moveTo(centX, centY);
        seg.arc(centX, centY, radi, pos, pos + theta);
        seg.closePath();
        seg.fillStyle = colors[i % colors.length];
        seg.strokeStyle = "black";
        seg.fill();
        seg.stroke();
        seg.fillStyle = "black";
        seg.font = "16px sans-serif";
        seg.textAlign = 'end';
        seg.save();
        seg.translate(centX, centY);
        seg.rotate(pos + theta / 2);
        seg.fillText(names[i][0], radi - (radi / 10), 0);
        seg.restore();
        pos += theta;
    }
    
    seg.fillStyle = "black";
    seg.arc(centX, centY, radi, pos-0.2, pos);

}

function drawTicker() {
    seg.save();
    seg.beginPath();
    seg.moveTo(wTopX, wTopY);
    seg.lineTo(wTopX - 15, wTopY - 25);
    seg.lineTo(wTopX + 15, wTopY - 25);
    seg.fillStyle = "black";
    seg.fill();
    seg.restore();
}

function drawSpin(){
    mid.beginPath();
    mid.arc(centX, centY, centRadi, 0, 2 * Math.PI);
    mid.fillStyle = "white";
    mid.fill();
    mid.fillStyle = "black";
    mid.font = "40px serif";
    mid.textAlign = "center";
    mid.textBaseline = "middle";
    mid.fillText("Spin!", centX, centY);
    mid.closePath();

}

function countTotal(data) {
    var total = 0;
    for (var i = 0; i < data.length; i++) {
        total += parseInt(data[i][1]);
    }
    return total;
}

function intersectSpin(x,y) {
    return Math.sqrt(Math.pow((x-centX), 2) + Math.pow((y-centY), 2)) < centRadi + 15;
}

function intersectRemove(x,y) {
    return x > remX && x < remX + 150 && y > remY && y < remY + 50;
}

drawWheel();
drawSpin();
drawTicker();


c.addEventListener("click", function (event) {
    var x = event.pageX;
    var y = event.pageY;

    if(spinning == 1){
        return;
    }
    
    if(!intersectSpin(x - c.offsetLeft,y - c.offsetTop)) {
        return;
    }
    pos = Math.random() * (2 * Math.PI)
    spinning = 1;
    var i = 1;
    function spinLoop() {
        seg.clearRect(0,0, c.width, c.height);
        pos += (1/(.02*i))-0.08;
        i += 1;
        drawWheel();
        drawTicker();
        //625!!!!!!1
        
        if(i == 625){
            
            drawSpin();
            drawTicker();
            winner();
            congrats();
            spinning = 0;
            return
        }
        window.requestAnimationFrame(spinLoop);
    }
    spinLoop();
    
    
}, false);

function parse(){
    var input = document.getElementById("namesArray").value;
    if(input == placeHoldText) {
        alert("Please enter names");
        return;
    }
    names = [];
    var lines = [];
    lines = input.replace(/\r\n/g, "\n").split("\n")
    
    for(var i = 0; i < lines.length; i++){
        names[i] = lines[i].split("\t");
    }
    
    for(var i = 0; i < names.length; i++){
        if(!names[i][1]){
            names[i][1] = "1";
        }
    }
    
    if(names[names.length - 1][0] === ""){
        names.pop();
    }
    seg.clearRect(0,0, c.width, c.height);
    pos = 0;
    drawWheel();
    drawSpin();
    drawTicker();
    spinCount = 0;
}

function colorChange(){
    currentColor ++;
    colors = colorSet[currentColor%4];
    drawWheel();
    drawSpin();
    drawTicker();
}

function winner() {
    var endDeg = (pos * (180/Math.PI)) % 360;
    var degDiv = (div * (180/Math.PI));
    var numWin = 270 - endDeg;
    var segWin = numWin / degDiv;
    
    if(segWin < 0){
        segWin = totalDivisions + segWin;
    }
    var j = 0;
    var k = 0;
    for (var i = 1; i < segWin; i++){
        k++;
        if(k == names[j][1]){
            j++;
            k=0;
        }
    }
    winnerIndex = j;
}

function kill(){
    document.getElementById("winnerHold").style.display = "none";
    names.splice(winnerIndex, 1);
    spinCount = 0;
    drawWheel();
    drawSpin();
    drawTicker();
}

function congrats(){
    document.getElementById("winName").innerHTML = names[winnerIndex][0];
    document.getElementById("winnerHold").style.display = "block";
}

function closeWin(){
    document.getElementById("winnerHold").style.display = "none";
}
