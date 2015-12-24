var net = require ("net");
// var prompt = require('prompt');
// prompt.start();
var message;
var HOST = '192.168.1.116'; 
var PORT = 33333;

// var Parse = require('node-parse-api').Parse;
// var APP_ID = "N83sf1WUHXPdfs5M2OT0lAYAJHYxmjrL8hTP9BhH";
// var MASTER_KEY = "WfmmcmHQd03qEet16A4O9ox8mlzuN4aP1IPOrGDW";
// var appParse = new Parse(APP_ID, MASTER_KEY);

var bodyParser = require('body-parser');
var express = require("express");
var app = express();
var eport = 3000;//CLIENT
var url='localhost'
var server = app.listen(eport);
var io = require("socket.io").listen(server);
var pushcount=0;
var listenpushcount=0;
var audioCount;
var PythonShell = require('python-shell');

var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var sport = new SerialPort("/dev/ttyACM0", {
  baudrate: 9600,
  parser: serialport.parsers.readline("\n")
}, false); // this is the openImmediately flag [default is true]

var fs = require('fs'); //sound text file
var readTextFile = fs.readFileSync('count.txt').toString();
var toInt = parseInt(readTextFile);
var recording = false;
var listening = false;
var DateWhenPressed, path;
var client = new net.Socket();
///create server
app.use(express.static(__dirname + '/public'));
// console.log('Simple static server listening at '+url+':'+eport);
console.log("content of count.txt = " + readTextFile);

//READING ANALOG FROM Arduino
sport.open(function(error) {

      console.log("recording open: " + recording);
      if (error) {
        console.log('failed to open: ' + error);
      ////////////////////RECORD SENSOR/////////////////////// 
      }else{
        client.connect(PORT, HOST, function() {

        console.log('CONNECTED TO: ' + HOST + ':' + PORT);

        sport.on('data',function(data){
          // console.log("port.on (data) = " + data);
        
            if (data == 1){
                if(pushcount==0){
                    console.log('Squeezed to record!');
                    recording = true;
                    
                    audioCount = toInt;
                    audioCount = audioCount+1;
                    // console.log("audiocount = " +audioCount);

                    PythonShell.run('recSound.py', function (err) {
                    }); 
                    recording = false; 
                    console.log('finished recording');

                    fs.writeFile("count.txt", audioCount, function(err) {
                        console.log("The file was saved!");
                    });

                    pushcount++;
                }
                setTimeout(function(){
                 pushcount = 0; 
                }, 3000);
            }//end of if(data==1)
            
            ////////////////////LISTEN SENSOR///////////////////////
            else if (data == 2){
                if(listenpushcount==0){
                    console.log('Squeezed to record!');
                    listening = true;
                    
                    PythonShell.run('playSound.py', function (err) {
                    });   
                    console.log('finished listening');
                    listening = false;
                    listenpushcount++;

                    DateWhenPressed = new Date();
                    // console.log('Date is ' + DateWhenPressed);

                    path = 'http://192.168.1.147:3000/'+ audioCount + '.mp3';
                    // console.log(path);

                    message = DateWhenPressed + ',' + path;
                    console.log(message);

                    client.write(message);
    
                };//if(lisetenpushcount == 0)
                setTimeout(function(){
                    listenpushcount = 0; 
                }, 3000);
        }; //else if(data == 2)
    }); //sport on
  });//client.connect
}//else

});//sport open
    