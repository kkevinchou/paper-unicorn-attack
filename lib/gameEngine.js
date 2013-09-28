
function PaperGameEngine () {
	var self = this;

};
module.exports = PaperGameEngine;

PaperGameEngine.prototype.processFrame = function (next) {
	console.log('in processFrame');

	next(null);
};

PaperGameEngine.prototype.getGameState = function () {
	var state = {
		'characters': [
			{'type': 'dragon', 'color': 'blue'},
			{'type': 'dragon', 'color': 'red'}
		]
	};

	return state;
};
