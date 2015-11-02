var five = require("johnny-five");

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3010);

app.use(express.static('public'));







/**
             -y
             |
             |
             |
-x -------------------- +x
             |
             |
             |
             +y
*/
io.on('connection', function (socket)
{
  var left, right;
  var board = new five.Board();
  board.on("ready", function()
  {
    right = new five.Servo.Continuous(10).stop();
    left = new five.Servo.Continuous(9).stop();
    console.log('board is ready');
    socket.on('move', servoController(right, left));
  });
});



function servoController(pRight, pLeft)
{
  console.log('servoSocket is ready');
  return function (pData)
  {
      var x = pData.x;
      var y = pData.y;

      console.log(x, y)

      if(x==0 && y==0){
        //stop
        pRight.stop();
        pLeft.stop();
        console.log('stop');
      }
      else if (x>0 && Math.abs(y)<15) {
        // turn to right
        pRight.cw();
        pLeft.cw();
        console.log('turn right');
      }
      else if (Math.abs(x)<15 && y>0) {
        // go back
        pRight.cw();
        pLeft.ccw();
        console.log('go back');
      }
      else if (Math.abs(x)<15 && y<0) {
        // forward
        pRight.ccw(1);
        pLeft.cw(1);
        console.log('forward');
      }
      else if (x<0 && Math.abs(y)<15) {
        // turn left
        pRight.ccw();
        pLeft.ccw();
        console.log('turn left');
      }
  }
}
