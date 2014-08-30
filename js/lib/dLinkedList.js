function doubleLinkedList(item, next, previous, current) {
	this.next = ((next !== undefined) ? next : null);
	this.previous = ((previous !== undefined) ? previous : null);
	
	this.current = ((current !== undefined) ? current : this);
	
	this.item = item;
}

/**
 * Checks if there is a next item available.
 * 
 * @return boolean 
 */
doubleLinkedList.prototype.hasNext = function() {
	return ((this.next) ? true : false);
};

/**
 * Checks if there is a previous item available.
 * 
 * @return boolean 
 */
doubleLinkedList.prototype.hasPrevious = function() {
	return ((this.previous) ? true : false);
};

/**
 * Insert item to the current position.
 * 
 * @return this 
 */
doubleLinkedList.prototype.insert = function(item) {
	
	newItem = new doubleLinkedList(this.item, this.next, this, this.current);
	
	this.next = newItem;
	this.item = item;
	
	return this;
};

/**
 * Insert item to the next position.
 * 
 * @return this
 */
doubleLinkedList.prototype.add = function(item) {
	
	newItem = new doubleLinkedList(item, this.next, this, this.current);
	
	this.next = newItem;
	
	return this.next;
};

/**
 * Add item to the last position.
 * 
 * @return this
 */
doubleLinkedList.prototype.push = function(item) {
	if(this.hasNext()) {
		return this.next.push(item);
	}
	return this.add(item);
};


/**
 * Delete the current item.
 * 
 * @return this
 */
doubleLinkedList.prototype.delete = function() {
	this.previous.next = this.next;
	this.next.previous = this.previous;
	return this.next;
};

/**
 * Clears the list.
 * 
 * @return this
 */
doubleLinkedList.prototype.clear = function() {
	this.next = null;
	this.previous = null;
	this.item = null;
	
	return this;
};

/**
 * Go to next Element
 * 
 * @return this.next
 */
doubleLinkedList.prototype.goNext = function() {
	this.next.current = this.next;
	this.current = this.next;
};

/**
 * Go to previouse Element
 * 
 * @return this.next
 */
doubleLinkedList.prototype.goPrevious = function() {
	this.previous.current = this.previous;
	this.current = this.previous;
};






