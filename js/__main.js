(function(){
	document.addEventListener('DOMContentLoaded', main);

	function main() {
		var appFileSystem = new fileSystem("testfs");
	}
})( window );


/*

var app = {
	mediaQueue: null,
	fileHandler: null,
	player: null,
	playerConsole: null,
	elementID: {
		canvas: "eCanvas",
		audio: "eAudio",
		video: "eVideo",
		singleFileInput: "eSingleFileInput",
		multiFileInput: "eMultiFileInput"
	},
	hooks: {
		play: "btnPlay",
		stop: "btnStop",
		pause: "btnPause",
		next: "btnNext",
		previous: "btnPrevious",
		trash: "btnTrash",
		forward: "btnForward",
		backward: "btnBackward",
		volumen: "sldVolumen",
		scrubber: "sldScrubber",
		textOutput: "txtOutput"
	}
};

document.addEventListener('DOMContentLoaded', main());

function main() {

	if (__check.ok()) {
		alert("Your browser does not fully support DDMP!");
		return;
	}
	
	app.playerConsole = new playerConsole();
	
	app.player = new player();
	app.player.hookUp();
	app.mediaQueue = new doubleLinkedList();
	app.fileHandler = new fileHandler(app.elementID,
		function(evt) {
			var fileList = evt.target.files;
			
			for(var i = 0; i < fileList.length; i++) {
				app.mediaQueue.push(new mediaObject(fileList[i], app.mediaQueue.items.length));
			}
		}
	);

	
	
	
	var queueItemTemplate = document.querySelector(".queueItemTemplate");
	var consoleTemplate = document.querySelector(".console");
	
	
	
	Binder(queueItemTemplate, app.mediaQueue)
		.bind();
		
	Binder(consoleTemplate, app.playerConsole).bind();
	app.playerConsole.write("Hi! This is DDMP speaking...");
}



*/