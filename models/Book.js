var mongoose = require('mongoose');
var async = require('async');
//var bcrypt = require('bcryptjs');

//mongoose.connect('mongodb://localhost/elearn');
//var db = mongoose.connection;

// User Schema
var BookSchema = mongoose.Schema({
	owner_id:String,
	title:String,
	authors:[String],
	edition:String,
	remarks:String,
	entered:{type:Date, default:Date.now},
	status:{
		current:String,
		shared_with:String,
        date:Date
        }
});

// Training: Instantiation of User as a mongoose instance
var Book = module.exports = mongoose.model('Book', BookSchema);

//http://justinklemm.com/node-js-async-tutorial/
// method create (save): incomplete - it will be finished in the users.js
//http://stackoverflow.com/questions/17712973/one-to-many-mapping-in-mongoose-how-to-receive-and-process
//http://blog.mongodb.org/post/52299826008/the-mean-stack-mistakes-youre-probably-making
module.exports.createBook = function(newBook, user_inst, user_class, callback) {
	console.log('inside the createBook, level 1');
	bid_inuser_save = function(book){
		user_class.getUserById(user_inst._id, function(err, user){
          console.log('user in async for new book creation ');
		  console.log(book);
		  err = NaN;
          if (err) {
            console.log(err);
            res.send(err);
          } else {
			//while (newBook){
				console.log(user.books);
				user.books.push(book._id);
				console.log(user.books);
				user.save();
			//};
		  };
		});
	};																  
	async.parallel([newBook.save, bid_inuser_save(newBook)],callback);
//	async.parallel([newBook.save, console.log(newBook)],callback);
};


//module.exports.createBook = function(newBook, user_func, callback) {
//	async.parallel([newBook.save, user_func],callback);
//};



// Training: Fetch all Classes
module.exports.getBooks = function(callback, limit) {
	Book.find(callback).limit(limit);
}

// fetch Single Class
module.exports.getBookById = function(id, callback){
	Book.findById(id,callback);
}
