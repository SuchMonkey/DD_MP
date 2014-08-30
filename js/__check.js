var __check = new function() {
	this.apiList = [
		["window.File", true],
		["window.FileReader", true],
		["window.FileList", true],
		["window.Blob", true]
	];
	
	this.ok = function() {
	
		result = true;
		
		this.apiList.forEach(function(api) {
			
			if(api[1]) {
				if(eval(api[0])) {
					console.log(api[0] + " ... Check OK!");
				} else {
					console.error(api[0] + " ... Check NOT OK!");
					result = false;
				}
				
			} else {
				console.log(api[0] + " ... No Check performed!");
			}
			
			return result;
			
		});
	
	};
};
