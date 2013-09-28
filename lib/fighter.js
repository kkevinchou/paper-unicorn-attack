var entityModule = require('./entity.js');

function Fighter() {

}

Fighter.prototype = new entityModule.Entity();

exports.Fighter = Fighter;
