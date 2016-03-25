var mongoose = require('mongoose');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var port = process.env.PORT || 8080;

var db = 'mongodb://anujit:anujit123@ds021299.mlab.com:21299/play-fit';

mongoose.connect(db, function() {
  console.log('connected to db..');
});

var Schema = mongoose.Schema;

var activitySchema = new Schema({
  id: Number,
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

var Activity = mongoose.model('Activity', activitySchema);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(express.static('public'));



var router = express.Router();

app.use('/api', router);

// get all issues..
router.route('/activities').get(function(req, res) {
  Activity.find({}, function(err, activities) {
    if (err) throw err;
    console.log(activities);
    res.json(activities);
  });
});

var id_count = 0;

//create new issue..
router.route('/activities').post(function(req, res) {
  console.log(req.body);
  var data = req.body;
  console.log("body :", typeof data);

  var dataParams = {
    id: ++id_count,
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

  activity.save(function(err, response) {
    console.log("save respose", response);
    if (err) res.send(err);

    res.json({
      message: 'Activity created successfully..',
      id: id_count
    })
  })

});

app.listen(port);

console.log('Server started on port ' + port);
