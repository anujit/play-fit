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

app.use(function(req, res, next) {
  console.log(req.method);
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  // if(req.method.toUpperCase() == 'OPTIONS'){
  //     // res.writeHead(
  //     //     "204",
  //     //     "No Content"
  //     // );

  //     // // End the response - we're not sending back any content.
  //     // return( res.end() );
  // } else {
   
  // }

  next();
});

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

	activities_coll.find({athlete_id:req.params.id).toArray(function(err,docs){
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

    dataParams = {
  "id": 321934,
  "resource_state": 3,
  "external_id": "2012-12-12_21-40-32-80-29011.fit",
  "upload_id": 361720,
  "athlete": {
    "id": 7,
    "resource_state": 1
  },
  "athlete_id":7,
  "name": "Evening Ride",
  "description": "the best ride ever",
  "distance": 4475.4,
  "moving_time": 1303,
  "elapsed_time": 1333,
  "total_elevation_gain": 154.5,
  "elev_high": 331.4,
  "elev_low": 276.1,
  "type": "Run",
  "start_date": "2012-12-13T03:43:19Z",
  "start_date_local": "2012-12-12T19:43:19Z",
  "timezone": "(GMT-08:00) America/Los_Angeles",
  "start_latlng": [
    37.8,
    -122.27
  ],
  "end_latlng": [
    37.8,
    -122.27
  ],
  "achievement_count": 6,
  "kudos_count": 1,
  "comment_count": 1,
  "athlete_count": 1,
  "photo_count": 0,
  "total_photo_count": 0,
  "photos": {
    "count": 2,
    "primary": {
      "id": null,
      "source": 1,
      "unique_id": "d64643ec9205",
      "urls": {
        "100": "http://pics.com/28b9d28f-128x71.jpg",
        "600": "http://pics.com/28b9d28f-768x431.jpg"
      }
    }
  },
  "map": {
    "id": "a32193479",
    "polyline": "kiteFpCBCD]",
    "summary_polyline": "{cteFjcaBkCx@gEz@",
    "resource_state": 3
  },
  "trainer": false,
  "commute": false,
  "manual": false,
  "private": false,
  "flagged": false,
  "workout_type": 2,
  "gear": {
    "id": "g138727",
    "primary": true,
    "name": "Nike Air",
    "distance": 88983.1,
    "resource_state": 2
  },
  "average_speed": 3.4,
  "max_speed": 4.514,
  "calories": 390.5,
  "has_kudoed": false,
  "segment_efforts": [
    {
      "id": 543755075,
      "resource_state": 2,
      "name": "Dash for the Ferry",
      "segment": {
        "id": 2417854,
        "resource_state": 2,
        "name": "Dash for the Ferry",
        "activity_type": "Run",
        "distance": 1055.11,
        "average_grade": -0.1,
        "maximum_grade": 2.7,
        "elevation_high": 4.7,
        "elevation_low": 2.7,
        "start_latlng": [
          37.7905785,
          -122.27015622
        ],
        "end_latlng": [
          37.79536649,
          -122.2796434
        ],
        "climb_category": 0,
        "city": "Oakland",
        "state": "CA",
        "country": "United States",
        "private": false
      },
      "activity": {
        "id": 32193479,
        "resource_state": 1
      },
      "athlete": {
        "id": 3776,
        "resource_state": 1
      },
      "kom_rank": 2,
      "pr_rank": 1,
      "elapsed_time": 304,
      "moving_time": 304,
      "start_date": "2012-12-13T03:48:14Z",
      "start_date_local": "2012-12-12T19:48:14Z",
      "distance": 1052.33,
      "start_index": 5348,
      "end_index": 6485,
      "hidden": false,
      "achievements": [
        {
          "type_id": 2,
          "type": "overall",
          "rank": 2
        },
        {
          "type_id": 3,
          "type": "pr",
          "rank": 1
        }
      ]
    }
  ],
  "splits_metric": [
    {
      "distance": 1002.5,
      "elapsed_time": 276,
      "elevation_difference": 0,
      "moving_time": 276,
      "split": 1
    },
    {
      "distance": 475.7,
      "elapsed_time": 139,
      "elevation_difference": 0,
      "moving_time": 139,
      "split": 5
    }
  ],
  "splits_standard": [
    {
      "distance": 1255.9,
      "elapsed_time": 382,
      "elevation_difference": 3.2,
      "moving_time": 382,
      "split": 3
    }
  ],
  "best_efforts": [
    {
      "id": 273063933,
      "resource_state": 2,
      "name": "400m",
      "segment": null,
      "activity": {
        "id": 32193479
      },
      "athlete": {
        "id": 3776
      },
      "kom_rank": null,
      "pr_rank": null,
      "elapsed_time": 105,
      "moving_time": 106,
      "start_date": "2012-12-13T03:43:19Z",
      "start_date_local": "2012-12-12T19:43:19Z",
      "distance": 400,
      "achievements": [

      ]
    },
    {
      "id": 273063935,
      "resource_state": 2,
      "name": "1/2 mile",
      "segment": null,
      "activity": {
        "id": 32193479
      },
      "athlete": {
        "id": 3776
      },
      "kom_rank": null,
      "pr_rank": null,
      "elapsed_time": 219,
      "moving_time": 220,
      "start_date": "2012-12-13T03:43:19Z",
      "start_date_local": "2012-12-12T19:43:19Z",
      "distance": 805,
      "achievements": [

      ]
    }
  ]
};



		var dataParams = {
      id : seq,
      activity_id : seq,
      athlete : {
        id : data.athlete_id
      },
      athlete_id : data.athlete_id,
      name : data.name,
      description : data.description,
      distance : data.distance,
      moving_time : data.moving_time,
      elapsed_time : data.elapsed_time,
      total_elevation_gain : data.total_elevation_gain,
      elev_high : data.elev_high,
      elev_low : data.elev_low,
      type : data.type,
      start_date : data.start_date,
      start_date_local : data.start_date_local,
      timezone : data.timezone,
      start_latlng : data.start_latlng,
      end_latlng : data.end_latlng
    };

		var activity_coll = db_obj.collection('activities');
		console.log('inserting in activities collection');
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

router.route('/athletes').get(function(req,res){
	var athletes_coll = db_obj.collection('athletes');
	athletes_coll.find().toArray(function(err,docs){
		res.json(docs);
	});
});

router.route('/athletes/:user_name').put(function(req,res){
	var athletes_coll = db_obj.collection('athletes');
	athletes_coll.find({user_name : req.params.user_name}).toArray(function(err,docs){
		
		if(err) res.send(err);
		
		console.log(docs);
	});	
});

router.route('/challenges/ride').get(function(req,res){
	var ride_challenges = db_obj.collection('ride_challenges');
	
	ride_challenges.find().toArray(function(err,docs){
		res.json(docs);
	});
})
.post(function(req,res){
	var data = req.body;
	
	var ride_challenges = db_obj.collection('ride_challenges');
	
  getNextSequence('challenge_id',function(challenge_id){
    var dataObj = {
      name : data.name,
      challenge_id : challenge_id,
      challenge_type : data.challenge_type,
      start_date : new Date(data.start_date),
      end_date : new Date(data.end_date),
      description : data.description,
      additional_info: data.additional_info,
      rules: data.rules,
      prize_distance: data.prize_distance,
      is_user_created:data.is_user_created == 'true' ? true : false,
      is_active:data.is_active == 'true' ? true : false,
      is_banned:data.is_banned == 'true' ? true : false,
      total_participants : 0
    };
    ride_challenges.insert(dataObj,null,function(err,doc){
      if(err) console.log('error in saving ride challenge');
      res.json({status:1});
    });    
  });	
});

router.route('/challenges/ride/:challenge_id').put(function(req,res){
  db_obj.collection('ride_challenges').updateOne({"challenge_id":parseInt(req.params.challenge_id,10)},{
    $set : req.body
  },function(err,results) {
    if (err) {console.log(err)};

    res.json({status:1});
  });
})
.delete(function(req,res){
  var challenge_id = parseInt(req.params.challenge_id,10);

  db_obj.collection('ride_challenges').deleteOne({
    "challenge_id" : parseInt(req.params.challenge_id,10)
  },function (err,results) {
    if(err) console.log(err);
    res.json({status:1});
  });

});

router.route('/challenges/run').get(function(req,res){
	var run_challenges = db_obj.collection('run_challenges');
	
	run_challenges.find().toArray(function(err,docs){
		res.json(docs);
	});	
})
.post(function(req,res){
	var data = req.body;
	
	var run_challenges = db_obj.collection('run_challenges');
	
  getNextSequence('challenge_id',function(challenge_id){
    var dataObj = {
      name : data.name,
      challenge_id : challenge_id,
      challenge_type : data.challenge_type,
      start_date : new Date(data.start_date),
      end_date : new Date(data.end_date),
      description : data.description,
      additional_info: data.additional_info,
      rules: data.rules,
      prize_distance: data.prize_distance,
      is_user_created:data.is_user_created == 'true' ? true : false,
      is_active:data.is_active == 'true' ? true : false,
      is_banned:data.is_banned == 'true' ? true : false,
      total_participants : 0
    };
    run_challenges.insert(dataObj,null,function(err,doc){
      if(err) console.log('error in saving run challenge');
      res.json({status:1});
    });    
  }); 
});

router.route('/challenges/run/:challenge_id').put(function(req,res){
  db_obj.collection('run_challenges').updateOne({"challenge_id":parseInt(req.params.challenge_id,10)},{
    $set : req.body
  },function(err,results) {
    if (err) {console.log(err)};

    res.json({status:1});
  });
})
.delete(function(req,res){
  var challenge_id = parseInt(req.params.challenge_id,10);

  db_obj.collection('run_challenges').deleteOne({
    "challenge_id" : parseInt(req.params.challenge_id,10)
  },function (err,results) {
    if(err) console.log(err);
    res.json({status:1});
  });
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
					user_name : data.user_name,
          password : data.password || '',
					firstname : data.firstname,
					lastname : data.lastname,
					profile_medium : data.profile_medium,
					profile : data.profile,
					city : data.city,
					state : data.state,
					country : data.country,
					sex : data.sex,
					email : data.email,
					is_premium : data.is_premium || false,
					is_blocked : data.is_blocked || false
				}
				athletes.insert(dataObj,null,function(err,doc){
					res.json({message:user_name+" registered successfully",athlete_id:seq});
				});
			});
		} else {
			console.log('athlete present');
			console.log(docs);


      // check password..
      var password = docs[0].password;

      if(password){
        if(password === data.password) res.json({message:'Valid user credentials',status:1,athlete_id:docs[0].athlete_id});
        else res.json({message:'Invalid user credentials',status:0,athlete_id:docs[0].athlete_id});
      } else {
        res.json({message:"Athlete already present",athlete_id:docs[0].athlete_id});        
      }

		}

	});

});

//record a new relationship..
router.route('/graph').post(function(req,res){
	var followers_coll = db_obj.collection('followers');
	var following_coll = db_obj.collection('following');

	var data = req.body;

	if(!data || !data.athlete_id || !data.following_athlete_id){
		res.json({message:"Need athlete id and followers id to insert"});
		return;
	}

	var followers_obj = {
		_f : data.athlete_id,
		_t : data.following_athlete_id
	};

	var following_obj = {
		_f : data.following_athlete_id,
		_t : data.athlete_id
	};

	followers_coll.insert(followers_obj,null,function(err,docs){
		if(err){
			throw err;
			res.json({message:"Error in inserting into followers collection"});
		}
		//res.json({message:"Successfully inserted into followers collection",status:1});
		following_coll.insert(following_obj,null,function(err,docs){
			if(err){
				throw err;
				res.json({message:"Error in inserting into following collection"});
			}
			res.json({message:"Successfully inserted into followers and following collections",status:1});
		});
	});
});

app.use('/api', router);

app.listen(port);

console.log('Server started on port ' + port);
