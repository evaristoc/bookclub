var mongoose = require('mongoose');
//var bcrypt = require('bcryptjs');

//mongoose.connect('mongodb://localhost/elearn');
//var db = mongoose.connection;

// User Schema
var ClassSchema = mongoose.Schema({
	owner_id: {
		type: idObject,
	},
	title: {
		type: String
	},
	authors: [
		type: String	
	],
	edition:{
		type: String
	},
	remarks:{
		type: String
	},
	tags: [
		type:String
	],
	status:{
		lent: {type:String},
                date: {type:Date}
        }
});

// Training: Instantiation of User as a mongoose instance
var Class = module.exports = mongoose.model('Class', ClassSchema);


// Training: Fetch all Classes
module.exports.getClasses = function(callback, limit) {
	Class.find(callback).limit(limit);
}

// fetch Single Class
module.exports.getClassById = function(id, callback){
	Class.findById(id,callback);
}
