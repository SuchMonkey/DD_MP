function player() {
	
	this.eAudio = document.getElementById(app.elementID.audio);
	this.eVideo = document.getElementById(app.elementID.video);
	this.eCanvas = document.getElementById(app.elementID.canvas);
	
	this.btnPlay = document.getElementById(app.hooks.play);
	this.btnPause = document.getElementById(app.hooks.pause);
	this.btnStop = document.getElementById(app.hooks.stop);
	this.btnNext = document.getElementById(app.hooks.next);
	this.btnPrevious = document.getElementById(app.hooks.previous);
	this.btnTrash = document.getElementById(app.hooks.trash);
	this.btnForward = document.getElementById(app.hooks.forward);
	this.btnBackward = document.getElementById(app.hooks.backward);
	this.sldVolumen = document.getElementById(app.hooks.volumen);
	this.sldScrubber = document.getElementById(app.hooks.scrubber);
	
	this.state = "stop";
	
}

player.prototype.hookUp = function(){
	this.btnPlay.addEventListener("click", app.player.play, false);
	this.btnPause.addEventListener("click", app.player.pause, false);
	this.btnStop.addEventListener("click", app.player.stop, false);
	this.btnNext.addEventListener("click", app.player.next, false);
	this.btnPrevious.addEventListener("click", app.player.previous, false);
	this.btnTrash.addEventListener("click", app.player.trash, false);
	
	this.btnForward.addEventListener("mousedown", app.player.forward, false);
	this.btnForward.addEventListener("mouseup", app.player.forward, false);
	
	this.btnForward.addEventListener("mouseout", app.player.forward, false);
	this.btnBackward.addEventListener("mousedown", app.player.backward, false);
	this.btnBackward.addEventListener("mouseup", app.player.backward, false);
	this.btnBackward.addEventListener("mouseout", app.player.backward, false);
	
	this.sldVolumen.addEventListener("change", app.player.volumen, false);
	this.sldScrubber.addEventListener("change", app.player.scrubber, false);
	
	this.eAudio.addEventListener("timeupdate", app.player.scrubber, false);
	this.eAudio.addEventListener("loadedmetadata", app.player.scrubber, false);
	this.eAudio.addEventListener("ended", app.player.next, false);
};

player.prototype.play = function() {
	var mediaObject = app.mediaQueue.current().item();
	
	
	app.player.eAudio.src = mediaObject.getUrl();
	app.player.state = "play";
	
	app.player.eAudio.play();
	app.playerConsole.write("Playing - " + mediaObject.name);
};

player.prototype.pause = function() {
	if(app.player.state == "pause") {
		app.player.state = "play";
		app.player.eAudio.play();
	}
	if(app.player.state == "play") {
		app.player.state = "pause";
		app.player.eAudio.pause();
	}
	
};

player.prototype.stop = function() {
	app.player.state = "stop";
	app.player.eAudio.pause();
	
};

player.prototype.next = function() {
	app.mediaQueue.current().next();
	app.player.play();
};

player.prototype.previous = function() {
	app.mediaQueue.current().previous();
	app.player.play();
};

player.prototype.trash = function() {
	app.player.stop();
	app.mediaQueue.clear();
};

player.prototype.forward = function(e) {
	
	switch(e.type) {
		case "mousedown":
			app.player.eAudio.playbackRate = "2";
			break;
		case "mouseup" || "mouseout":
			app.player.eAudio.playbackRate = "1";
			break;
	}
};

player.prototype.backward = function(e) {
	switch(e.type) {
		case "mousedown":
			app.player.eAudio.playbackRate = "-2";
			break;
		case "mouseup" || "mouseout":
			app.player.eAudio.playbackRate = "1";
			break;
	}
};

player.prototype.volumen = function(e) {
	app.player.eAudio.volume = e.srcElement.value;
};

player.prototype.scrubber = function(e) {
	switch(e.type) {
		case "timeupdate":
			app.player.sldScrubber.value = e.srcElement.currentTime;
			break;
		case "change":
			app.player.eAudio.currentTime = e.srcElement.value;
			break;
		case "loadedmetadata":
			app.player.sldScrubber.max = app.player.eAudio.duration;
			app.player.sldScrubber.value = app.player.eAudio.currentTime;
			break;
	}
};

player.prototype.deleteTrack = function(position) {
	alert();
	app.player.stop();
	app.mediaQueue.setPosition(position).delete();
	app.player.play();
};
