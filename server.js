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
		// var dataParams = {
  //     id : seq,
  //     activity_id : seq,
  //     athlete : {
  //       id : parseInt(data.athlete_id,10),
  //     },
  //     athlete_id : parseInt(data.athlete_id,10),
  //     name : data.name,
  //     description : data.description,
  //     distance : data.distance,
  //     moving_time : data.moving_time,
  //     elapsed_time : data.elapsed_time,
  //     total_elevation_gain : data.total_elevation_gain,
  //     elev_high : data.elev_high,
  //     elev_low : data.elev_low,
  //     type : data.type,
  //     start_date : data.start_date,
  //     start_date_local : data.start_date_local,
  //     timezone : data.timezone,
  //     start_latlng : data.start_latlng,
  //     end_latlng : data.end_latlng
  //   };
  dataParams = data;
  dataParams.id = seq;
  dataParams.activity_id = seq;
  dataParams.athlete_id = parseInt(data.athlete.id,10);

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

// get a list of all users
router.route('/athletes').get(function(req,res){
	var athletes_coll = db_obj.collection('athletes');
	athletes_coll.find().toArray(function(err,docs){
		res.json(docs);
	});
});

// update a user
router.route('/athletes/:user_name').put(function(req,res){
	var athletes_coll = db_obj.collection('athletes');
	athletes_coll.find({user_name : req.params.user_name}).toArray(function(err,docs){
		
		if(err) res.send(err);
		
		console.log(docs);
	});	
});

// read/create ride challenges
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

// update/delete a ride challenge
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

// read/create run challenges
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

// update/delete a run challenge
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

// join challenge..

router.route('/challenges/:challenge_id').post(function (req,res) {
	var data = req.body;
	var dataObj = {};

	dataObj = {
		athlete_id : data.athlete_id,
		firstname : data.firstname,
		lastname : data.lastname,
		challenge_type : data.challenge_type
	};

	var athletes_coll = db_obj.collection('athletes');

  db_obj.collection('athletes').updateOne({"athlete_id":parseInt(data.athlete_id,10)},{
    $push : {joined_challenges:req.params.challenge_id}
  },function(err,results) {
    if (err) {console.log(err)};

    res.json({status:1});
  });	

})
.get(function (req,res) {
	
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
				dataObj.joined_challenges = [];
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
