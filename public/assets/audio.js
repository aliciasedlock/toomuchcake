function AudioInterface() {
}

AudioInterface.prototype.initAudio = function(url, loop) {
	var context = new AudioContext();
	var request = this.setUpRequest(url);
	var audio = this;
	var buff;

	this.loop = loop;

	request.onload = function() {
		
		context.decodeAudioData(request.response, function(buffer) {
			buff = buffer;
		}, function () {
			console.log("ruh-roh, trouble gettin audio")
		});
	}

	request.send();

	window.setTimeout(function () {
		audio.playAudio(buff, context);
	}, 500);
};

AudioInterface.prototype.setUpRequest = function(url, context, sourceBuffer) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';

	return request;
}

AudioInterface.prototype.playAudio = function(buffer, context) {
	currentAudio = context.createBufferSource();
	currentAudio.buffer = buffer;
	currentAudio.loop = this.loop;
	currentAudio.connect(context.destination);
	currentAudio.start(0); 
}