var mongoose = require('mongoose');
// already in app: following not required here?
//mongoose.connect('mongodb://localhost/elearn');
//var db = mongoose.connection;

// Student Schema
var StudentSchema = mongoose.Schema({
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
// HERE is where the VARIABLE-OBJECT IS INITIALIZED FOR THE FIRST TIME (var ....) !!!
var Student = module.exports = mongoose.model('Student', StudentSchema);

// fetch Single Student method
module.exports.getStudentByUsername = function(username, callback){
	var query = {username: username};
	Student.findOne(query,callback);
}

// fetch Single Student method
module.exports.register = function(info, callback){
    student_username = info['student_username'];
    class_id = info['class_id'];
    class_title = info['class_title'];
    console.log('class_id '+class_id) //<--- fucking punto y coma men...??
    var query = {username:student_username};
    Student.findOneAndUpdate(
	query,
	{$push:{"classes":{class_id:class_id, class_title:class_title}}},
	{safe:true, upsert:true},
	callback
    );
}