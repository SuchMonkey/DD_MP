function playerConsole () {
	this.view = "";
	this.msg = "";
	this.letterId = 0;
}

playerConsole.prototype.write = function(msg) {
	if(msg) {
		this.msg = msg;
		this.view = "";
		this.letterId = 0;
	}
	
	var letters = this.msg.split("");
	
	this.view += letters[this.letterId];
	


	if(this.letterId < letters.length - 1) {
		
		this.letterId += 1;
		window.setTimeout(this.write.bind(this), 60);
	} else {
		this.letterId = 0;
	}
};

