var mongoose = require('mongoose');
// already in app: following not required here?
//mongoose.connect('mongodb://localhost/elearn');
//var db = mongoose.connection;

// Student Schema
var InstructorSchema = mongoose.Schema({
	first_name: {
		type: String
	},
	last_name: {
		type: String
        },
        address: [{
		street_address:{type:String},
		city:{type:String},
		state:{type:String},
		zip:{type:String}
	}],
	username: {
		type: String
	},
	email:{
		type: String
	},
        classes:[{
            class_id:{
                type:[mongoose.Schema.Types.ObjectId]
            },
            class_title:{
                type: String
            }
        }]
});

// Training: Instantiation of User as a mongoose instance
var Instructor = module.exports = mongoose.model('Instructor', InstructorSchema);

// fetch Single Student method
module.exports.getInstructorByUsername = function(username, callback){
	var query = {username: username};
	Instructor.findOne(query,callback);
}

// fetch Single Student method
module.exports.register = function(info, callback){
    instructor_username = info['instructor_username'];
    class_id = info['class_id'];
    class_title = info['class_title'];
    console.log('class_id '+class_id) //<--- fucking punto y coma men...??
    var query = {username:instructor_username};
    Instructor.findOneAndUpdate(
	query,
	{$push:{"classes":{class_id:class_id, class_title:class_title}}},
	{safe:true, upsert:true},
	callback
    );
}