(function( window, document, undefined ) {

'use strict';

var DEFAULTS = {
	x: 30,
	y: 30,
	invert: false,
	rot3d: false,
	transition: 0
}

function Wind(element, options) {

	if( !element ) throw new TypeError('Please suply an element.')
	if( !options ) var options = {};

	this.target = element;

	this.x = options.x || DEFAULTS.x;
	this.y = options.y || DEFAULTS.y;
	this.invert = options.invert || DEFAULTS.invert;
	this.rot3d = options.rot3d || DEFAULTS.rot3d;
	this.transition = options.transition || DEFAULTS.transition;

	this.onMouseMove = this.onMouseMove.bind(this);
	this.moveTarget = this.moveTarget.bind(this);
	this.calculateMovement = this.calculateMovement.bind(this);
	this.matrix = this.matrix.bind(this);
	this.pos3d = this.pos3d.bind(this);
	this.init = this.init.bind(this);


	this.init();

}

Wind.prototype.init = function(){

	// Checks if NodeList is passed
	if( this.isNodeList(this.target) ) {
		// If it is, converts it to an array
		this.target = Array.prototype.slice.call(this.target);
	}
	else {
		this.target = [this.target];
	}

	// Checks if rot3d option is passed
	if(this.rot3d) {
		this.styling = this.pos3d;
	}
	else {
		this.styling = this.matrix;
	}


	this.listen();
};

Wind.prototype.listen = function(argument){
	window.addEventListener('mousemove', this.onMouseMove);
};

// Determines if passed object is a Node List
Wind.prototype.isNodeList = function(nodes){
	var stringRepr = Object.prototype.toString.call(nodes);

	return typeof nodes === 'object' &&
		/^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
		(nodes.length === 0 || (typeof nodes[0] === "object" && nodes[0].nodeType > 0));
};

// Handles mouse move
Wind.prototype.onMouseMove = function(event){

	var position = this.getMousePos(event);
	var movement = this.calculateMovement(position);

	this.moveTarget(movement);
};

// Gets the x and y coordinates of the cursor
Wind.prototype.getMousePos = function(event) {
	var posX = 0;
	var posY = 0;

	if (!event) var event = window.event;

	if (event.pageX || event.pageY) {
		posX = event.pageX;
		posY = event.pageY;
	}
	else if (event.clientX || event.clientY) {
		posX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		posY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}

	return {
		x : posX,
		y : posY
	}
};

// Calculates the needed movement
Wind.prototype.calculateMovement = function(position){
	return {
		x: 2 * this.x / screen.height * position.y - this.x,
		y: 2 * this.y / screen.width * position.x - this.y
	}
};

// Applies the styling to move the target
Wind.prototype.moveTarget = function(movement) {

	var styling = this.styling(movement.x, movement.y)

	this.target.forEach(function(element, index){
		element.style.WebkitTransform = element.style.transform = styling;
	});

};

// Returns a styling for 2d transforms
Wind.prototype.matrix = function(x, y) {
	if(this.invert) {
		var y = -y;
		var x = -x;
	}
	return 'matrix(1, 0, 0, 1,' + y + ', ' + x + ')';
};

// Returns a styling for 3d transforms
Wind.prototype.pos3d = function(x, y) {
	if(this.invert) {
		var y = -y;
		var x = -x;
	}
	return 'rotate3d(1, 0, 0,' + x + 'deg) rotate3d(0, 1, 0,' + y + 'deg)';
	
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( Wind );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = Wind;
} else {
  // browser global
  window.Wind = Wind;
}

	

})( window, document );