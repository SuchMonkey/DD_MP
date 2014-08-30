function fileHandler(elementID, handleFileSelect) {
	this.handleFileSelect = handleFileSelect;
	this.eSingleInput = document.getElementById(elementID.singleFileInput);
	this.eMultiInput = document.getElementById(elementID.multiFileInput);
	
	this.eSingleInput.addEventListener("change", handleFileSelect, false);
	this.eMultiInput.addEventListener("change", handleFileSelect, false);
}