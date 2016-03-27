window.onload = function () {

	var introContext = new AudioContext();
	var introRequest = setUpRequest("assets/lolmusic.mp3");

	introRequest.onload = function() {
		introContext.decodeAudioData(introRequest.response, function(buffer) {
			introBuffer = buffer;
		}, function () {
			console.log("ruh-roh, trouble gettin audio")
		});
	}

	introRequest.send();

	window.setTimeout(function () {
		playAudio(introBuffer, introContext);
	}, 500);
}

function setUpRequest (url, context, sourceBuffer) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';

	return request;
}

function playAudio (buffer, context) {
	currentAudio = context.createBufferSource();
	currentAudio.buffer = buffer;
	currentAudio.loop = true;
	currentAudio.connect(context.destination);
	currentAudio.start(0); 
}