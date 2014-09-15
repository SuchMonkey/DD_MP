function fileSystem(fileSystemName) {
	this.loadFromDB();
	this.fileSystemName = fileSystemName;
	console.log(this);
}

fileSystem.prototype.loadFromDB = function() {
	var server;
	
	db.open({
		server: 'my-app',
		version: 1,
		schema: {
			people: {
				key: { keyPath: 'id' , autoIncrement: true },
				// Optionally add indexes
				indexes: {
					firstName: { },
					answer: { unique: true }
				}
			}
		}
	}).done(function(s) {
		server = s;
	});
};
