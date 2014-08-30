function mediaObject(file, position) {
	this.file = file;
	this.position = position;
	this.command = "app.player.deleteTrack(" + this.position + ")";
	this.extension;
	this.name;
	this.detail;
	this.type;
	this.streamUrl = new Array();
	
	this.extraktFileInfo();
	this.fillSpecials();
}

mediaObject.prototype.extraktFileInfo = function() {
	
	
	var fileType = this.file.type.split("/");
	var extension = this.file.name.split(".");
	
	if(extension.length == 2) {
		this.extension = extension[1];
		this.name = extension[0];
	} else {
		this.name = this.file.name;
	}
	
	if(fileType.length == 2) {
		this.type = fileType[0];
		this.detail = fileType[1];
	} else {
		this.type = this.file.type;
	}
};

mediaObject.prototype.fillSpecials = function() {
	var reader = new FileReader();
	var self = this;
	
	
	switch(this.extension) {
		case "pls":
			this.type = "audio";
			this.detail = "stream";
			reader.addEventListener("loadend", this.parsePls.bind(this), false);
			reader.readAsText(this.file);
			break;
	}
};


mediaObject.prototype.parsePls = function(e) {

	var result = e.target.result;
	var lines = result.split("\n");
	
	for(var i = 0; i < lines.length; i++) {
		var parts = lines[i].split("=");
		if(parts.length == 2) {
			if(parts[0].indexOf("File") > -1) {
				this.streamUrl.push(parts[1]);
			}
		}
	}
};

mediaObject.prototype.getUrl = function() {
	if(this.detail == "stream") {
		return this.streamUrl[0];
	} else {
		return URL.createObjectURL(this.file);
	}
};

