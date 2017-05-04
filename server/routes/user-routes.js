var express = require('express');
// var app = express();
var router = express.Router();
// var admin = require('firebase-admin');
var connectionString = 'mongodb://localhost:27017/ldt';
var User = require ('../models/user-model');
var Event = require('../models/event-model');
var mongoose = require ('mongoose');


router.get('/data', function(req, res) {

  var userEmail = req.decodedToken.email
  User.findOne({
    email: userEmail
  }, function(err, user) {
    if (err) {
      console.log('There was an error querying the user email:', err);
      res.sendStatus(500);
    } else {
      if (err) {
        console.log('error completing secrecy level query');
        res.sendStatus(500);
      } else {
        res.send(user)
      }
    }
  });
});

router.get('/myEvents', function(req, res) {
  // console.log('user-routes get /myEvents route hit');
  var userEmail = req.decodedToken.email;
  User.findOne({
    email: userEmail
  }, function(err, user) {
    if (err) {
      console.log('There was an error querying the user email:', err);
      res.sendStatus(500);
    } else {
      var userId = user._id;
      //get all events for which the user is an attendee
      Event.find({
        attendees: userEmail
      },
      function(err, events) {
        if (err) {
          console.log('error completing myEvents query');
          res.sendStatus(500);
        } else {
          res.send(events)
        }
      });
    }
  });
}); // end router.get(/myEvents)


router.post('/add', function(req,res){
  console.log('/user/add route hit',req.query);
  var newUserObject = req.query
  var userToAdd = new User({
    firstName: newUserObject.firstName,
    lastName: newUserObject.lastName,
    email: newUserObject.email
  });
  console.log('newUserObject is',newUserObject);
  userToAdd.save(function(err, result) {
    if (err) {
      console.log('There was an error running the INSERT to add a new event',err);
      res.sendStatus(500);
    } else {
      console.log('Success adding a new event', result);
      var addedEventId = result._id;
      res.send(addedEventId);
    }
  }); // end db INSERT function
})//end router.post


module.exports = router;
