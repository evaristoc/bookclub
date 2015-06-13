var mongoose = require('mongoose');
//var bcrypt = require('bcryptjs');

//mongoose.connect('mongodb://localhost/elearn');
//var db = mongoose.connection;

// User Schema
var BookSchema = mongoose.Schema({
	owner_id: {
		type: String,
	},
	title: {
		type: String
	},
	authors: {
		type: String	
	},
	edition:{
		type: String
	},
	remarks:{
		type: String
	},
	tags: {
		type:String
	},
	status:{
		lent: {type:String},
                date: {type:Date}
        }
});

// Training: Instantiation of User as a mongoose instance
var Book = module.exports = mongoose.model('Book', BookSchema);


// Training: Fetch all Classes
module.exports.getBooks = function(callback, limit) {
	Book.find(callback).limit(limit);
}

// fetch Single Class
module.exports.getBookById = function(id, callback){
	Book.findById(id,callback);
}
