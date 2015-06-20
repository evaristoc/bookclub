var mongoose = require('mongoose');
var async = require('async');
//var bcrypt = require('bcryptjs');

//mongoose.connect('mongodb://localhost/elearn');
//var db = mongoose.connection;

// User Schema
var BookSchema = mongoose.Schema({
	_owner:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
	title:String,
	authors:[String],
	edition:String,
	remarks:String,
	entered:{type:Date, default:Date.now},
	status:{
		current:String,
		_shared:String,
        date:Date
        }
});

// Training: Instantiation of User as a mongoose instance
//var Book = module.exports = mongoose.model('Book', BookSchema);
var Book = module.exports = mongoose.model('books', BookSchema);
//http://justinklemm.com/node-js-async-tutorial/
// method create (save): incomplete - it will be finished in the users.js
//http://stackoverflow.com/questions/17712973/one-to-many-mapping-in-mongoose-how-to-receive-and-process
//http://blog.mongodb.org/post/52299826008/the-mean-stack-mistakes-youre-probably-making
//http://mongoosejs.com/docs/populate.html
//try async.series([newBook.save(), user_func(newBook)], callback(err, results));
//and do a console.log on the results in .createBook
//that will give you an idea of how async.series calls your final callback 
//module.exports.createBook = function(newBook, user_inst, user_class){
//	user_func = function(book){
//		user_class.getUserById(user_inst._id,function(err, user){
//			user._mybooks.push(book.title);
//			user.save();
//		});
//	};
//	async.series([newBook.save(), user_func(newBook)], function(err){
//		console.log("done with saving");
//	});
//};

//module.exports.createBook = function(newBook, user_inst, user_class){
//	async.series([
//		function(callback){
//			return newBook.save();
//			//newBook.save(function(err, result) {
//			//if (err) {
//			//	return callback(err);
//			//}
//			//console.log(result.length);
//			//return callback(null, result);
//			//});
//		},
//		function(book, callback) {
//			console.log(book.length);
//			user_class.getUserById(user_inst._id,function(err, user){
//				if (err) {
//					callback(err);
//				};
//				user._mybooks.push(book.title);
//				user.save(function(err, result) {
//					if (err) {
//						callback(err);
//					}
//					callback(null, result);
//				});
//			});
//		}],
//		function(err, results) {
//			if (err) {
//				return console.error('there was an error');
//			}
//			console.log('done with saving');
//		}
//	);
//}


//module.exports.createBook = function(newBook, user_inst, user_class, callback){
//	newBook.save(function(book){
//		user_class.getUserById(user_inst._id,function(user){
//			user._mybooks.push(book._id);
//			user.save(callback);
//		});
//	});
//};
module.exports.createBook = function(newBook, user_inst, user_class, callback) {
	console.log('inside the createBook, level 1');
//	bid_inuser_save = function(book){
//		user_class.getUserById(user_inst._id, function(err, user){
//          console.log('user in async for new book creation ');
//		  console.log(book);
//		  err = NaN;
//          if (err) {
//            console.log(err);
//            res.send(err);
//          } else {
//			//while (newBook){
//				console.log(user._mybooks);
//				//user._mybooks.push(book._id);
//				//console.log(user._mybooks);
//				//user.save();
//				//callback();
//			//};
//		  };
//		});
//	};
//http://stackoverflow.com/questions/29922670/cant-set-headers-after-there-sent-but
//https://stackoverflow.com/questions/7042340/node-js-error-cant-set-headers-after-they-are-sent
	bid_inuser_save = function(book, us, callback){
        console.log('user in async for new book creation ');
		console.log(book);
		us._mybooks.push(book._id);
		us.save();
		callback();
////		err = NaN;
////        if (err) {
////          console.log(err);
////          res.send(err);
////        } else {
////		//while (newBook){
////			console.log(user._mybooks);
//			//user._mybooks.push(book._id);
//			//console.log(user._mybooks);
//			//user.save();
//			//callback();
//		//};
//		//};
	};		
//	//newBook.save(callback);
//	//var callback = function(){console.log('async callback');};
	user_class.getUserById(user_inst._id, function(err,user){
		//async.series([console.log('something'), bid_inuser_save('hello in_funct')], function(err){console.log('async callback');});
		console.log('before async..');
		console.log(user);
		async.series([newBook.save(), bid_inuser_save(newBook, user, callback)], callback);
	});
//	//async.series([newBook.save, bid_inuser_save(newBook)],callback);
//	//async.parallel([newBook.save, console.log(newBook)],callback);
	//bid_inuser_save = function(book, callback){
	//	user_class.getUserById(user_inst._id, function(user){
	//		user._mybooks.push(book);
	//		user.save(callback());
	//	})
	//};		
	//
	//async.series([newBook.save, bid_inuser_save(newBook, callback)],callback);

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
