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

var Schema = mongoose.Schema;

var activitySchema = new Schema({
  activity_id: Number,
  athlete: {
    id: Number
  },
  name: String,
  distance: Number,
  elapsed_time: Number,
  type: String,
  start_date: Date,
  like_count: Number,
  comment_count: Number,
  photo_count: Number,
  workout_type: Number
});

var Activity = mongoose_connection.model('Activity', activitySchema);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(express.static('public'));



var router = express.Router();

app.use('/api', router);

// get all activities..
router.route('/activities').get(function(req, res) {
  Activity.find({}, function(err, activities) {
    if (err) throw err;
    console.log(activities);
    res.json(activities);
  });
});

//create new issue..
router.route('/activities').post(function(req, res) {
  console.log(req.body);
  var data = req.body;
  console.log("body :", typeof data);

	getNextSequence('activity_id',function(seq){
	  var dataParams = {
		activity_id: seq,
		athlete: data.athlete,
		name: data.name,
		distance: data.distance,
		elapsed_time: data.elapsed_time,
		type: data.type,
		start_date: data.start_date,
		like_count: data.like_count,
		comment_count: data.comment_count,
		photo_count: data.photo_count,
		workout_type: data.workout_type
	  }

	  console.log("data params : ", dataParams);
	  var activity = new Activity(dataParams);
		console.log('saving data',activity);
	  activity.save(function(err, response) {
		console.log("save respose", response);
		if (err) res.send(err);

		res.json({
		  message: 'Activity created successfully..',
		  id: id_count
		})
	  });
	});
});

//get athlete
router.route('/athlete/:id').get(function(req,res){
  console.log('getting athlete ', req.params);
	var users = db_obj.collection('users');

});

//post athlete
router.route('/athlete/:id').post(function(req,res){


	var users = db_obj.collection('users');

	users.find({athlete_id : req.params.id},function(err,cursor){
		var len = cursor.toArray().length;

		if(len){
			//if athlete present, send a msg saying athlete already present and return his athlete_id..
		} else {
			// else register the new athlete and return his athlete_id..
		}

	});




});


router.route('/athlete/:id/activities').get(function(req,res){
  console.log('getting activities ', req.params);
});

router.route('/athlete/:id/friends/activities').get(function(req,res){
  console.log('getting friends activities');
});

router.route('/athlete/:id/friends').get(function(req,res){
  console.log('athlete\'s friends')
});

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
				athletes.insert({user_name:user_name,athlete_id:seq},null,function(err,doc){
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

app.listen(port);

console.log('Server started on port ' + port);
