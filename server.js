var mongoose = require('mongoose');
var mongodb = require('mongodb');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var port = process.env.PORT || 8080;

var db = 'mongodb://anujit:anujit123@ds021299.mlab.com:21299/play-fit';
var url = db;
/////////////////////////////////////


var MongoClient = mongodb.MongoClient;
var assert = require('assert');
var ObjectId = mongodb.ObjectID;

/////////////////////////////////////

var db_obj;

MongoClient.connect(url,function(err,db){
	assert.equal(null,err);
	console.log('connected to '+url);
	db_obj = db;
	//console.log('collection does not exist ', db.collection('anujit'));

	// var c = getNextSequence('activity_id',db);

	// console.log(c);
	//console.log(counters);
	//db.collection('test').insert({a:'hello',b:'asas'});
});

var mongoose_connection = mongoose.connect(url);

function getNextSequence(name,cb){

	var counters = db_obj.collection('counters');

	var doc_len = 0;

	var doc = counters.find({_id:name}).toArray().then(function(docs){

		doc_len = docs.length;
		if(!doc_len){
			counters.insert({
				_id : name,
				seq : 0
			});
		}

		console.log('incrementing counter');
		var ret = counters.findAndModify({_id:name},[],{$inc: { seq: 1 } },{new: true},function(err,doc){
			console.log('new counter value ',doc.value.seq);
			//return doc.value.seq;
			cb(doc.value.seq);
		});
	});


}

// mongoose.connect(db, function() {
  // console.log('connected to db..');
	// db.collection('test').insert({a:'aa',b:'hello'});
// });

// var Schema = mongoose.Schema;
//
// var activitySchema = new Schema({
//   activity_id: Number,
// 	athlete_id:Number,
//   name: String,
//   distance: Number,
//   elapsed_time: Number,
//   type: String,
//   start_date: Date,
//   like_count: Number,
//   comment_count: Number,
//   photo_count: Number,
//   workout_type: Number
// });
//
// var Activity = mongoose_connection.model('Activity', activitySchema);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(express.static('public'));



var router = express.Router();





//get athlete
router.route('/athlete/:id').get(function(req,res){
  console.log('getting athlete ', req.params);
	var athletes = db_obj.collection('athletes');
	var athlete_id = parseInt(req.params.id);

	athletes.find({athlete_id:athlete_id}).toArray(function(err,docs){
		console.log(docs);
		var athlete = docs[0];
		res.json(athlete);
	});
});

// get all activities for a user
router.route('/athlete/:id/activities').get(function(req,res){
  console.log('getting activities for athlete_id ', req.params.id);
	var activities_coll = db_obj.collection('activities');

	activities_coll.find({athlete_id:parseInt(req.params.id,10)}).toArray(function(err,docs){
		console.log('inside cb');
		//if(err) console.log(err);
		console.log(docs);
		res.json(docs);
	});
});

//create new activity..
router.route('/athlete/:id/activities').post(function(req, res) {
  console.log(req.body);
  var data = req.body;
  console.log("body :", typeof data);
	var athlete_id = req.params.id;
	getNextSequence('activity_id',function(seq){
	  var dataParams = {
			athlete_id:data.athlete_id,
			activity_id: seq,
			name: data.name,
			distance: data.distance,
			elapsed_time: data.elapsed_time,
			type: data.type,
			start_date: data.start_date,
			like_count: data.like_count,
			comment_count: data.comment_count,
			photo_count: data.photo_count,
			workout_type: data.workout_type
	  };

		var activity_coll = db_obj.collection('activities');

		activity_coll.insert(dataParams,null,function(err,docs){
			console.log(docs);
			if (err) res.send(err);

			res.json({
			  message: 'Activity created successfully..',
			  id: seq
			});
		});

	  //console.log("data params : ", dataParams);
	//  var activity = new Activity(dataParams);
		//console.log('saving data',activity);
	  // activity.save(function(err, response) {
		// 	console.log("save respose", response);
		//
		// });
	});
});

//get all activities for the user plus his friends - this is essentially the activity feed for the user
router.route('/athlete/:id/friends/activities').get(function(req,res){
  console.log('getting friends activities');

});

// get a list of the user's friends
router.route('/athlete/:id/friends').get(function(req,res){
  console.log('athlete\'s friends')
});

// login and verification
router.route('/login').post(function(req,res){
	var data = req.body;

	if(!data) res.json({"message":"No data received"});
	//return;

	if(!data.user_name) res.json({"message":"user_name not present"});
	//return;

	var user_name = data.user_name;

	console.log('finding the doc..')
	var athletes = db_obj.collection('athletes');

	athletes.find({user_name:user_name}).limit(1).toArray(function(err,docs){

		// if no user is found, register the user..
		if(docs.length == 0){
			console.log('Registering new user');

			getNextSequence('user_name',function(seq){
				var dataObj = {
					athlete_id:seq,
					user_name : user_name,
					firstname : data.firstname,
					lastname : data.lastname,
					profile_medium : data.profile_medium,
					profile : data.profile,
					city : data.city,
					state : data.state,
					country : data.country,
					sex : data.sex,
					email : data.email
				}
				athletes.insert(dataObj,null,function(err,doc){
					res.json({message:user_name+" registered successfully",athlete_id:seq});
				});
			});
		} else {
			console.log('athlete present');
			console.log(docs);
			res.json({message:"athlete already present",athlete_id:docs[0].athlete_id});
		}

	});

});

//record a new relationship..
router.route('/graph').post(function(req,res){

});

app.use('/api', router);

app.listen(port);

console.log('Server started on port ' + port);
