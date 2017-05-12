var express = require('express');
var router = express.Router();
var connectionString = 'mongodb://localhost:27017/ldt';
var Event = require('../models/event-model');
var User = require ('../models/event-model');
var mongoose = require ('mongoose');
var nodemailer = require('nodemailer');
// var dotenv = require('dotenv');


////////////////////////////////////////
/*      GET Routes                   */
///////////////////////////////////////



//get the basic details for the event
router.get('/data', function(req, res) {
  // console.log('req.query for GET event/:id is: ',req.query);
  //you have to do some mojo to make eventId a value that Mongo can work with
  eventId = require('mongodb').ObjectID(req.query.eventId);
  // console.log('Attempting to run db query for Event data');
  Event.aggregate([
   {
       $match: { _id: eventId }
   },
   {
       $project:
       {
           _id: 1,
           eventName: 1,
           date: 1,
           time: 1,
           location: 1
       }
   }
], function(err,result) {
    if (err) {
      console.log('There was an error in the event query', err);
      res.sendStatus(500);
    } else {
      // console.log('This is the event we are sending for the /event:id route:',result);
      res.send(result)
    }
  });
}); // end router.get(/event:id)








// get the organizers for the event
router.get('/organizers/', function(req, res) {
  console.log('req.query for GET event/organizers is: ',req.query);
  //you have to do some mojo to make eventId a value that Mongo can work with
  eventId = require('mongodb').ObjectID(req.query.eventId);
  // console.log('Attempting to run db query for Event data');
  Event.aggregate([
   {
       $match: { _id: eventId }
   },
   {
       $lookup:
         {
            from: "users",
            localField: "organizer",
            foreignField: "email",
            as: "organizer_data"
         }
     }], function(err,result) {
    if (err) {
      console.log('There was an error in the event query', err);
      res.sendStatus(500);
    } else {
      console.log('This is the event we are sending for the /event/organizers route:',result);
      res.send(result)
    }
  });
}); // end router.get for /event/organizers







// get the attendees for the event
router.get('/attendees/', function(req, res) {
  console.log('req.query for GET event/attendees is: ',req.query);
  //you have to do some mojo to make eventId a value that Mongo can work with
  eventId = require('mongodb').ObjectID(req.query.eventId);
  // console.log('Attempting to run db query for Event data');
  Event.aggregate([
    {
        $match:
            {_id: eventId}
    },
    {
        $unwind: "$attendees"

    },
    {
        $lookup:
        {
            from: "users",
            localField: "attendees",
            foreignField: "email",
            as: "attendee_data"
        }
    },
    {
        $unwind: "$attendee_data"
    },
    {
    $project:
          {
              "_id" : 0,
              "attendeeFirstName" : "$attendee_data.firstName",
              "attendeeLastName" : "$attendee_data.lastName",
              "attendeeEmail" : "$attendee_data.email"
          }
     }
], function(err,result) {
    if (err) {
      console.log('There was an error in the event query', err);
      res.sendStatus(500);
    } else {
      console.log('This is the event we are sending for the /event/attendees route:',result);
      res.send(result)
    }
  });
}); // end router.get for /event/organizers



// get the things that are already claimed by someone
router.get('/things/:id', function(req, res) {
    // console.log('req.query for GET /event/things/:id is: ', req.query);
    eventId = require('mongodb').ObjectID(req.query.eventId);
    // console.log('Attempting to run db query for Event data');
    Event.aggregate([{
       $match : { _id : eventId }
   },
   {
       $unwind: "$things_needed"
   },
   {
       $lookup:
       {
           "localField" : "things_needed.claimedBy",
           "from" : "users",
           "foreignField" : "email",
           "as" : "things_claimers"
       }
   },
   {
       $unwind: "$things_claimers"
   },
   {
       $project:
       {
           "_id" : 0,
           "name" : "$things_needed.name",
           "claimerFirstName" : "$things_claimers.firstName",
           "claimerLastName" : "$things_claimers.lastName",
           "claimerEmail" : "$things_claimers.email"
       }
   }], function(err, result) {
        if (err) {
            console.log('There was an error running the query to get things for this event');
            res.sendStatus(500);
        } else {
            // console.log('the data we will send for the /event/things:id GET is: ', result);
            res.send(result);
        }
    }); // end Event.aggregate Mongoose function
}) //end router.get for /things/:id

// get the things that are left to be claimed
router.get('/unclaimedThings/:id', function(req, res) {
  // console.log('req.query for GET /event/unclaimedThings/:id is: ', req.query);
  eventId = require('mongodb').ObjectID(req.query.eventId);
  Event.aggregate([{
    $match: {
      _id: eventId
    }
  },
  {
    $unwind: "$things_needed"
  },
  {
    $match: {
      "things_needed.claimedBy": ""
    }
  }
], function(err, result) {
  if (err) {
    console.log('There was an error running the query to get things for this event');
    res.sendStatus(500);
  } else {
    // console.log('the data we will send for the /event/getUnclaimedThingsForEvent/:id GET is: ', result);
    res.send(result);
  }
}); // end Event.aggregate Mongoose function
}) //end router.get for /things/:id

///////////////////////////////////////
/*             PUT ROUTES            */
///////////////////////////////////////


// PUT request to update the things_needed when a user "claims" a things

router.put('/claim/', function(req,res) {
  console.log('PUT /claimThing/ has been hit on the server.  This is the req.query data: ',req.query);
  var eventId = require('mongodb').ObjectID(req.query.eventId);
  var thing = req.query.thing;
  var claimer = req.query.claimer;
  Event.update(
      {_id: eventId, "things_needed.name" : thing },
      { $set : { "things_needed.$.claimedBy" : claimer  }
    }, function(err, result) {
      if (err) {
        console.log('There was an error running the query to update the claimed things');
        res.sendStatus(500);
      } else {
        console.log('Success updating the calimed things');
        res.send(200);
      }
    }); // end Event.aggregate Mongoose function
})//end router.put

router.put('/unclaim/', function(req,res) {
  console.log('PUT /unclaimThing/ has been hit on the server.  This is the req.query data: ',req.query);
  var eventId = require('mongodb').ObjectID(req.query.eventId);
  var thing = req.query.thing;
  Event.update(
      {_id: eventId, "things_needed.name" : thing },
      { $set : { "things_needed.$.claimedBy" : ""  }
    }, function(err, result) {
      if (err) {
        console.log('There was an error running the query to update the claimed things');
        res.sendStatus(500);
      } else {
        console.log('Success updating the claimed things');

        res.send(200);
      }
    }); // end Event.aggregate Mongoose function
})//end router.put

router.put('/addThing/', function(req,res){
  console.log('PUT /addThing/ has been hit on the server.  This is the req.query data: ',req.query);
  var eventId = require('mongodb').ObjectID(req.query.eventId);
  var thing = req.query.thing;
  Event.update(
  { _id: eventId },
  {
    $push: {
      things_needed: {
         name: thing,
         claimedBy: ""
       }
    }
  }, function(err, result) {
      if (err) {
        console.log('There was an error running the addThings');
        res.sendStatus(500);
      } else {
        console.log('Success updating the claimed things');
        res.sendStatus(200);
      }

    }); // end Event.aggregate Mongoose function
})//end router.put

// invite attendees
router.put('/invite/', function(req, res) {
  console.log('PUT /invite/ has been hit on the server.  This is the req.body is data: ', req.body);
  var eventId = require('mongodb').ObjectID(req.body.eventId);
  var attendee = req.body.email;
  var attendeeFirstName = req.body.firstName
  var eventUrl = req.body.eventUrl
  var link = "https://lets-do-this.herokuapp.com/#!/login"
  var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: process.env.NM_ACCOUNT, // Your email id
          pass: process.env.NM_PASSWORD // Your password
      }
  });
  var mailOptions = {
    from: process.env.NM_ACCOUNT, //make this the event organizer
    to: attendee,
    subject: 'Lets Do This!',
    html: '<p>Hi ' + attendeeFirstName + ' you are invited to an event! Head to ' + link + ' and sign up to bring some stuff!'
};
  Event.update({
    _id: eventId
    },
    {
    $push:
      {
        attendees: attendee
      }
    },function(err, result) {
    if (err) {
      console.log('There was an error inviting the user',err);
      res.sendStatus(500);
    } else {
      console.log('Success updating the attendees array. Notifying the user');
      transporter.sendMail(mailOptions, function(error, info){
          if(error){
              console.log(error);
              res.json({yo: 'error'});
          }else{
              console.log('Message sent: ' + info.response);
              res.json({yo: info.response});
          };
      });
      console.log('and we are done here');
    }
  })
});
 // end Event.aggregate Mongoose function




















///////////////////////////////////////
/*             POST ROUTES            */
///////////////////////////////////////

router.post('/addEvent/', function(req,res){
  console.log('/addEvent/ hit...req.query is: ', req.query);
  var newEventObject = req.query;
  var userEmail = req.decodedToken.email
  if(newEventObject.things_needed.length > 0) {
    console.log('unpacking the list of things_needed');
    var thingsNeededforInsert = [];
    for (var i = 0; i < newEventObject.things_needed.length; i++) {
      var thingObject = {}
      thingObject.name = newEventObject.things_needed[i];
      thingObject.claimedBy = "";
      thingsNeededforInsert.push(thingObject);
    } // end for loop that starts on 252
  } else {
    console.log('no need to unpack an arary of items');
  }
  var addedEvent = new Event({
    eventName: newEventObject.eventName,
    date: newEventObject.date,
    time: newEventObject.time,
    location: newEventObject.location,
    organizer: userEmail,
    attendees: userEmail,
    things_needed: thingsNeededforInsert
  });
  User.findOne({
    email: userEmail
  }, function(err, user) {
    if (err) {
      console.log('There was an error querying the user', err);
      res.sendStatus(500);
    } else {
      if (err) {
        console.log('error of some kind');
        res.sendStatus(500);
      } else {
        // Now we run the DB insert statement
        addedEvent.save(function(err, result) {
          if (err) {
            console.log('There was an error running the INSERT to add a new event');
            res.sendStatus(500);
          } else {
            console.log('Success adding a new event', result);
            var addedEventId = result._id;
            res.send(addedEventId);
          }
        }); // end db INSERT function
      } // end else on 265
    } // end callback on 261
  }); //  end User.findOne on 234
}); // end router.post

////////////////////////////////////////
/*       DELETE Routes               */
///////////////////////////////////////

router.delete('/delete/', function(req, res) {
  // console.log('user-routes get /myEvents route hit');
  var userEmail = req.decodedToken.email;
  var eventId = require('mongodb').ObjectID(req.query.eventId);
  User.findOne({
    email: userEmail
  }, function(err, user) {
    if (err) {
      console.log('There was an error querying the user', err);
      res.sendStatus(500);
    } else {
        Event.deleteOne({
        _id: eventId
      },
      function(err, events) {
        if (err) {
          console.log('error completing myEvents query');
          res.sendStatus(500);
        } else {
          console.log('Event ' + eventId + ' deleted');
          res.sendStatus(200);
        }
      });
    }
  });
}); // end router.get(/myEvents)





module.exports = router;
