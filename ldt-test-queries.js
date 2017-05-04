use ldt

db.createCollection('events');
db.createCollection('users');

var users = db.getCollection('users');

users.insert({
    firstName: "Barry",
    lastName: "Blue-jeans",
    email: "barrybluejeans1845@gmail.com",

}
);

users.insert({
    firstName: "Steven",
    lastName: "Singer",
    email: "tacovar012@gmail.com",
    phoneNumber: "",
    events: [],
    organizerFFor: [],
    smsOptIn: false
}
);


users.find({_id:ObjectId("58d036d7f10b24d21fa36c35") });
events.findOne(
    {attendees: ObjectId("58d036d7f10b24d21fa36c35") }
    );
users.find({});

var events = db.getCollection(
'events'
);

events.insert({
    eventName: "Housewarming",
    date: "2017-05-04",
    time: "12:00",
    location: "Steve's new place",
    organizer: ObjectId("58d11ff3f10b24d21fa36c3a"),
    attendees:[],
    things: [ {name:'', claimedBy:''} ]
});

db.events.updateOne(
   { _id: ObjectId("58d036d7f10b24d21fa36c35") },

   {
     $pull: { attendees: "tjohander@gmail.com" }
   }
);

db.collection.update(
   { _id: ObjectId("58d036d7f10b24d21fa36c35") },

   {
     $set: { eventName: "Beach Volleyball Afternoon" }
   }
);

db.events.update(
   {_id: ObjectId("58d036d7f10b24d21fa36c35") },

   {
     $push: { attendees: "tacovar2017@gmail.com" }
   }
);

events.find({});

db.events.find(
   {
       organizer: ObjectId("58d11ff3f10b24d21fa36c3a")
   }
);

db.events.find(
   {
       organizer: ObjectId("58d033a0f10b24d21fa36c33")
   }
   );




db.users.updateMany(
   {},
   { $rename: {"organizerFFor":"organizerFor"} } );


 events.find(
   {
       attendees: "tjohander@gmail.com"
   }
   );

db.events.updateOne(
   { _id: ObjectId("58d036d7f10b24d21fa36c35")},
   {$set: {organizer: {organizerName:, _id: "" } } }
   );





   // the golden copy
   db.events.aggregate([
      {
          $match: {attendees: "tacovar2017@gmail.com"}
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
               as: "attendees_names"
           }
      }
   ])




   // I think this is what we need for the events bringer stuff

   db.events.aggregate([
   {
       $match : {"_id": ObjectId("58d54a8104ea01e8419ab2c8")}
   },
   {
       $unwind : "$things_needed"
   },
   {
       $project :
        {
            eventName : 1,
            things_needed : 1
       }
   },
   {
       $lookup :
        {
            from: "users",
            localField: "things_needed.claimedBy",
            foreignField: "email",
            as: "claimer"
        }
   },
   {
       $unwind : "$claimer"
   }
   ]);



   // creating a new event

   events.insert({
    eventName: "Taco Time",
    date: "2018-05-04",
    time: "12:00",
    location: "Taco Town",
    organizer: "tjohander@gmail.com",
    attendees:["tjohander@gmail.com"],
    things_needed: [ {name:'Tacos', claimedBy:'tjohander@gmail.com'}, {name:'Taco Sauce', claimedBy: ''} ]
});

// adding new items to the things_needed array


db.events.update(
  { _id : ObjectId("58d54a8104ea01e8419ab2c8")  },
  {
    "$push" : {
      "things_needed" : {
        "name" : "Sour Cream",
        "claimedBy" : ""
      }
    }
  }
);


// this version only returns documents for items that have been claimed.  Is this right for the "who claimed what" portion?

db.events.aggregate([
   {
       $match : {"_id": ObjectId("58d54a8104ea01e8419ab2c8")}
   },
   {
       $unwind : "$things_needed"
   },
   {
       $project :
        {
            eventName : 1,
            things_needed : 1
       }
   },
   {
       $lookup :
        {
            from: "users",
            localField: "things_needed.claimedBy",
            foreignField: "email",
            as: "claimer"
        }
   },
   {
       $unwind : "$claimer"
   }
   ]);

// this handles the query to get the array of claimed objects and it's claimer

   db.events.aggregate(
      [
      {
          $match : { _id : ObjectId("58d54a8104ea01e8419ab2c8") }
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
              "claimerLastName" : "$things_claimers.lastName"
          }
      }


      ])


// this is the query to get the unclamied objects:

db.events.aggregate([
{
    $match : {_id: ObjectId("58d54a8104ea01e8419ab2c8") }
},
{
    $unwind : "$things_needed"
},
{
    $match : {"things_needed.claimedBy" :  "" }
}
])


// this will get a specific item in an event's things_needed list.
// not too useful, becuase we actutally want to UPDATE a thing.
db.events.aggregate([
{
    $match : {_id: ObjectId("58d54a8104ea01e8419ab2c8") }
},
{
    $unwind : "$things_needed"
},
{
    $match : {"things_needed.name" :  "Sour Cream" }
}
])

//This will make user tjohander@gmail.com claim the Sour Cream for the event with the long ID:
db.events.update(
    {_id: ObjectId("58d54a8104ea01e8419ab2c8"), "things_needed.name" : "Sour Cream"},
    { $set : { "things_needed.$.claimedBy" : "tjohander@gmail.com"  } }
    )



//dataFActory 144-186
