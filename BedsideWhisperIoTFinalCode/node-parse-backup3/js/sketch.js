var socket;
var TimeValue;
var url='192.168.1.116';
var port=8000;

socket = io.connect(url+':'+port);

function fromParse(){
	console.log("Get data from Boyfriend_Recording Parse");

	socket.emit('getFromParse', function(){
	});
};

function fromParse2(){
	console.log("Get data from Girlfriend_Recording Parse");

	socket.emit('getFromParse2', function(){
	});
};

socket.on('toScreen', function (data) {
	var num=Object.keys(data.ParseData.results).length;
	var date = data.ParseData.results[num-1].dateOfRecording;
	
	console.log(data);
	var sound = data.ParseData.results[num-1].filepath;
	console.log(sound);

	var audio = document.createElement('audio');
	audio.setAttribute('src', sound);
	audio.setAttribute("controls", "controls");
	audio.play();
	
	document.body.appendChild(audio);
	document.getElementById("dateOfRecordingBox1").style.display = "block";
	document.getElementById("dateOfRecordingBox1").innerHTML = date;

});

socket.on('toScreen2', function (data) {
	var num=Object.keys(data.ParseData.results).length;
	var date = data.ParseData.results[num-1].dateOfRecording;
	console.log(data);
	var sound = data.ParseData.results[num-1].filepath;
	console.log(sound);

	var audio = document.createElement('audio');
	audio.setAttribute('src', sound);
	audio.setAttribute("controls", "controls");
	audio.play();
	
	document.body.appendChild(audio);
	document.getElementById("dateOfRecordingBox2").style.display = "block";
	document.getElementById("dateOfRecordingBox2").innerHTML = date;

});

function validateForm() {
    var x = document.forms["myForm"]["fname"].value;
    if (x == null || x == "") {
        alert("Name must be filled out");
        return false;
    }
    else if (x == Tom) {
        return false;
    }
}