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

	this.target = element;

	if( !options ) var options = {};

	this.x = options.x || DEFAULTS.x;
	this.y = options.y || DEFAULTS.y;
	this.invert = options.invert || DEFAULTS.invert;
	this.rot3d = options.rot3d || DEFAULTS.rot3d;
	this.transition = options.transition || DEFAULTS.transition;

	this.onMouseMove = this.onMouseMove.bind(this);
	this.moveTarget = this.moveTarget.bind(this);
	this.matrix = this.matrix.bind(this);
	this.pos3d = this.pos3d.bind(this);
	this.listen();

}

Wind.prototype.listen = function(argument){
	window.addEventListener('mousemove', this.onMouseMove);
};

Wind.prototype.onMouseMove = function(event){

	var position = this.getMousePos(event);

	this.moveTarget(position);
};


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


Wind.prototype.moveTarget = function(position) {
	// transform values
	var rotX = 2 * this.x / screen.height * position.y - this.x,
		rotY = 2 * this.y / screen.width * position.x - this.y;

	this.target.style.WebkitTransform = this.target.style.transform = this.rot3d ? this.pos3d(rotX, rotY) : this.matrix(rotX, rotY);

};

Wind.prototype.matrix = function(x, y) {
	if(this.invert) {
		var y = -y;
		var x = -x;
	}
	return 'matrix(1, 0, 0, 1,' + y + ', ' + x + ')';
};

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