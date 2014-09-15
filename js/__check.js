(function() {
	'use strict';
	
	var apiList = [
		["window.File", true],
		["window.FileReader", true],
		["window.FileList", true],
		["window.Blob", true],
		["window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.oIndexedDB || window.msIndexedDB", true],
		["window.IDBKeyRange || window.webkitIDBKeyRange", true],
		["window.Promise", true]
	];
	
	var check = function() {
	
		var result = true;
		
		apiList.forEach(function(api) {
			
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
	
	if (check()) {
		alert("Your browser does not fully support DDMP!");
		return;
	}
})( window );