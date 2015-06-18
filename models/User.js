//function User(mongoose){
	
	// already in app: following not required here?
	var mongoose = require('mongoose');
	//mongoose.connect('mongodb://localhost/bookclub');
	//var db = mongoose.connection;
	// E: setting the signup method in user model
	// User Schema
	var UserSchema = mongoose.Schema({
		name:String,
		username:String,
		email:String,
		password:{
			type:String,
			bcrypt:true
		},
		registration_date:{type:Date, default: Date.now},
		_mybooks: [String]
		//_mybooks: [{type:mongoose.Schema.Types.ObjectId, ref:'Book'}]
	});
	// Training: Instantiation of User as a mongoose instance
	var User = module.exports = mongoose.model('users', UserSchema);
	
	var bcrypt = require('bcryptjs');
	
	// method create (save): incomplete - it will be finished in the users.js
	module.exports.createUser = function(newUser, callback) {
		console.log('inside first level saveUser');
		bcrypt.hash(newUser.password, 10, function(err, hash){
			//if(err) throw err;
			if(err) throw err;
			// Set hashed pw
			newUser.password = hash;
			console.log('User being saved');
			newUser.save(callback);
		});
	}
	
	//
	//
	//
	// fetch Single User
	module.exports.getUserById = function(id, callback){
		User.findById(id,callback);
	}
	
	// fetch Single User
	module.exports.getUserByUsername = function(username, callback){
		var query = {username: username};
		User.findOne(query,callback);
	}
	
	//E: Student and Instructor require different forms because they go to different collections
	// E: Student saving
	
	
	// **
	
	// Training: login user "method" with passport
	module.exports.comparePassword = function(candidatePassword, hash, callback){
		bcrypt.compare(candidatePassword, hash, function(err, isMatch){
			if(err) throw err;
			callback(null, isMatch);
		});
	}
//}
//
//module.exports = new User;