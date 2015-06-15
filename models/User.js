module.exports = function(mongoose){
	
	// already in app: following not required here?
	mongoose.connect('mongodb://localhost/bookclub');
	//var db = mongoose.connection;
	// E: setting the signup method in user model
	// User Schema
	var UserSchema = mongoose.Schema({
		name: {
			type: String
		},
		username: {
			type: String
		},
		email:{
			type: String
		},
		password: {
			type:String,
			bcrypt:true
		},
		registration_date: {
			type:Date	
		}
	});
	// Training: Instantiation of User as a mongoose instance
	var User = mongoose.model('users', UserSchema);
	var bcrypt = require('bcryptjs');
	User.saveUser = function(newUser, callback) {
		bcrypt.hash(newUser.password, 10, function(err, hash){
			//if(err) throw err;
			if(err) throw err;
			// Set hashed pw
			newUser.password = hash;
			console.log('User being saved');
		});
	}
	
	//
	//
	//
	//// fetch Single User
	//module.exports.getUserById = function(id, callback){
	//	User.findById(id,callback);
	//}
	//
	//// fetch Single User
	//module.exports.getUserByUsername = function(username, callback){
	//	var query = {username: username};
	//	User.findOne(query,callback);
	//}
	//
	////E: Student and Instructor require different forms because they go to different collections
	//// E: Student saving
	//
	//
	//// **
	//
	//// Training: login user "method" with passport
	//module.exports.comparePassword = function(candidatePassword, hash, callback){
	//	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
	//		if(err) throw err;
	//		callback(null, isMatch);
	//	});
	//}
}