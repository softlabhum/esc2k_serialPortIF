/**
 * http://usejsdoc.org/
 */
var express = require('express'),
    http = require('http'),
    app = express(),
    server = http.createServer(app) ;

var bodyParser = require('body-parser') ;
var SerialPort = require('serialport');
var serial = new SerialPort('COM1', {
    baudRate : 9600
  }) ;


  function ascii2hex(str) {
    var arr = [];
    for (var i = 0, l = str.length; i < l; i ++) {
      var hex = Number(str.charCodeAt(i)).toString(16);
      arr.push(hex);
    }
    console.log("### HEX =>"+arr)
    return arr;
  }

  function chk8xor(byteArray) {
    let checksum = 0x00;
    for(let i = 0; i < byteArray.length ; i++){
      checksum ^= (byteArray[i]) ;
      console.log("### byteArray("+i+")=>>["+ byteArray[i] +"]");
      //console.log("### ~byteArray("+i+")=>>["+ ~byteArray[i] +"]");
      //console.log("### byteArray("+i+") & 0xFF=>>["+ (byteArray[i] & 0xff) +"]");
      console.log("### checksum=>>["+ checksum +"]");
    }
    //checksum = ~checksum;
    console.log("### checksum & 0xff=>>["+ (checksum & 0xff ) +"]");
    return checksum&0xff;
  }

app.use(bodyParser.json()) ;
app.use(bodyParser.urlencoded({ extended : false })) ;
app.get('/serial', function (req, res) {
    res.sendfile('serial.html', {root : __dirname }) ;
  }) ;

app.post('/serial', function (req, res) {
    var val = req.body.send ;
    console.log("### SND_DATA : ["+val+"]") ;

    let hexCode = ascii2hex( val );
    let chkSum = chk8xor(hexCode);

    // 
    serial.write(val, function(err) {}) ;

    
    res.sendfile('serial.html', {root : __dirname }) ;
  }) ;

serial.on('data', function(data) {
    console.log("### RCV_DATA : ["+data.toString()+"]") ;
  }) ;

server.listen(8000, function() {
    console.log('Express server listening on port ' + server.address().port) ;
  }) ;