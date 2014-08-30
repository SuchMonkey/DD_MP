/**
 * Manages an array with a internal pointer. Allows iterationstuff... 
 */
function doubleLinkedList() {
	this.items = new Array();
	this.position = 0;
	
}

/**
 * Checks if there is a next item available.
 * 
 * @return boolean 
 */
doubleLinkedList.prototype.hasNext = function() {
	return ((this.position < this.items.length - 1) ? true : false);
};

/**
 * Checks if there is a previous item available.
 * 
 * @return boolean 
 */
doubleLinkedList.prototype.hasPrevious = function() {
	return ((this.position > 0) ? true : false);
};

/**
 * Checks if the given position is within the array bonds.
 * 
 * @param int position The position you want to check.
 */
doubleLinkedList.prototype.isValidPosition = function(position) {
	return ((position >= 0 && position < this.items.length) ? true : false);
};

/**
 * The current position.
 * 
 * @return this
 */
doubleLinkedList.prototype.current = function() {
	return this;
};

/**
 * Sets the position the last position.
 */
doubleLinkedList.prototype.end = function() {
	this.position = this.items.length - 1;
	return this;
};

/**
 * Sets the position to the first position.
 * 
 * @return this
 */
doubleLinkedList.prototype.begin = function() {
	this.position = 0;
	return this;
};

/**
 * Sets the position to valid next number.
 * 
 * @return this
 */
doubleLinkedList.prototype.next = function() {
	if(this.hasNext()) {
		this.position = this.position + 1;
	}
	return this;
};

/**
 * Sets the position to valid previous number.
 * 
 * @return this
 */
doubleLinkedList.prototype.previous = function() {
	if(this.hasPrevious()) {
		this.position = this.position - 1;
	}
	return this;
};

/**
 * Sets the position to a valid number.
 * 
 * @return this
 */
doubleLinkedList.prototype.setPosition = function(position) {
	if(this.isValidPosition(position)) {
		this.position = position;
	}
	return this;
};

/**
 * Returns the current item.
 * 
 * @return object
 */
doubleLinkedList.prototype.item = function() {
	return this.items[this.position];
};

/**
 * Insert item to the current position.
 * 
 * @return this 
 */
doubleLinkedList.prototype.insert = function(item) {
	this.items.splice(this.position, 0, item);
	return this;
};

/**
 * Insert item to the next position.
 * 
 * @return this
 */
doubleLinkedList.prototype.add = function(item) {
	this.items.splice(this.position + 1, 0, item);
	return this;
};

/**
 * Add item to the last position.
 * 
 * @return this
 */
doubleLinkedList.prototype.push = function(item) {
	this.items.push(item);
	return this;
};


/**
 * Delete the item on the current position.
 * 
 * @return this
 */
doubleLinkedList.prototype.delete = function() {
	this.items.splice(this.position, 1);
	return this;
};

/**
 * Clears the list and sets the position to 0.
 * 
 * @return this
 */
doubleLinkedList.prototype.clear = function() {
	this.position = 0;
	this.items = new Array();
	return this;
};






